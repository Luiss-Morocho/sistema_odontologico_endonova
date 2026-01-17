from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
from passlib.context import CryptContext # Para encriptar
import models
from database import engine, get_db

# Crear tablas
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Microservicio de Autenticación")

# Configuración de CORS (Igual que los otros)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- AQUÍ ESTÁ EL CAMBIO (Línea 24) ---
# Cambiamos "bcrypt" por "pbkdf2_sha256" para arreglar el error de Windows
pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")

# --- ESQUEMAS ---
class UsuarioBase(BaseModel):
    username: str
    password: str

class UsuarioCreate(UsuarioBase):
    nombre_completo: str

class LoginRequest(BaseModel):
    username: str
    password: str

# --- UTILIDADES ---
def encriptar_password(password: str):
    return pwd_context.hash(password)

def verificar_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

# --- RUTAS ---

@app.post("/registrar/")
def registrar_usuario(usuario: UsuarioCreate, db: Session = Depends(get_db)):
    # 1. Verificar si ya existe
    db_user = db.query(models.Usuario).filter(models.Usuario.username == usuario.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="El usuario ya existe")
    
    # 2. Guardar usuario con contraseña ENCRIPTADA
    nuevo_usuario = models.Usuario(
        username=usuario.username,
        password=encriptar_password(usuario.password), 
        nombre_completo=usuario.nombre_completo
    )
    db.add(nuevo_usuario)
    db.commit()
    db.refresh(nuevo_usuario)
    return {"mensaje": "Usuario creado exitosamente"}

@app.post("/login/")
def login(request: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(models.Usuario).filter(models.Usuario.username == request.username).first()
    
    # Verificar si el usuario existe Y si la contraseña coincide
    if not user or not verificar_password(request.password, user.password):
        raise HTTPException(status_code=401, detail="Credenciales incorrectas")
    
    return {"mensaje": "Login exitoso", "usuario": user.nombre_completo, "rol": user.rol}