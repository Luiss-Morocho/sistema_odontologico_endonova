# 🦷 Endonova - Sistema de Gestión Odontológica

![Estado del Proyecto](https://img.shields.io/badge/Estado-Finalizado-success)
![Docker](https://img.shields.io/badge/Docker-Enabled-blue?logo=docker)
![Microservicios](https://img.shields.io/badge/Arquitectura-Microservicios-orange)

**Endonova** es una plataforma integral para la administración clínica, diseñada con una arquitectura moderna de **Microservicios**. Permite la gestión eficiente de pacientes, historias clínicas y odontogramas interactivos, garantizando escalabilidad y seguridad.

---

## 🚀 Tecnologías Utilizadas

El sistema está construido con un stack tecnológico robusto y moderno:

### **Frontend (Cliente)**
* ⚛️ **React + Vite:** Para una interfaz ultra rápida y reactiva.
* 🎨 **Bootstrap 5:** Diseño responsivo y profesional.
* 🔌 **Axios:** Comunicación asíncrona con los microservicios.

### **Backend (Microservicios)**
* 🐍 **Python + FastAPI:** 4 APIs independientes de alto rendimiento.
* 🗄️ **PostgreSQL:** Base de datos relacional robusta.
* 🔐 **JWT:** Sistema de autenticación seguro.

### **Infraestructura**
* 🐳 **Docker & Docker Compose:** Orquestación completa del entorno de desarrollo.

---

## 🏗️ Arquitectura del Sistema

El proyecto se divide en 5 contenedores aislados que se comunican entre sí:

| Servicio | Puerto | Descripción |
| :--- | :--- | :--- |
| **Frontend** | `5173` | Interfaz de usuario (SPA). |
| **API Seguridad** | `8003` | Gestión de usuarios y autenticación (Login). |
| **API Pacientes** | `8000` | CRUD completo de información personal. |
| **API Fichas** | `8001` | Historial médico y antecedentes. |
| **API Odontograma** | `8002` | Lógica de tratamientos dentales. |
| **Base de Datos** | `5432` | Persistencia de datos (PostgreSQL). |

---

## 🛠️ Instalación y Despliegue

¡Olvídate de instalaciones complejas! Este proyecto es **Cloud-Native**.

### Requisitos Previos
* Tener instalado [Docker Desktop](https://www.docker.com/products/docker-desktop/).
* *(No es necesario instalar Python, Node.js ni PostgreSQL localmente)*.

### ⚡ Despliegue Rápido (Recomendado)

1.  **Clonar el repositorio:**
    ```bash
    git clone [https://github.com/Luiss-Morocho/sistema_odontologico_endonova.git](https://github.com/Luiss-Morocho/sistema_odontologico_endonova.git)
    cd sistema_odontologico_endonova
    ```

2.  **Iniciar el entorno:**
    Ejecuta el siguiente comando en la raíz del proyecto:
    ```bash
    docker-compose up --build
    ```

3.  **¡Listo!** 🚀
    Accede al sistema desde tu navegador:
    > **http://localhost:5173**

---

## 👤 Autores

**Luis Morocho**
...
...
...

* Ingeniero de Software en formación.
* [GitHub Profile](https://github.com/Luiss-Morocho)

---
