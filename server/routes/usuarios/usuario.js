const express = require('express');
const UsuarioModel = require('../../models/usuario/usuario.model')
const app = express.Router();
const bcrypt = require('bcrypt');
const usuarioModel = require('../../models/usuario/usuario.model');

// const path = require('path');
// const rutaDescarga = path.resolve(__dirname, '../../assets/index.html');
app.get('/', async (req, res) => {
    const blnEstado = req.query.blnEstado == "false" ? false : true;
    const obtenerUsuarios = await UsuarioModel.find({ blnEstado: blnEstado }, {});
    if (obtenerUsuarios.length < 1) {
        return res.status(400).json({
            ok: false,
            msg: 'No se encontrarón productos en la base de datos',
            cont: {
                obtenerUsuarios
            }
        })
    }
    return res.status(200).json({
        ok: true,
        msg: 'Se obtuvierón los usuarios de manera correcta',
        count: obtenerUsuarios.length,
        cont: {
            obtenerUsuarios
        }
    })
})
app.post('/', async (req, res) => {
    // existe ? (lo que pasa si existe) : (no existe);
    const body = { ...req.body, strContrasena: req.body.strContrasena ? bcrypt.hashSync(req.body.strContrasena, 10) : undefined };
    const bodyUsuario = new UsuarioModel(body);
    // const encontraridEmpresa = await UsuarioModel.findOne({ idEmpresa: body.idEmpresa });
    const encontrarEmailUsuario = await UsuarioModel.findOne({ strEmail: body.strEmail });
    const encontrarNombreUsuario = await UsuarioModel.findOne({ strNombreUsuario: body.strNombreUsuario })
    // if (encontraridEmpresa) {
    //     return res.status(400).json({
    //         ok: false,
    //         msg: 'El correo ya se encuentra registrado',
    //         cont: {
    //             body
    //         }
    //     })
    // }
    
    
    if (encontrarEmailUsuario) {
        return res.status(400).json({
            ok: false,
            msg: 'El correo ya se encuentra registrado',
            cont: {
                body
            }
        })
    }
    if (encontrarNombreUsuario) {
        return res.status(400).json({
            ok: false,
            msg: 'El nombre de usuario ya se encuentra registrado',
            cont: {
                body
            }
        })
    }
    const err = bodyUsuario.validateSync();
    if (err) {
        return res.status(400).json({
            ok: false,
            msg: 'Uno o mas campos no se registrarón favor de ingresarlos',
            cont: {
                err
            }
        })
    }
    const usuarioRegistrado = await bodyUsuario.save();
    return res.status(200).json({
        ok: true,
        msg: 'Se registro el usuario de manera exitosa',
        cont: {
            usuarioRegistrado
        }
    })
})

app.put('/', async (req, res) => {

    try {
        const _idUsuario = req.query._idUsuario;

        //validamos que no enviemos in id, o que el id no tenga la longitud correcta
        if (!_idUsuario || _idUsuario.length != 24) {
            return res.status(400).json(
                {
                    ok: false,
                    msg: _idUsuario ? 'El id no es valido, se requiere un id de almenos 24 caracteres' : 'No se recibio un usuario',
                    cont:
                    {
                        _idUsuario
                    }
                })
        }

        const encontroUsuario = await UsuarioModel.findOne({ _id: _idUsuario, blnEstado: true });

        if (!encontroUsuario) {
            return res.status(400).json(
                {
                    ok: false,
                    msg: 'No se encuentra registrado el usuario',
                    cont:
                    {
                        _idUsuario
                    }
                })

        }
        const encontrarNombreUsuario = await UsuarioModel.findOne({ strNombreUsuario: req.body.strNombreUsuario, _id: { $ne: _idUsuario } }, { strNombre: 1, strNombreUsuario: 1 })

        if (encontrarNombreUsuario) {
            return res.status(400).json(
                {
                    ok: false,
                    msg: 'El nombre de usuario ya se encuentra registrado en la base de datos',
                    cont:
                    {
                        encontrarNombreUsuario
                    }
                })
        }

        //tambien se puede utilizar
        //findByIdAndUpdate findOneAndUpdate(_idUsuario, { $set:{strNombre: req.body.strNombre, strApellido: req.body.strApellido, strDireccion: req.body.strDireccion}}, {new :true, upsert: true});
        //updateOne({_id:_idUsuario}, { $set:{strNombre: req.body.strNombre, strApellido: req.body.strApellido, strDireccion: req.body.strDireccion}});
        const actualizarUsuario = await UsuarioModel.findOneAndUpdate({ _id: _idUsuario }, {
            $set: {
                idEmpresa: req.body.idEmpresa,
                strNombre: req.body.strNombre, strApellido: req.body.strApellido,
                strDireccion: req.body.strDireccion,
                strNombreUsuario: req.body.strNombreUsuario
            }
        }, { new: true, upsert: true });

        if (!actualizarUsuario) {
            return res.status(400).json(
                {
                    ok: false,
                    //utilizamos un operador ternarrio para validar cual de las 2 condiciones es la que se esta cumpliendo
                    msg: 'No se logro actualizar el usuario',
                    cont:
                    {
                        ...req.body
                    }
                })

        }

        return res.status(200).json(
            {
                ok: true,
                msg: 'El producto se actualizo de manera existosa',
                cont:
                {
                    usuarioAnterior: encontroUsuario,
                    usuarioActual: actualizarUsuario
                }
            })


    }
    catch (error) {
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

app.delete('/', async (req, res) => {
    try {
        const _idUsuario = req.query._idUsuario
        const blnEstado = req.query.blnEstado == "false" ? false : true
        if (!_idUsuario || _idUsuario.length != 24) {
            return res.status(400).json({
                ok: false,
                msg: _idUsuario ? 'No es un id valido' : 'No se ingreso un idUsuario',
                cont: {
                    _idUsuario: _idUsuario
                }
            })
        }
        const modificarEstadoUsuario = await UsuarioModel.findOneAndUpdate({ _id: _idUsuario }, { $set: { blnEstado: blnEstado } }, { new: true })

        return res.status(200).json({
            ok: true,
            msg: blnEstado == true ? 'Se activo el usuario de manera exitosa' : 'Se desactivo el usuario de manera exitosa',
            cont: {
                modificarEstadoUsuario
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