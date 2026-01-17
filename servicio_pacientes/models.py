# servicio_pacientes/models.py
from sqlalchemy import Column, Integer, String
from database import Base

class Paciente(Base):
    __tablename__ = "pacientes"

    id = Column(Integer, primary_key=True, index=True)
    cedula = Column(String, unique=True, index=True)
    nombres = Column(String, index=True) # Fuente: NOMBRES APELLIDOS [cite: 1]
    edad = Column(Integer)               # Fuente: EDAD [cite: 1]
    domicilio = Column(String)           # Fuente: DOMICILIO [cite: 2]
    telefono = Column(String)            # Fuente: TELEFONO [cite: 3]
    email = Column(String, nullable=True) # Extra útil