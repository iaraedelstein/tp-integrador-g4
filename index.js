const express = require('express');
const cors = require('cors');

const categoriaRouter = require('./api/categoria');
const libroRouter = require('./api/libro');
const personaRouter = require('./api/persona');

var app = express();
const port = process.env.PORT || 3000;

//middleware

//app.use(express.static(`${__dirname}/public`));
//app.use(express.urlencoded()); no es necesario ya que es una API Rest que responde solo JSON

//Mapeo de peticion a object js
app.use(express.json());

//Cors seguridad para origen de requests
app.use(cors({ origin: 'http:/localhost:4200', credentials: true }));

// Desarrollo APIS lógica de negocio
app.use('/categoria', categoriaRouter);
app.use('/persona', personaRouter);
app.use('/libro', libroRouter);

//Error page
app.get('*', (req, res) => {
  res.status(404).send({ error: 'Invalid request' });
});

app.listen(port, () => {
  console.log('Servidor escuchando en el puerto ', port);
});
