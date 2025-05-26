require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql');

const app = express();
app.use(cors());
app.use(express.json());

// Servir archivos estáticos del frontend (carpeta public)
app.use(express.static('public'));

// Conexión a la base de datos
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'sigesal'
});

db.connect(err => {
  if (err) throw err;
  console.log("Conectado a MySQL - Microservicio de Pacientes");
});



// Obtener todos los pacientes
app.get('/pacientes', (req, res) => {
  db.query("SELECT * FROM pacientes", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Agregar un paciente
app.post('/pacientes', (req, res) => {
  const { cedula, nombres, apellidos, fecha_nacimiento, sexo, direccion, telefono, correo } = req.body;
  if (!cedula || !nombres || !apellidos || !fecha_nacimiento || !sexo) {
    return res.status(400).json({ error: "Campos obligatorios faltantes y actualizar ---" });
  }
// Actualizar como debo hacer en git 
  const sql = `INSERT INTO pacientes (cedula, nombres, apellidos, fecha_nacimiento, sexo, direccion, telefono, correo)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

  db.query(sql, [cedula, nombres, apellidos, fecha_nacimiento, sexo, direccion, telefono, correo], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ mensaje: "Paciente agregado", id: result.insertId });
  });
});


const PORT = process.env.PORT || 3010;
app.listen(PORT, () => {
  console.log(`Microservicio de pacientes corriendo en http://localhost:${PORT}`);
});
