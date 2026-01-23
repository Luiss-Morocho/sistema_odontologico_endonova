from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
import models
from database import engine, get_db

# Crear tablas
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- TUS ESQUEMAS (Pydantic) ---
class PacienteBase(BaseModel):
    cedula: str
    nombres: str
    edad: int
    domicilio: str
    telefono: str
    email: Optional[str] = None

class PacienteCreate(PacienteBase):
    pass

class Paciente(PacienteBase):
    id: int
    class Config:
        orm_mode = True

# --- RUTAS CRUD ---

# 1. CREATE (Crear)
@app.post("/pacientes/", response_model=Paciente)
def crear_paciente(paciente: PacienteCreate, db: Session = Depends(get_db)):
    # Validar si la cédula ya existe
    existe = db.query(models.Paciente).filter(models.Paciente.cedula == paciente.cedula).first()
    if existe:
        raise HTTPException(status_code=400, detail="Ya existe un paciente con esa cédula")

    db_paciente = models.Paciente(**paciente.dict())
    db.add(db_paciente)
    db.commit()
    db.refresh(db_paciente)
    return db_paciente

# 2. READ ALL (Leer todos)
@app.get("/pacientes/", response_model=List[Paciente])
def obtener_pacientes(db: Session = Depends(get_db)):
    return db.query(models.Paciente).all()

# 3. READ ONE (Leer uno por ID)
@app.get("/pacientes/{paciente_id}", response_model=Paciente)
def obtener_paciente(paciente_id: int, db: Session = Depends(get_db)):
    paciente = db.query(models.Paciente).filter(models.Paciente.id == paciente_id).first()
    if paciente is None:
        raise HTTPException(status_code=404, detail="Paciente no encontrado")
    return paciente

# 4. UPDATE (Actualizar - Nuevo)
@app.put("/pacientes/{paciente_id}", response_model=Paciente)
def actualizar_paciente(paciente_id: int, paciente_actualizado: PacienteBase, db: Session = Depends(get_db)):
    # Buscamos en la base de datos (models.Paciente)
    db_paciente = db.query(models.Paciente).filter(models.Paciente.id == paciente_id).first()
    
    if db_paciente is None:
        raise HTTPException(status_code=404, detail="Paciente no encontrado")
    
    # Actualizamos los campos usando TUS variables
    db_paciente.cedula = paciente_actualizado.cedula
    db_paciente.nombres = paciente_actualizado.nombres
    db_paciente.edad = paciente_actualizado.edad
    db_paciente.domicilio = paciente_actualizado.domicilio
    db_paciente.telefono = paciente_actualizado.telefono
    db_paciente.email = paciente_actualizado.email
    
    db.commit()
    db.refresh(db_paciente)
    return db_paciente

# 5. DELETE (Eliminar - Nuevo)
@app.delete("/pacientes/{paciente_id}")
def eliminar_paciente(paciente_id: int, db: Session = Depends(get_db)):
    db_paciente = db.query(models.Paciente).filter(models.Paciente.id == paciente_id).first()
    
    if db_paciente is None:
        raise HTTPException(status_code=404, detail="Paciente no encontrado")
    
    db.delete(db_paciente)
    db.commit()
    return {"mensaje": "Paciente eliminado correctamente"}