// server.js
const express = require('express');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');

dotenv.config();

const app = express();
app.use(express.json());

// 1. Pool de conexión a la base de datos
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

// 2. Middleware de autenticación básica
function basicAuth(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Basic ')) {
    res.setHeader('WWW-Authenticate', 'Basic realm="DeudasAPI"');
    return res.status(401).json({ mensaje: 'Autenticación requerida' });
  }

  const base64Credentials = authHeader.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString('utf8');
  const [user, pass] = credentials.split(':');

  if (user === process.env.BASIC_USER && pass === process.env.BASIC_PASS) {
    return next();
  }

  return res.status(403).json({ mensaje: 'Credenciales inválidas' });
}

/**
 * @swagger
 * components:
 *   schemas:
 *     Deuda:
 *       type: object
 *       properties:
 *         id_deuda:
 *           type: string
 *         id_cliente:
 *           type: string
 *         nombre_cliente:
 *           type: string
 *         correo:
 *           type: string
 *         monto_deuda:
 *           type: number
 *         fecha_vencimiento:
 *           type: string
 *           format: date
 */

/**
 * @swagger
 * /api/deudas:
 *   get:
 *     summary: Lista deudas (permite filtros opcionales por cliente y fecha)
 *     tags: [Deudas]
 *     parameters:
 *       - in: query
 *         name: clienteId
 *         schema:
 *           type: string
 *         required: false
 *         description: ID del cliente
 *       - in: query
 *         name: fechaVencimiento
 *         schema:
 *           type: string
 *           format: date
 *         required: false
 *         description: Fecha de vencimiento de la deuda (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Lista de deudas
 */
app.get('/api/deudas', async (req, res) => {
  const { clienteId, fechaVencimiento } = req.query;

  let sql = 'SELECT * FROM deudas WHERE 1 = 1';
  const params = [];

  if (clienteId) {
    sql += ' AND id_cliente = ?';
    params.push(clienteId);
  }

  if (fechaVencimiento) {
    sql += ' AND fecha_vencimiento = ?';
    params.push(fechaVencimiento);
  }

  try {
    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener deudas:', error);
    res.status(500).json({ mensaje: 'Error al obtener deudas' });
  }
});

// 👉 A partir de aquí, TODO lo que sea /api/* queda protegido con Basic Auth
app.use('/api', basicAuth);

/**
 * @swagger
 * /api/deudas/{id_deuda}:
 *   get:
 *     summary: Obtiene una deuda por su ID
 *     tags: [Deudas]
 *     parameters:
 *       - in: path
 *         name: id_deuda
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Deuda encontrada
 *       404:
 *         description: Deuda no encontrada
 */
app.get('/api/deudas/:id_deuda', async (req, res) => {
  const { id_deuda } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM deudas WHERE id_deuda = ?', [id_deuda]);
    if (rows.length === 0) {
      return res.status(404).json({ mensaje: 'Deuda no encontrada' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener la deuda' });
  }
});

/**
 * @swagger
 * /api/deudas:
 *   post:
 *     summary: Crea una nueva deuda
 *     tags: [Deudas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Deuda'
 *     responses:
 *       201:
 *         description: Deuda creada
 */
app.post('/api/deudas', async (req, res) => {
  const {
    id_deuda,
    id_cliente,
    nombre_cliente,
    correo,
    monto_deuda,
    fecha_vencimiento,
  } = req.body;

  try {
    await pool.query(
      'INSERT INTO deudas (id_deuda, id_cliente, nombre_cliente, correo, monto_deuda, fecha_vencimiento) VALUES (?,?,?,?,?,?)',
      [id_deuda, id_cliente, nombre_cliente, correo, monto_deuda, fecha_vencimiento]
    );
    res.status(201).json({ mensaje: 'Deuda creada correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al crear la deuda' });
  }
});

/**
 * @swagger
 * /api/deudas/{id_deuda}:
 *   put:
 *     summary: Actualiza una deuda existente
 *     tags: [Deudas]
 *     parameters:
 *       - in: path
 *         name: id_deuda
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Deuda'
 *     responses:
 *       200:
 *         description: Deuda actualizada
 *       404:
 *         description: Deuda no encontrada
 */
app.put('/api/deudas/:id_deuda', async (req, res) => {
  const { id_deuda } = req.params;
  const {
    id_cliente,
    nombre_cliente,
    correo,
    monto_deuda,
    fecha_vencimiento,
  } = req.body;

  try {
    const [result] = await pool.query(
      'UPDATE deudas SET id_cliente=?, nombre_cliente=?, correo=?, monto_deuda=?, fecha_vencimiento=? WHERE id_deuda=?',
      [id_cliente, nombre_cliente, correo, monto_deuda, fecha_vencimiento, id_deuda]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'Deuda no encontrada' });
    }

    res.json({ mensaje: 'Deuda actualizada correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al actualizar la deuda' });
  }
});

/**
 * @swagger
 * /api/deudas/{id_deuda}:
 *   delete:
 *     summary: Elimina una deuda
 *     tags: [Deudas]
 *     parameters:
 *       - in: path
 *         name: id_deuda
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Deuda eliminada
 *       404:
 *         description: Deuda no encontrada
 */
app.delete('/api/deudas/:id_deuda', async (req, res) => {
  const { id_deuda } = req.params;

  try {
    const [result] = await pool.query('DELETE FROM deudas WHERE id_deuda = ?', [id_deuda]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'Deuda no encontrada' });
    }

    res.json({ mensaje: 'Deuda eliminada correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al eliminar la deuda' });
  }
});

// 4. Configuración de Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Deudas Clientes',
      version: '1.0.0',
      description: 'API REST para gestionar deudas de clientes (Problemática 2)',
    },
    components: {
      securitySchemes: {
        basicAuth: {
          type: 'http',
          scheme: 'basic',
        },
      },
    },
    security: [{ basicAuth: [] }],
  },
  apis: ['./server.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 5. Servir el front de la Problemática 3
app.use(express.static(
  path.join(__dirname, 'problematica3-reporte', 'public')
));

app.get('/', (req, res) => {
  res.sendFile(
    path.join(__dirname, 'problematica3-reporte', 'public', 'index.html')
  );
});

// 6. Arranque del servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API de deudas escuchando en http://localhost:${PORT}`);
  console.log(`Documentación Swagger en http://localhost:${PORT}/api-docs`);
  console.log(`Reporte web en http://localhost:${PORT}/`);
});
