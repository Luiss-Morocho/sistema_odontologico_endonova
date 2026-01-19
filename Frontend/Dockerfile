# Usamos Node.js
FROM node:18-alpine

# Carpeta de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código
COPY . .

# Exponer el puerto de Vite
EXPOSE 5173

# Iniciar en modo desarrollo
CMD ["npm", "run", "dev"]