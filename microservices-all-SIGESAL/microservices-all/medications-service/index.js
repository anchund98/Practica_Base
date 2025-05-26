const express = require('express');
const mysql = require('mysql');
const app = express();
const port = 3008;

app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'sigesal'
});

db.connect(err => {
  if (err) throw err;
  console.log('medications-service conectado a SIGESAL');
});

app.get('/medicamentos', (req, res) => {
  db.query('SELECT * FROM medicamentos', (err, results) => {
    if (err) return res.status(500).send('Error al obtener medicamentos, necesito mas infromacion...'); //se amplio el mensaje de error
    res.json(results);
  });
});

app.post('/medicamentos', (req, res) => {
  const { nombre, descripcion } = req.body;
  db.query(
    'INSERT INTO medicamentos (nombre, descripcion) VALUES (?, ?)',
    [nombre, descripcion],
    (err, result) => {
      if (err) return res.status(500).send('Error al agregar medicamento, necesito mas infromacion...'); //se amplio el mensaje de error.
      res.json({ id: result.insertId });
    }
  );
});

app.listen(port, () => {
  console.log(`medications-service en puerto ${port}`);
});
