const express = require('express');
const app = express.Router();
const arrJsnUsuarios = [{ _id: 1, strNombre: '', strApellido:'',strEmail:''}]
const path = require('path');
const rutaDescarga = path.resolve(__dirname,'../../assets/index.html');


app.get('/', (req, res)=>{
    const arrUsuarios= arrJsnUsuarios;

    if (arrUsuarios.length > 0){
        return res.status(200).json({
            ok:true,
           msg:'Se recibierón los usuarios de manera exitosa',
          cont:{
           arrUsuarios
          }
    
    
        })

    }
    else{
        return res.status(400).json({
            ok:false,
            msn: 'No se encontraron usuarios',
            cont:{arrJsnUsuarios}
        })
    }
    
    //console.log(rutaDescarga);

   // return res.download('index.html',rutaDescarga);

})



app.get('/obtenerUsuario', (req, res)=>{
    const _idUsuario = Number (req.query._idUsuario);
    if(!_idUsuario){
        return res.status(400).json({
            ok:false,
            msg: 'No se recibio el id Usuario',
            cont:{ _idUsuario }
        })
    }

        const obtenerUsuario = arrJsnUsuarios.find(usuario => usuario._id == _idUsuario);
        if(!obtenerUsuario){
            return res.status(400).json({
                ok:false,
                msg: 'el id Usuario  no se  encontro en la bd',
                cont:{_idUsuario}
            })
        }
        return res.status(200).json({
            ok:true,
           msg:'Se recibio el usuario de manera exitosa',
          cont:{
           _idUsuario
          }
    
    
        })

    

    
    //console.log(rutaDescarga);

   // return res.download('index.html',rutaDescarga);

})

app.post('/',(req,res)=>{



    // if (isNaN(req.body._id)==true) {
    //     console.log ('el id no es numerico');
    //    // msg:'El id no es numerico';
    //    }

    // if (req.body.strNombre.length != 0) && 
    //    (req.body.strApellido.length != 0) && 
    //    (req.body.strEmail.length 1= 0){
    //     console.log ('no enviaste el nombre');
    // }
 


    const body = {
        _id: Number(req.body._id),
        strNombre: req.body.strNombre,
        strApellido: req.body.strApellido,
        strEmail:  req.body.strEmail

          
    }

    if (body._id && body.strNombre && body.strApellido && body.strEmail) {

        const encontroUsuario = arrJsnUsuarios.find(usuario => usuario._id == body._id)



        if (encontroUsuario) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario ya se encuentra registrado ',
                cont: {
                    encontroUsuario
                }
            })
        } else {
            arrJsnUsuarios.push(body)
            res.status(200).json({
                ok: true,
                msg: 'Se registro el usuario de manera correcta',
                cont: {
                    arrJsnUsuarios
                }
            })
        }

    } else {
        res.status(400).json({
            ok: false,
            msg: 'No se recibio alguno o todos los valores requeridos',
            cont: {
                body
            }
        })
    }

    
    //console.log(body);
    //const  _id          = {strNombre: req.body._id};
    //const strNombre     = {strNombre: req.body.strNombre};
    //const strApellido   = {strNombre req.body.strApellido};
    //const strEmail      = {strNombre  req.body.strEmail};

    //console.log(_id ,strNombre, strApellido, strEmail, 'Entro al nombre por body')
})

app.put('/', (req,res)=>{
    const _idUsuario = req.query._idUsuario;   
    if (_idUsuario){
        const encontroUsuario = arrJsnUsuarios.find(usuario => usuario.id === idUsuario);
        if(encontroUsuario){
            const nuevoUsuario = {_id: _idUsuario, strNombre: req.body.strNombre, strApellido: req.body.strApellido,strEmail: req.body.strEmail}
            const filtrarUsuario = arrJsnUsuarios.filter(usuario => usuario._id != _idUsuario)
            arrJsnUsuarios = filtrarUsuario;
            arrJsnUsuarios.push(actualizarUsuario);
            return res.status(200).json({
                ok:true,
                msg: 'El usuario se actualizo de manera exitosa',
                cont:{
                    actualizarUsuario
                }
            })
        }

    }else{
        return res.status(400).json({
            ok:false,
            msg: `el usuario con el _id: ${_idUsuario}, no se encuentra registrado en la bd`,
            cont:{
                _idUsuario
            }
        })
    }

})

app.delete('/', (req,res) => {
    const idUsu = Number(req.query.idUsu);
    
    if(idUsu){
        const foundId = arrJsnUsuarios.find( id => id._id === idUsu );
        if (foundId) {
            const arrFilterUsu = arrJsnUsuarios.filter(idfi => idfi._id != idUsu);
            arrJsnUsuarios = arrFilterUsu;

            return res.status(200).json({
                ok: true,
                msg: `El usuario con el id ${idUsu} se borró.`,
                cont: {
                    foundId
                }
            });
            
        }else{
            return res.status(400).json({
                ok: false,
                msg: `El usuario con el id ${idUsu} no existe.`,
                cont: {
                    idUsu
                }
            });
        }

    }else{
        return res.status(400).json({
            ok: false,
            msg: 'No ingresó el Identificador',
            cont: {
                idUsu
            }
        });
    }
})



//Implmentar usuario Model
const UsuarioModel = require('../../models/usuario/usuario.model');

app.get('/MongoDB', async (req, res)=>{
    const obtenerUsuario = await UsuarioModel.find();

    if  (Object.keys(obtenerUsuario).length != 0){
        return res.status(200).json({
            ok: true,
            msg: 'Se obtuvieron los usuarios correctmente',
            cont:{
                obtenerUsuario
            }
        })
    }
//Regresmos status de error
    return res.status(400).json({
        ok:false,
        msg: 'No se ecnontraron usuarios',
        cont:{
            obtenerUsusario
        }
    })
})
module.exports = app;