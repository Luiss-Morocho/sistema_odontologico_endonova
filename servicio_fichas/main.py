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

# 3. UPDATE (Editar una ficha existente)
@app.put("/fichas/{ficha_id}", response_model=Ficha)
def actualizar_ficha(ficha_id: int, ficha_actualizada: FichaBase, db: Session = Depends(get_db)):
    db_ficha = db.query(models.Ficha).filter(models.Ficha.id == ficha_id).first()
    
    if db_ficha is None:
        raise HTTPException(status_code=404, detail="Ficha no encontrada")
    
    # Actualizamos todos los campos automáticamente
    for key, value in ficha_actualizada.dict().items():
        setattr(db_ficha, key, value)
    
    db.commit()
    db.refresh(db_ficha)
    return db_ficha

# 4. DELETE (Borrar una ficha por error)
@app.delete("/fichas/{ficha_id}")
def eliminar_ficha(ficha_id: int, db: Session = Depends(get_db)):
    db_ficha = db.query(models.Ficha).filter(models.Ficha.id == ficha_id).first()
    
    if db_ficha is None:
        raise HTTPException(status_code=404, detail="Ficha no encontrada")
    
    db.delete(db_ficha)
    db.commit()
    return {"mensaje": "Ficha eliminada correctamente"}