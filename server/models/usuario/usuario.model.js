const mongoose = require("mongoose");
const Schema = mongoose.Schema;
let SchemaUsuario = new Schema({

   
        strNombre:{
            type:String,
            required: [true, 'No se recibio el  Nombre, Favor de ingresarlo']
        },

        strApellido:{

            type:String,
            required: [true, 'No se recibio el Apellido, Favor de ingresarlo']
        },
        strEmail:{
            type: String,
            require: [true, 'No se recibio el Email, Favor de ingresarlo']
        }

})

module.exports = mongoose.model('usuario', SchemaUsuario);
