from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# --- CONFIGURACIÓN DE CONEXIÓN A POSTGRESQL ---
# Estructura: postgresql://usuario:contraseña@servidor:puerto/nombre_base_datos
SQLALCHEMY_DATABASE_URL = "postgresql://postgres:root@localhost:5432/odontologia_db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL
)

# Creamos la sesión para interactuar con la base de datos
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Clase base para nuestros modelos (tablas)
Base = declarative_base()

# Dependencia que usará FastAPI en cada petición
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()