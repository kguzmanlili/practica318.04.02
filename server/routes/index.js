const express = require('express');
const app = express.Router();


app.use('/producto', require('./producto/producto'));
app.use('/usuario', require('./usuarios/usuario'));
app.use('/empresa', require('./empresa/empresa'));


module.exports = app;