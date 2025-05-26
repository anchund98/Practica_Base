const express = require('express');
const mysql = require('mysql');

const app = express();
const port = 3007;

app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'sigesal'
});

db.connect(err => {
  if (err) throw err;
  console.log('Professional-service conectado a SIGESAL');
});

app.get('/profesionales', (req, res) => {
  db.query('SELECT * FROM profesionales', (err, results) => {
    if (err) return res.status(500).send('Error al obtener profesionales');
    res.json(results);
  });
});

app.listen(port, () => {
  console.log(`Professional-service corriendo en puerto ${port}`);
});
