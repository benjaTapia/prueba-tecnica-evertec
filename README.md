# Problemáticas 1, 2 y 3

Importante:

 * La carpeta PruebaEstudiantes contiene la Problemática 1 (carga de archivo de texto a la base de datos).

 * La carpeta problematica2-api contiene la Problemática 2 (API REST) y la Problemática 3 (interfaz web dentro de public/).

Este repositorio contiene el desarrollo completo de una prueba técnica dividida en tres problemáticas relacionadas entre sí:

 * Problemática 1: Carga de deudas desde un archivo de texto hacia la base de datos.

 * Problemática 2: API REST para gestionar las deudas (CRUD y filtros).

 * Problemática 3: Reporte web que consume la API y permite filtrar deudas por ID de cliente y fecha de vencimiento.

Todas las problemáticas utilizan la misma base de datos y la misma tabla deudas.

1. Estructura del proyecto

```text
.
├─ problematica2-api/                ← Problemática 2 + 3
│   ├─ node_modules/
│   ├─ package.json
│   ├─ package-lock.json
│   ├─ .env
│   ├─ server.js
│   └─ problematica3-reporte/
│       └─ public/
│           ├─ index.html
│           ├─ styles.css
│           ├─ app.js
│           └─ img/
│               └─ evertec-logo.png
│
├─ Problematicas y Diagramas/        ← Informes, PDFs, SQL, diagramas UML
│   ├─ creacion_bd_deudas.sql
│   ├─ Problematica 1.pdf
│   ├─ Problematica 2 - Informe.pdf
│   ├─ Problematica 3.pdf
│   └─ Diagramas Prueba Técnica.pdf
│
└─ PruebaEstudiantes/                ← Problemática 1
    ├─ cargar_deudas.py
    └─ deuda_clientes.txt


```

2. Requisitos previos

 * MySQL instalado y en ejecución.

 * Node.js 18+

 * Python 3.x (solo para Problemática 1)

3. Base de datos

Las tres problemáticas comparten la misma base de datos.

```text

CREATE DATABASE IF NOT EXISTS deudas_clientes
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE deudas_clientes;


```

Creación de la tabla deudas


```text

CREATE TABLE deudas (
  id_deuda          VARCHAR(15)   NOT NULL,
  id_cliente        VARCHAR(15)   NOT NULL,
  nombre_cliente    VARCHAR(60)   NOT NULL,
  correo            VARCHAR(60)   NOT NULL,
  monto_deuda       DECIMAL(20,2) NOT NULL,
  fecha_vencimiento DATE          NOT NULL,
  PRIMARY KEY (id_deuda),
  INDEX idx_cliente (id_cliente),
  INDEX idx_fecha_venc (fecha_vencimiento)
);

```
4. Problemática 1 – Carga de deudas (archivo de texto a base de datos)

Ubicación del código

* Carpeta: PruebaEstudiantes/

* Archivos:

  * cargar_deudas.py

  * deuda_clientes.txt

Instalación de librerías

Instalar el conector de MySQL:


```text

pip install mysql-connector-python


```

Ejecución

```text

cd PruebaEstudiantes
python cargar_deudas.py


```
Resultado

Los registros del archivo .txt son cargados en la BD.

Puedes verificar:

```text

SELECT * FROM deudas;

```

5. Problemática 2 – API REST de deudas (Node.js + Express)

Ubicación del código

* Carpeta: problematica2-api/

* Archivos principales:

 * server.js

 * .env

 * package.json

Contenido de .env

```text

DB_HOST=localhost
DB_USER=tu_usuario_mysql
DB_PASSWORD=tu_password_mysql
DB_NAME=deudas_clientes
DB_PORT=3306

BASIC_USER=admin
BASIC_PASS=admin123

```

Instalación

```text

cd problematica2-api
npm install

```

Ejecución

```text

node server.js

```

La API quedará disponible en:

```text

• http://localhost:3000

• Swagger: http://localhost:3000/api-docs

Endpoints principales

• GET /api/deudas

• GET /api/deudas/{id_deuda}

• POST /api/deudas

• PUT /api/deudas/{id_deuda}

• DELETE /api/deudas/{id_deuda}

• GET /api/deudas soporta filtros por clienteId y fechaVencimiento.

```

6. Problemática 3 – Reporte web de deudas (Frontend simple)

Objetivo: mostrar un reporte web con todas las deudas y permitir filtrar por ID de cliente y fecha de vencimiento.

Ubicación

 * Carpeta: problematica2-api/problematica3-reporte/public/

Archivos

 * index.html

 * styles.css

 * app.js

 * img/evertec-logo.png

Uso

Con la API ejecutándose (node server.js), abrir:

```text

http://localhost:3000/

```

Incluye

 * Logo Evertec

 * Filtros por:

   * ID Cliente
     
   * Fecha de vencimiento

Tabla de deudas cargada dinamicamente desde la API

7. Orden recomendado de ejecución

   * Crear base de datos y tabla deudas.

Ejecutar Problemática 1:

```text

python cargar_deudas.py

```
Ejecutar Problemática 2:
```text

node server.js

```
Abrir el front de la Problemática 3:
   
```text

http://localhost:3000/

```
8. Notas finales

 * Todo el proyecto está estructurado para ejecutarse localmente.

 * La API sirve automáticamente el frontend.

 * Los diagramas, informes y script SQL están en la carpeta Problematicas y Diagramas.
