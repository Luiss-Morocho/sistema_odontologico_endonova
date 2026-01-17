from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
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

# --- ESQUEMAS ---
class OdontogramaBase(BaseModel):
    paciente_id: int
    estado_dientes: str # Recibiremos el JSON convertido a String

class OdontogramaCreate(OdontogramaBase):
    pass

# --- RUTAS ---

@app.post("/odontograma/")
def guardar_odontograma(dato: OdontogramaCreate, db: Session = Depends(get_db)):
    # 1. Buscamos si ya existe un odontograma para este paciente
    db_odonto = db.query(models.Odontograma).filter(models.Odontograma.paciente_id == dato.paciente_id).first()
    
    if db_odonto:
        # SI EXISTE: Actualizamos (UPDATE)
        db_odonto.estado_dientes_json = dato.estado_dientes
        db.commit()
        db.refresh(db_odonto)
        return {"mensaje": "Odontograma actualizado", "id": db_odonto.id}
    else:
        # NO EXISTE: Creamos uno nuevo (CREATE)
        nuevo = models.Odontograma(
            paciente_id=dato.paciente_id,
            estado_dientes_json=dato.estado_dientes
        )
        db.add(nuevo)
        db.commit()
        db.refresh(nuevo)
        return {"mensaje": "Odontograma creado", "id": nuevo.id}

@app.get("/odontograma/{paciente_id}")
def obtener_odontograma(paciente_id: int, db: Session = Depends(get_db)):
    # Buscamos el registro
    db_odonto = db.query(models.Odontograma).filter(models.Odontograma.paciente_id == paciente_id).first()
    
    if not db_odonto:
        # Si no hay nada guardado, devolvemos un objeto vacío
        return {"paciente_id": paciente_id, "estado_dientes": "{}"}
    
    # Devolvemos el string JSON para que el frontend lo convierta
    return {"paciente_id": db_odonto.paciente_id, "estado_dientes": db_odonto.estado_dientes_json}