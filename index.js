const express = require('express');

const categoriaRouter = require('./api/categoria');
const personaRouter = require('./api/persona');
const libroRouter = require('./api/libro');

var app = express();
const port = 3000;

//middleware
//app.use(express.static(`${__dirname}/public`));
app.use(express.urlencoded());

//Mapeo de peticion a object js
app.use(express.json());

// Desarrollo APIS lógica de negocio
app.use('/categoria', categoriaRouter);
app.use('/persona', personaRouter);
app.use('/libro', libroRouter);

//Pages
/*app.get('/', (req, res) => {
    res.status(404).sendFile('public/index.html', { root: __dirname });
});
//Error page
app.get('*', (req, res) => {
    res.status(404).sendFile('public/404.html', { root: __dirname });
});*/



/**
    agrego GET, GET id y POST de /persona, faltarian PUT y DELETE ----- Guille 
 */

//GET
app.get('/persona', async(req, res) => {
    try {

        const query = 'SELECT * FROM persona';

        const respuesta = await qy(query);
        if (respuesta.length <= 0) {
            throw new Error('esa persona no está registrada');
        }
        res.send({ 'respuesta': respuesta });
    } catch (e) {
        console.error(e.message);
        res.status(413).send({ 'Error': e.message });

    }
});
//GET ID
app.get('/persona/:id', async(req, res) => {
    try {
        const query = 'SELECT * FROM persona WHERE id = ?';

        const respuesta = await qy(query);
        if (respuesta.length <= 0) {
            throw new Error('esa persona no está registrada');
        }

        res.send({ 'respuesta': respuesta });
    } catch (e) {
        console.error(e.message);
        res.status(413).send({ 'Error': e.message });

    }
});
//POST
app.post('/persona', async(req, res) => {
    try {
        //valido que manden correctamente la info
        if (!req.body.nombre) {
            throw new Error('falta enviar el nombre');
        }
        if (!req.body.apellido) {
            throw new Error('falta enviar el apellido');
        }
        if (!req.body.email) {
            throw new Error('falta enviar el email');
        }
        if (!req.body.alias) {
            throw new Error('falta enviar el alias');
        }
        //verifico que no este en uso ese mail
        let query = 'SELECT id FROM persona WHERE email = ?'

        let respuesta = await qy(query, [req.body.email.toUpperCase()]);

        if (respuesta.length > 0) {
            throw new Error('ese Email ya está registrado');
        }
        //Guardo la nueva persona
        query = 'INSERT INTO persona VALUES (alias, apellido, email, nombre)'; //tengo muchas dudas acá, puse los datos en el orden en el que se encuentran en el archivo .sql pero en el medio está persona_id y no se si cuenta.
        respuesta = await qy(query, [req.body.nombre.toUpperCase()]);
        res.send(200, { 'respuesta': respuesta });


    } catch (e) {
        console.error(e.message);
        res.status(413).send({ 'Error': e.message });

    }
});
//PUT

//DELETE
app.listen(port, () => {
    console.log('Servidor escuchando en el puerto ', port);
});