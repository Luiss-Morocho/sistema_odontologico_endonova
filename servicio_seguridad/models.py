from sqlalchemy import Column, Integer, String
from database import Base

class Usuario(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True) # Nombre de usuario único
    password = Column(String) # Aquí guardaremos la contraseña ENCRIPTADA
    nombre_completo = Column(String)
    rol = Column(String, default="admin") # Por si a futuro tienes roles (admin, secretaria)