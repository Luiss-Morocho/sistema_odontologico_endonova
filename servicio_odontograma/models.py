from sqlalchemy import Column, Integer, String, Text
from database import Base

class Odontograma(Base):
    __tablename__ = "odontogramas"

    id = Column(Integer, primary_key=True, index=True)
    paciente_id = Column(Integer, unique=True, index=True) # Un solo mapa por paciente
    # Aquí guardaremos todo el objeto JSON como texto
    estado_dientes_json = Column(Text)