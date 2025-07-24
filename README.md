# Documentación técnica

## 📁 Estructura del proyecto

```
┣ 📂.github
┣ 📂prisma
┃ ┣ 📜schema.prisma
┃ ┗ 📜migrations/
┣ 📂src
┃ ┣ 📂features
┃ ┃ ┗ 📂users
┃ ┃   ┣ 📂controllers
┃ ┃   ┣ 📂dtos
┃ ┃   ┣ 📂entities
┃ ┃   ┣ 📂repository
┃ ┃   ┣ 📂services
┃ ┃   ┗ 📜users.module.ts
┃ ┣ 📂shared
┃ ┃ ┣ 📂config
┃ ┃ ┃ ┣ 📜configuration.ts
┃ ┃ ┃ ┗ 📜envs.ts
┃ ┃ ┣ 📂filters
┃ ┃ ┃ ┗ 📜http-exception.filter.ts
┃ ┃ ┣ 📂interceptors
┃ ┃ ┃ ┗ 📜response.interceptor.ts
┃ ┃ ┣ 📂prisma
┃ ┃ ┃ ┗ 📜prisma.service.ts
┃ ┃ ┗ 📂utils
┃ ┃   ┗ 📜hash.util.ts
┃ ┣ 📜app.module.ts
┃ ┗ 📜main.ts
┣ 📜.env
┣ 📜.env.example
┣ 📜docker-compose.yml
┣ 📜package.json
┣ 📜tsconfig.json
┗ 📜README.md
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
```

2. Genera el cliente Prisma y aplica las migraciones:

```
npx prisma generate
npx prisma migrate dev --name init
```

3. Inicia el servidor:

```
npm run start:dev
```

La API estará disponible en: `http://localhost:5000/api`

---

## Levantar el proyecto con Docker

1. Configura tu archivo `.env`
2. Ejecuta los contenedores:

```
docker-compose up -d
```

Esto levanta el contenedor de PostgreSQL y NestJS, aplicando todo lo necesario automáticamente.

---

## Pruebas unitarias (próximamente)

> En futuras versiones se incluirán pruebas con Jest y Supertest.

---

## Migraciones Prisma

Para crear una nueva tabla o modificar el schema:

```
npx prisma migrate dev --name nombre_migracion
```

Para revisar el estado:

```
npx prisma studio
```

---

## Colección Postman

- Puedes importar las rutas desde la raiz con el archivo `collection.json` (opcional).
- Asegúrate de configurar la variable `{{base_url}}` con `http://localhost:5000/api`

---

## Comandos útiles

| Comando | Descripción |
|--------|-------------|
| `npm run start:dev` | Inicia el servidor en modo desarrollo |
| `npm run format` | Formatea el código con Prettier |
| `npm run lint` | Ejecuta linter con las reglas definidas |
| `npx prisma studio` | UI para explorar la base de datos |
| `npx prisma migrate dev` | Ejecuta migraciones pendientes |

---

## Generación de módulos

> Puedes crear un módulo con NestJS CLI y luego moverlo a `src/features/<nombre>`

```
nest g resource features/<nombre>
```

Luego recuerda:
- Separar DTOs, controllers, services y repositories
- Usar `@features` y `@shared` como alias de importación
- Mantener lógica de acceso a datos dentro del `*.repository.ts`

---

