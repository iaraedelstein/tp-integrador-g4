const mysql = require('mysql');
const util = require('util');
const settings = require('./settings.json');

//Conexión a la DB
const conn = mysql.createConnection(settings);

conn.connect((error) => {
  if (error) throw error;
  console.log('Se estableció la conexión con la DB');
});

// Permite el uso de async await para un código más ordenado al generar queries
// Transforma una query que trabaja con callbacks a una promise
// async await solo trabaja con promises no con callbacks
const qy = util.promisify(conn.query).bind(conn);

module.exports = qy;
