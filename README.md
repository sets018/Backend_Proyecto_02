# Backend_Proyecto_02

Backend Biblioteca - API REST

Sistema de gestión para biblioteca (Usuarios, Libros, Reservas) desarrollado con Node.js, Express y MongoDB.

## Instalación y Ejecución

En el directorio biblioteca-backend


npm install

(para pruebas)

npm install --save-dev node-mocks-http

## Configurar variables de entorno

Crear un archivo .env en el directorio biblioteca-backend

PORT=3000

MONGO_URI=string_de_conexion_mongo

JWT_SECRET=palabra_secreta_para_token

Levantar el servidor:

npm run dev

Pruebas Automáticas (Jest)

npm test

Pruebas Manuales (cURL)

## Probar la API (manualmente) desde la terminal

(por defecto esta en el puerto 3000)

1. Registrar un Administrador

curl -X POST http://localhost:3000/api/users/register \
-H "Content-Type: application/json" \
-d '{"nombre":"Admin","email":"admin@test.com","password":"123","permisos":["crear_libro", "modificar_libro", "inhabilitar_libro"]}'

2. Iniciar Sesión (Login)
   
Copiar el "token" que devuelve este comando

curl -X POST http://localhost:3000/api/users/login \
-H "Content-Type: application/json" \
-d '{"email":"admin@test.com","password":"123"}'

3. Crear un Libro
   
Reemplazar TOKEN con el token copiado en el paso anterior

curl -X POST http://localhost:3000/api/books \
-H "Content-Type: application/json" \
-H "Authorization: TOKEN" \
-d '{"nombre":"El Principito","autor":"Antoine","genero":"Ficción","casa_editorial":"Reynal","fecha_publicacion":"1943-04-06"}'

4. Reservar un Libro
   
Reemplazar ID_LIBRO con el _id del paso 3

curl -X POST http://localhost:3000/api/reservations \
-H "Content-Type: application/json" \
-H "Authorization: TU_TOKEN" \
-d '{"bookId":"ID_LIBRO", "fecha_entrega":"2025-12-01"}'

5. Ver Libros (con filtros)

curl -X GET "http://localhost:3000/api/books?autor=Antoine"
