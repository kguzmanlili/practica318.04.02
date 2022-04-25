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
        strDireccion:{
          type:String,
          required:[true, 'No se recibio el direccion. Favor de ingresarlo']  
        },
        strEmail:{
            type: String,
            require: [true, 'No se recibio el Email, Favor de ingresarlo']
        },
        strNombreUsuario:{
            type: String,
            required:[true, 'No se recibio Nombre de usuario']
        },
        strContrasena:{
            type: String,
            required:[true, 'No se recibio contrasena, favor de ingresarla']
        }
        

})

module.exports = mongoose.model('usuario', SchemaUsuario);
