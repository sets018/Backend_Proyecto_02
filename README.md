# Backend_Proyecto_02

Backend Biblioteca - API REST
Sistema de gestión para biblioteca (Usuarios, Libros, Reservas) desarrollado con Node.js, Express y MongoDB.

Instalación y Ejecución
Instalar dependencias:

bash
npm install
Configurar variables de entorno:
Crea un archivo .env en la raíz del proyecto con tus credenciales:

env
PORT=3000
MONGO_URI=tu_string_de_conexion_mongo
JWT_SECRET=palabra_secreta_para_token
Levantar el servidor:

bash
npm run dev
Pruebas Automáticas (Jest)

bash
npm test
Pruebas Manuales (cURL)
Flujo básico para probar la API desde la terminal.

1. Registrar un Administrador

bash
curl -X POST http://localhost:3000/api/users/register \
-H "Content-Type: application/json" \
-d '{"nombre":"Admin","email":"admin@test.com","password":"123","permisos":["crear_libro", "modificar_libro", "inhabilitar_libro"]}'
2. Iniciar Sesión (Login)
Copia el "token" que devuelve este comando.

bash
curl -X POST http://localhost:3000/api/users/login \
-H "Content-Type: application/json" \
-d '{"email":"admin@test.com","password":"123"}'
3. Crear un Libro
Reemplaza TU_TOKEN con el token copiado en el paso anterior.

bash
curl -X POST http://localhost:3000/api/books \
-H "Content-Type: application/json" \
-H "Authorization: TU_TOKEN" \
-d '{"nombre":"El Principito","autor":"Antoine","genero":"Ficción","casa_editorial":"Reynal","fecha_publicacion":"1943-04-06"}'
4. Reservar un Libro
Reemplaza ID_LIBRO con el _id que te devolvió el paso 3.

bash
curl -X POST http://localhost:3000/api/reservations \
-H "Content-Type: application/json" \
-H "Authorization: TU_TOKEN" \
-d '{"bookId":"ID_LIBRO", "fecha_entrega":"2025-12-01"}'
5. Ver Libros (con filtros)

bash
curl -X GET "http://localhost:3000/api/books?autor=Antoine"