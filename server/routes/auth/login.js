const express = require('express');
const app = express.Router();
const UsuarioModel = require('../../models/usuario/usuario.model');
 const bcrypt = require('bcrypt');
 const jwt = require('jsonwebtoken');
 require('../../config/config');

app.post('/login', async (req, res) =>{
      
 try {
    const strEmail = req.body.strEmail;
    const strContrasena = req.body.strPassword;
   
    if(!strEmail || !strContrasena){
        return res.status(400).json({
            ok: false,
            msng: !strEmail && !srtConstrasena ? 'No se recibio streEmail y contraseña, Favor de ingresarla': 
            (!strEmail ? 'No se recibio el strEmail. Favor de ingresarlo': 'No se recibio strContraseña, Favor de  ingresarlo'),
          cont:{
              strEmail,
              strContrasena
          }
        })
    }
  
  //  const encontroEmail = await UsuarioModel.findOne({ strEmail: strEmail });
  const encontroEmail = await UsuarioModel.findOne({strEmail : strEmail});
    

    if(!encontroEmail){
        return res.status(400).json({
            ok:false,
            msng:'El correo* ò la contraseña son incorrectas favor de verificarlo',
            cont:{
                strEmail,
                strContrasena
            }

        })
    }

    //console.log(strContrasena)
    
    const compararContrasena= bcrypt.compareSync(strContrasena,encontroEmail.strPassword);

    if(!compararContrasena){
        return res.status(400).json({
            ok:false,
            msng:'El correo ò la contraseña* son incorrectas favor de verificarlo',
            cont:{
                strEmail,
                strContrasena
            }

        })

    }
    const token = jwt.sign({usuario : encontroEmail},process.env.SEED,{expiresIn: process.env.CADUCIDAD_TOKEN})
    return res.status(200).json({
        ok:true,
        msng:'Se logueo el usuario de manera exitosa',
        cont:{
            usuario : encontroEmail,
            token
        }

    })
     
 } catch (error) {
     
    return res.status(500).json(
        {
            ok: false,
            msg: 'Error en el servidor',
            cont:
            {
                error
            }
        })
     
 }
})

module.exports = app;