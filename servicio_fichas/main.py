from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from datetime import date
import models
from database import engine, get_db

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class FichaBase(BaseModel):
    paciente_id: int
    fecha: date
    motivo_consulta: str
    antecedentes: str = ""
    causas: str = ""
    dolor_info: str = ""
    zona_periapical: str = ""
    bolsa_profundidad: str = ""
    movilidad: str = ""
    radiografia_camara: str = ""
    tratamiento_realizado: str = ""

class FichaCreate(FichaBase):
    pass

class Ficha(FichaBase):
    id: int
    class Config:
        orm_mode = True

@app.post("/fichas/", response_model=Ficha)
def crear_ficha(ficha: FichaCreate, db: Session = Depends(get_db)):
    db_ficha = models.Ficha(**ficha.dict())
    db.add(db_ficha)
    db.commit()
    db.refresh(db_ficha)
    return db_ficha

@app.get("/fichas/{paciente_id}", response_model=List[Ficha])
def obtener_fichas(paciente_id: int, db: Session = Depends(get_db)):
    return db.query(models.Ficha).filter(models.Ficha.paciente_id == paciente_id).order_by(models.Ficha.fecha.desc()).all()