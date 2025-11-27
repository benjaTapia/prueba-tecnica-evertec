# Problemáticas 1, 2 y 3

Importante: La carpeta "PruebaEstuidantes" contiene la Problemática 1 y la carpeta "problemática2-api" contiene la problematica 2 mas la interfaz web que sería la problemática 3

Este repositorio contiene el desarrollo de una prueba técnica dividida en tres problemáticas relacionadas entre sí:

- **Problemática 1**: Carga de deudas desde un archivo de texto hacia la base de datos.  
- **Problemática 2**: API REST para gestionar las deudas (CRUD y filtros).  
- **Problemática 3**: Reporte web que consume la API y permite filtrar deudas por ID de cliente y fecha de vencimiento.

Todas las problemáticas utilizan la misma base de datos y la misma tabla `deudas`.

---

## 1. Estructura del proyecto

Ejemplo de estructura de carpetas:

```text
.
├─ problematica1-carga/
│   ├─ src/                  (código de carga si corresponde)
│   └─ deuda_clientes.txt    (archivo de entrada con deudas)
│
├─ problematica2-api/
│   ├─ server.js             (API REST Node.js/Express)
│   ├─ package.json
│   ├─ .env                  (configuración BD y Basic Auth)
│   └─ ...                   (otros archivos propios de la API)
│
└─ problematica3-reporte/
    └─ public/
        ├─ index.html        (página principal del reporte)
        ├─ styles.css        (estilos del reporte)
        ├─ app.js            (lógica del front para consumir la API)
        └─ img/
           └─ evertec-logo.png

```

2. Requisitos previos

• MySQL instalado y en ejecución.

• Node.js versión 18 o superior.

• Para la Problemática 1:

   • Si está desarrollada en Java: JDK 8 o superior e IDE o herramientas de compilación (por ejemplo Maven o Gradle).

   • Si está desarrollada en Node.js: solo Node.js.

3. Base de datos

Las tres problemáticas comparten la misma base de datos.

```text
CREATE DATABASE deudas_clientes;
USE deudas_clientes;

```

3.2 Creación de la tabla deudas


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

Objetivo: leer un archivo de texto con deudas de clientes e insertarlas en la tabla deudas.

4.1 Ubicación del código

• Carpeta: problematica1-carga/

• Archivo de entrada: deuda_clientes.txt

• Clases típicas:

   • DeudaCliente

   • AppCargaDeudas (programa principal)

   • ConexionBD (configuración de conexión a MySQL)

4.2 Configuración de conexión

Configura la conexión a la base de datos con:

• Host: localhost

• Puerto: 3306

• Base de datos: deudas_clientes

• Usuario y contraseña de MySQL según tu entorno.

4.3 Ejecución (ejemplo)

Si está en Java:

1. Abrir problematica1-carga en el IDE.

2. Compilar el proyecto.

3. Ejecutar la clase AppCargaDeudas.

4. Verificar en MySQL:


```text

SELECT * FROM deudas;


```

Si está en Node.js:

```text

cd problematica1-carga
npm install
node index.js


```

5. Problemática 2 – API REST de deudas

Objetivo: exponer la información de deudas mediante una API REST documentada con Swagger.

5.1 Ubicación del código

• Carpeta: problematica2-api/

• Archivos: server.js, package.json, .env

5.2 Archivo .env

```text

DB_HOST=localhost
DB_USER=tu_usuario_mysql
DB_PASSWORD=tu_password_mysql
DB_NAME=deudas_clientes
DB_PORT=3306

BASIC_USER=admin
BASIC_PASS=admin123

```

5.3 Instalación

```text

cd problematica2-api
npm install

```

5.4 Ejecución

```text

node server.js
# o
npm start

```

La API quedará disponible en:

```text

• http://localhost:3000

• Swagger: http://localhost:3000/api-docs

5.5 Endpoints principales

• GET /api/deudas

• GET /api/deudas/{id_deuda}

• POST /api/deudas

• PUT /api/deudas/{id_deuda}

• DELETE /api/deudas/{id_deuda}

• GET /api/deudas soporta filtros por clienteId y fechaVencimiento.

```

6. Problemática 3 – Reporte web de deudas

Objetivo: mostrar un reporte web con todas las deudas y permitir filtrar por ID de cliente y fecha de vencimiento.

6.1 Ubicación del código

• Carpeta: problematica3-reporte/public/

• Archivos:

  • index.html

  • styles.css

  • app.js

  • img/evertec-logo.png

El server.js de la API sirve estos archivos como contenido estático.

6.2 Uso

Con la API en ejecución (node server.js en problematica2-api), abrir en el navegador:

```text

)](http://localhost:3000/)

```

La página muestra:

• Encabezado con el logo.

• Formulario de filtros (ID cliente y fecha de vencimiento).

• Tabla con las deudas.
