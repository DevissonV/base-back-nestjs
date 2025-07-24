
# Documentación técnica

## 📁 Estructura del proyecto

El sistema sigue una arquitectura modular por features, con una capa shared/ para lógica transversal y reutilizable. Cada módulo encapsula su propia lógica de negocio, controladores, servicios y acceso a datos, siguiendo buenas prácticas de escalabilidad.

```
📂 src/
┣ 📂 features/              # Módulos funcionales del negocio
┃ ┣ 📂 auth/                # Módulo de autenticación (login, tokens)
┃ ┃ ┣ 📂 controllers/
┃ ┃ ┣ 📂 dtos/
┃ ┃ ┣ 📂 services/
┃ ┃ ┣ 📂 strategies/
┃ ┃ ┣ 📂 types/
┃ ┃ ┗ 📜 auth.module.ts
┃ ┣ 📂 users/               # Módulo de gestión de usuarios
┃ ┃ ┣ 📂 controllers/
┃ ┃ ┣ 📂 dtos/
┃ ┃ ┣ 📂 entities/
┃ ┃ ┣ 📂 repository/
┃ ┃ ┣ 📂 services/
┃ ┃ ┗ 📜 users.module.ts
┣ 📂 shared/                # Código reutilizable y transversal
┃ ┣ 📂 config/              # Configuración del entorno
┃ ┣ 📂 constants/           # Enums globales (roles, etc)
┃ ┣ 📂 decorators/          # Decoradores personalizados (ej: @CurrentUser)
┃ ┣ 📂 filters/             # Filtros globales de excepciones
┃ ┣ 📂 guards/              # Guards de autorización/autenticación
┃ ┣ 📂 interceptors/        # Interceptores globales de respuesta
┃ ┣ 📂 prisma/              # PrismaService centralizado
┃ ┗ 📂 utils/               # Funciones utilitarias (hash, fechas, etc.)
┣ 📜 app.module.ts          # Módulo raíz de la aplicación
┗ 📜 main.ts               # Punto de entrada principal


```

##  Requisitos previos

- Node.js v20+
- Docker y Docker Compose
- PostgreSQL (si lo usas fuera de Docker)
- Copiar `.env.example` y renombrarlo como `.env`
- Configurar correctamente las variables de entorno

---

##  Instalación en local (sin Docker)

> ⚠️ Requiere una base de datos PostgreSQL activa

1. Instala dependencias:

```
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run start:dev
```

La API estará disponible en: `http://localhost:5000/api`

---

## Levantar el proyecto con Docker

### Ambiente completo (App + DB):

```
docker-compose up -d
```

Esto levanta el contenedor de PostgreSQL y NestJS. Usa `.env` como fuente de variables.

### Solo app (producción con BD externa):

```
docker compose -f docker-compose.prod.yml up --build
```

Usa `Dockerfile.prod` y un `.env` con una `DATABASE_URL` real, como Railway, Neon o aws, es decir crea el archivo .env en base al .env-example y configura las variables de entorno

### Solo base de datos:

```
docker compose -f docker-compose.db.yml up -d
```

Usalo si desarrollas en local, pero deseas una DB contenida.

tener en cuenta que si haces esto *TIENES* que generar las migraciones: 

```
npx prisma generate
npx prisma migrate dev --name init
npm run start:dev
```

---

## Pruebas unitarias (próximamente)

> En futuras versiones se incluirán pruebas con Jest y Supertest.

---

---

## Para crear las semillas de datos iniciales

Para crear los datos necesarios para levantar la aplicacion ejecutar el seed:

```
npm run seed:all
```

---

## Migraciones Prisma

```bash
npx prisma migrate dev --name nombre_migracion
npx prisma studio
```

---

## Colección Postman

- Puedes importar las rutas desde `collection.json`.
- Usa `{{base_url}} = http://localhost:5000/api`

---

## Comandos útiles

| Comando                   | Descripción                                 |
|--------------------------|---------------------------------------------|
| `npm run start:dev`      | Modo desarrollo                             |
| `npm run start:prod`     | Modo producción (node dist/main)            |
| `npm run format`         | Prettier                                    |
| `npm run lint`           | Eslint                                      |
| `npx prisma studio`      | UI de la base de datos                      |
| `npx prisma migrate dev` | Aplica migraciones                          |

---

## Generación de módulos

```bash
nest g resource features/<nombre>
```

Luego:
- Mover todo a `src/features/<nombre>`
- Separar bien controladores, dtos, servicios y repositorios
- Usar alias `@features` y `@shared`
- Evitar lógica de BD en los servicios

---

## Estrategia de Dockerización

> El sistema usa 3 modos de Dockerización:

| Archivo                     | Propósito                                                    |
|----------------------------|--------------------------------------------------------------|
| `docker-compose.yml`       | Desarrollar todo con contenedores (app + DB)                 |
| `docker-compose.prod.yml`  | Ejecutar solo la app en contenedor con una BD externa        |
| `docker-compose.db.yml`    | Ejecutar solo una BD en contenedor, útil para desarrollo local|

---
