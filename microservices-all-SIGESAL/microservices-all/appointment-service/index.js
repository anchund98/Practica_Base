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
  console.log('Appointment-service conectado a SIGESAL');
});

app.get('/citas', (req, res) => {
  db.query('SELECT * FROM citas', (err, results) => {
    if (err) return res.status(500).send('Error al obtener citas');
    res.json(results);
  });
});

app.post('/citas', (req, res) => {
  const { id_paciente, id_profesional, fecha_cita, motivo } = req.body;
  db.query('INSERT INTO citas (id_paciente, id_profesional, fecha_cita, motivo) VALUES (?, ?, ?, ?)', 
    [id_paciente, id_profesional, fecha_cita, motivo],
    (err, result) => {
      if (err) return res.status(500).send('Error al registrar cita');
      res.json({ id: result.insertId, message: 'Cita agendada' });
    });
});

app.listen(port, () => {
  console.log(`Appointment-service corriendo en puerto ${port}`);
});
