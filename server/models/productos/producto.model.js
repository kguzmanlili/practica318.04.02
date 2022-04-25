
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let SchemaProucto = new Schema({

    strNombre:{
        type: String,
        required:[true,'No se recibio el strNombre favor de ingresarlo']
    },
    strDescripcion:{
        type:String,
        required:[true, 'No se recibio el strDescripcion favor de ingresarlo']
    },
    nmbPrecio:{
        type: Number,
        required:[true, 'No se recibio el strDescripcion favor de ingresarlo']
    }
})

module.exports = mongoose.model('producto', SchemaProucto);