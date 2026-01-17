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

# --- ESQUEMA ACTUALIZADO ---
class PacienteBase(BaseModel):
    cedula: str # <--- NUEVO
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

# --- RUTAS ---
@app.post("/pacientes/", response_model=Paciente)
def crear_paciente(paciente: PacienteCreate, db: Session = Depends(get_db)):
    # Validar si la cédula ya existe antes de guardar
    existe = db.query(models.Paciente).filter(models.Paciente.cedula == paciente.cedula).first()
    if existe:
        raise HTTPException(status_code=400, detail="Ya existe un paciente con esa cédula")

    db_paciente = models.Paciente(**paciente.dict())
    db.add(db_paciente)
    db.commit()
    db.refresh(db_paciente)
    return db_paciente

@app.get("/pacientes/", response_model=List[Paciente])
def obtener_pacientes(db: Session = Depends(get_db)):
    return db.query(models.Paciente).all()

@app.get("/pacientes/{paciente_id}", response_model=Paciente)
def obtener_paciente(paciente_id: int, db: Session = Depends(get_db)):
    return db.query(models.Paciente).filter(models.Paciente.id == paciente_id).first()