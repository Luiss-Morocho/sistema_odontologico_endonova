from sqlalchemy import Column, Integer, String, Date, Text
from database import Base

class Ficha(Base):
    __tablename__ = "fichas"

    id = Column(Integer, primary_key=True, index=True)
    paciente_id = Column(Integer, index=True)
    fecha = Column(Date)
    
    # 1. Cabecera
    motivo_consulta = Column(String)
    antecedentes = Column(Text)
    
    # 2. Causas (Guardaremos las seleccionadas separadas por comas)
    causas = Column(String) 
    
    # 3. Dolor (Guardaremos un JSON o texto estructurado con Naturaleza, Calidad, etc.)
    dolor_info = Column(Text)
    
    # 4. Zona Periapical
    zona_periapical = Column(String)
    
    # 5. Examen Periodontal
    bolsa_profundidad = Column(String)
    movilidad = Column(String)
    
    # 6. Evaluación Radiográfica (Cámara)
    radiografia_camara = Column(String)
    
    # 7. Tratamiento
    tratamiento_realizado = Column(Text)