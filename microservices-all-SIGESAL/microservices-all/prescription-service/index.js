const express = require('express');
const mysql = require('mysql');

const app = express();
const port = 3009;

app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'sigesal'
});

db.connect(err => {
  if (err) throw err;
  console.log('Prescription-service conectado a SIGESAL');
});

// Obtener todas las recetas
app.get('/recetas', (req, res) => {
  db.query('SELECT * FROM recetas', (err, results) => {
    if (err) return res.status(500).send('Error al obtener recetas');
    res.json(results);
  });
});

// Registrar nueva receta
app.post('/recetas', (req, res) => {
  const { id_paciente, id_profesional, fecha_receta, indicaciones } = req.body;

  db.query(
    'INSERT INTO recetas (id_paciente, id_profesional, fecha_receta, indicaciones) VALUES (?, ?, ?, ?)',
    [id_paciente, id_profesional, fecha_receta, indicaciones],
    (err, result) => {
      if (err) return res.status(500).send('Error al registrar receta');
      res.json({ id: result.insertId, message: 'Receta registrada' });
    }
  );
});

app.listen(port, () => {
  console.log(`Prescription-service corriendo en puerto ${port}`);
});
