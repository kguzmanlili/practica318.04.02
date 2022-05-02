const express = require('express');
const EmpresaModel = require('../../models/empresa/empresa.model');
const app = express.Router();



app.get('/', async (req,res) => {
    
    
    try {
        const _blnEstado = req.query.blnEstado == "false" ? false : true ;
        const obtenerempresas = await EmpresaModel.find({blnEstado: _blnEstado});
       
        //Funcion con aggregate

         const obtenerEmpresaConAggregate = await EmpresaModel.aggregate([
            //{$proyect: {strNombre:1, strPrecio: 1, blnEstado: 1}}, 
           // {$match: {blnEstado: blnEstado}},
            {$match:{$expr:{$eq:["$blnEstado", blnEstado]}}},
            ]);
            console.log ("hola")
         console.log(obtenerEmpresaConAggregate)
        //Function con aggregate

        if(!obtenerempresas.length>0) 
        {
            return res.status(400).json({
                ok: false,
                msg:'No hay empresas en la base de datos',
                count: obtenerempresas.length,
                cont:
                {
                    obtenerempresas
                }
            })
        }

        return res.status(200).json({
            ok: true,
            msg:'Si hay empresas en la base de datos',
            count: obtenerempresas.length,
            cont:
            {
                obtenerempresas
            }
        })
    } 
    catch (error) {
        
        return res.status(500).json(
            {
                ok:false,
                msg: 'Error en el servidor ',
                cont:
                {
                    error
                }
            })    
    }

});


app.post('/', async (req,res) =>{
    
    try {
        const body = req.body;
        const empresaBody = new EmpresaModel(body);
        const err = empresaBody.validateSync();
        console.log("hola")
        if (err)
        {
            return res.status(400).json({
                ok: false,
                msg:'No se recibio algun campo favor de validar',
                cont:
                {
                    err
                }
            })
        }

        const obtenerEmpresa = await EmpresaModel.findOne({strNombre:body.strNombre},{strNombre:1});
        
        if (obtenerEmpresa)
            {
                return res.status(400).json(
                    {
                        ok:false,
                        msg: 'Ya se encuentra un empresa con ese nombre',
                        cont:
                        {
                           obtenerEmpresa
                        }
                    }) 

            }

        const registradoP = await empresaBody.save();

        return res.status(200).json({
            ok: true,
            msg:'La empresa se registro correctamente',
            cont:
            {
                registradoP
            }
        })
    } 
    catch (error) {
        return res.status(500).json(
            {
                ok:false,
                msg: 'Error en el servidor',
                cont:
                {
                    error
                }
            })
    }
    
   
})

app.put('/', async (req,res) =>{

    try {
        const _idEmpresa = req.query._idEmpresa;

        //validamos que se envie un id, o que el id no tenga la longitud correcta
        if (!_idEmpresa || _idEmpresa.length !=24)
        {
            return res.status(400).json(
                {
                    ok:false,
                    //utilizamos un operador ternarrio para validar cual de las 2 condiciones es la que se esta cumpliendo
                    msg: _idEmpresa ? 'El id no es valido, se requiere un id de almenos 24 caracteres' : 'No se recibio empresa',
                    cont:
                    {
                        _idEmpresa
                    }
                }) 
        }

        const encontroEmpresa = await EmpresaModel.findOne({_id: _idEmpresa, blnEstado:true});
        //console.log(encontoProducto);

        if (!encontroEmpresa)
        {
            return res.status(400).json(
                {
                    ok:false,
                    msg: 'No se encuentra registrado la empresa',
                    cont:
                    {
                        _idEmpresa
                    }
                }) 

        }

        const encontroNombreEmpresa = await EmpresaModel.findOne({strNombre: req.body.strNombre, _id:{$ne: _idEmpresa}},{strNombre:1, strDescripcion:1});

        //console.log(encontroNombreUsuario);

        if (encontroNombreEmpresa)
        {
            return res.status(400).json(
                {
                    ok:false,
                    msg: 'El nombre de la empresa ya se encuentra registrado',
                    cont:
                    {
                        encontroNombreEmpresa
                    }
                }) 

        }

        //solo regresa estadstica delo que realizo
        // se puede realizar el update por cualquier campo
        //const actualizarProducto = await ProductoModel.updateOne({_id: _idProducto}, { $set:{ ...req.body}});
        // acknowledged: true,
        // modifiedCount: 1,
        // upsertedId: null,
        // upsertedCount: 0,
        // matchedCount: 1

        //se realiza solo  por el id 
        //regresa la informacion de lo que modifico
        // acknowledged: true,
        // modifiedCount: 1,
        // upsertedId: null,
        // upsertedCount: 0,
        // matchedCount: 1
        const actualizarEmpresa = await EmpresaModel.findByIdAndUpdate(_idEmpresa, { $set:{ ...req.body}}, {new :true});
        //console.log(actualizarProducto);

        if (!actualizarEmpresa)
        {
            return res.status(400).json(
                {
                    ok:false,
                    msg: 'No se logro actualizar la empresa',
                    cont:
                    {
                        ...req.body
                    }
                }) 

        }

        return res.status(200).json(
            {
                ok:true,
                msg: 'La empresa se actualizo de manera existosa',
                cont:
                {
                    EmpresaAnterior: encontroEmpresa,
                    EmpresaActual: actualizarEmpresa  //req.body
                }
            })

        
    } 
    catch (error) {
        return res.status(500).json(
            {
                ok:false,
                msg: 'Error en el servidor',
                cont:
                {
                    error
                }
            })
    }

    
    


})


app.delete('/', async (req,res) =>{
    
    try {
        //identificar el elemento a eliminar
        const _idEmpresa= req.query._idEmpresa;
        const _blnEstado = req.query.blnEstado == "false" ? false : true ;
        //validamos que se envie un id, o que el id no tenga la longitud correcta
        if (!_idEmpresa || _idEmpresa.length !=24)
        {
            return res.status(400).json(
                {
                    ok:false,
                    //utilizamos un operador ternarrio para validar cual de las 2 condiciones es la que se esta cumpliendo
                    msg: _idEmpresa ? 'El id no es valido, se requiere un id de almenos 24 caracteres' : 'No se recibio Empresa',
                    cont:
                    {
                        _idEmpresa
                    }
                }) 
        }

        const encontroEmpresa = await EmpresaModel.findOne({_id: _idEmpresa, blnEstado:true});
        
        if (!encontroEmpresa)
            {
                return res.status(400).json(
                    {
                        ok:false,
                        msg: 'No se encuentra registrado la empresa',
                        cont:
                        {
                            _idEmpresa: _idEmpresa
                        }
                    }) 

            }

        //Este elimina de manera definitva elproducto
        //const eliminarProducto= await ProductoModel.findOneAndDelete({_id: _idProducto});

        //Esta funcion solo cambia el estado del producto
        const eliminarEmpresa= await EmpresaModel.findOneAndUpdate({_id: _idEmpresa},{$set:{blnEstado:_blnEstado}},{new:true});

        if (!eliminarEmpresa)
            {
                return res.status(400).json(
                    {
                        ok:false,
                        msg: 'No se realiza ninguna modificacion' ,
                        cont:
                        {
                            ...req.body
                        }
                    }) 

            }

            return res.status(200).json(
                {
                    ok:true,
                    msg: _blnEstado == true ? 'Se activo la empresa de manera existosa' : 'La empresa se desactivo de manera exitosa' ,
                    cont:
                    {
                        empresaEliminado: eliminarEmpresa  //req.body
                    }
                })    
    } 
    catch (error) {
        return res.status(500).json(
            {
                ok:false,
                msg: 'Error en el servidor',
                cont:
                {
                    error
                }
            })
    }
})
module.exports = app;