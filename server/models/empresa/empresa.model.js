var mongoose = require('mongoose')
var Schema = mongoose.Schema


let SchemaEmpresa = new Schema({
    blnEstado:{
        type: Boolean,
        default: true,
    },
    strNombre:{
        type: String,
        required:[true,'No se recibió el campo Nombre, favor de ingresarlo']
    },
    strDescricpion:{
        type:String,
        required:[true,'No se recibió el campo Descripcion, favor de ingresarlo']
    },

    nmbTelefono:{
        type:Number,
        required:[true,'No se recibio el campo Telefono, favor de ingresarlo']
        },

    nmbCodigoPostal:{
        type:Number,
        required:[true, 'No se recibió el campo Number, favor de ingresarlo']
    },

    strCiudad:{
        type:String,
        required:[true,'No se recibió el campo Ciudad, favor de ingresarlo']
    }
 
})

module.exports = mongoose.model('empresa', SchemaEmpresa);