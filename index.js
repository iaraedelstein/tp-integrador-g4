const express = require('express');

const categoriaRouter = require('./api/categoria');
const libroRouter = require('./api/libro');
const personaRouter = require('./api/persona');

var app = express();
const port = process.env.PORT || 3000;

//middleware
//app.use(express.static(`${__dirname}/public`));
app.use(express.urlencoded());

//Mapeo de peticion a object js
app.use(express.json());

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