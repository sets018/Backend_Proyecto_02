#!/bin/bash

# Nombre del proyecto
PROJECT_NAME="biblioteca-backend"

echo "========================================="
echo "Iniciando configuración de: $PROJECT_NAME"
echo "========================================="

# 1. Crear carpeta raíz y entrar
mkdir -p $PROJECT_NAME
cd $PROJECT_NAME

# 2. Inicializar Node.js
echo "[+] Inicializando proyecto Node.js..."
npm init -y > /dev/null

# 3. Instalar dependencias
echo "[+] Instalando dependencias de producción (Express, Mongoose, JWT, etc)..."
npm install express mongoose dotenv bcryptjs jsonwebtoken cors

echo "[+] Instalando dependencias de desarrollo (Jest, Nodemon)..."
npm install --save-dev jest supertest nodemon

# 4. Crear estructura de carpetas
echo "[+] Creando estructura de directorios..."
mkdir -p src/config
mkdir -p src/controllers
mkdir -p src/models
mkdir -p src/middlewares
mkdir -p src/routes
mkdir -p tests

# 5. Crear archivos vacíos
echo "[+] Creando archivos base..."

# Configuración y Entry Point
touch src/config/db.js
touch src/app.js
touch .env

# Modelos
touch src/models/User.js
touch src/models/Book.js
touch src/models/Reservation.js

# Controladores
touch src/controllers/auth.controller.js
touch src/controllers/user.controller.js
touch src/controllers/book.controller.js
touch src/controllers/reservation.controller.js

# Middlewares
touch src/middlewares/auth.js

# Rutas
touch src/routes/user.routes.js
touch src/routes/book.routes.js
touch src/routes/reservation.routes.js

# Pruebas
touch tests/user.controller.test.js
touch tests/book.controller.test.js

# 6. Configurar .gitignore 
echo "[+] Configurando .gitignore..."
echo "node_modules/" > .gitignore
echo ".env" >> .gitignore
echo ".DS_Store" >> .gitignore
echo "coverage/" >> .gitignore

# 7. Configurar scripts en package.json 
npm pkg set scripts.start="node src/app.js"
npm pkg set scripts.dev="nodemon src/app.js"
npm pkg set scripts.test="jest"
