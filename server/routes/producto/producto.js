const express = require('express');
const ProductoModel = require('../../models/productos/producto.model');
const app = express.Router();

app.get('/', async (req,res) => {

    
    try {
        const _blnEstado = req.query.blnEstado == "false" ? false : true ;
        const obtenerproductos = await ProductoModel.find({blnEstado: _blnEstado});

        //Funcion con aggregate

         const obtenerProductoConAggregate = await ProductoModel.aggregate([
            //{$proyect: {strNombre:1, strPrecio: 1, blnEstado: 1}}, 
           // {$match: {blnEstado: blnEstado}},
            {$match:{$expr:{$eq:["$blnEstado", blnEstado]}}},
            ]);
         console.log(obtenerProductoConAggregate)
        //Function con aggregate

        if(!obtenerproductos.length>0) 
        {
            return res.status(400).json({
                ok: false,
                msg:'No hay productos en la base de datos',
                count: obtenerproductos.length,
                cont:
                {
                    obtenerproductos
                }
            })
        }

        return res.status(200).json({
            ok: true,
            msg:'Si hay productos en la base de datos',
            count: obtenerproductos.length,
            cont:
            {
                obtenerproductos
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

});


app.post('/', async (req,res) =>{
    
    try {
        const body = req.body;
        const productoBody = new ProductoModel(body);
        const err = productoBody.validateSync();

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

        const obtenerProducto = await ProductoModel.findOne({strNombre:body.strNombre},{strNombre:1});
        
        if (obtenerProducto)
            {
                return res.status(400).json(
                    {
                        ok:false,
                        msg: 'Ya se encuentra un producto con ese nombre',
                        cont:
                        {
                           obtenerProducto
                        }
                    }) 

            }

        const registradoP = await productoBody.save();

        return res.status(200).json({
            ok: true,
            msg:'El producto se registro correctamente',
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
        const _idProducto = req.query._idProducto;

        //validamos que se envie un id, o que el id no tenga la longitud correcta
        if (!_idProducto || _idProducto.length !=24)
        {
            return res.status(400).json(
                {
                    ok:false,
                    //utilizamos un operador ternarrio para validar cual de las 2 condiciones es la que se esta cumpliendo
                    msg: _idProducto ? 'El id no es valido, se requiere un id de almenos 24 caracteres' : 'No se recibio un producto',
                    cont:
                    {
                        _idProducto
                    }
                }) 
        }

        const encontroProducto = await ProductoModel.findOne({_id: _idProducto, blnEstado:true});
        //console.log(encontoProducto);

        if (!encontroProducto)
        {
            return res.status(400).json(
                {
                    ok:false,
                    msg: 'No se encuentra registrado el producto',
                    cont:
                    {
                        _idProducto
                    }
                }) 

        }

        const encontroNombreProducto = await ProductoModel.findOne({strNombre: req.body.strNombre, _id:{$ne: _idProducto}},{strNombre:1, strDescripcion:1});

        //console.log(encontroNombreUsuario);

        if (encontroNombreProducto)
        {
            return res.status(400).json(
                {
                    ok:false,
                    msg: 'El nombre del producto ya se encuentra registrado',
                    cont:
                    {
                        encontroNombreProducto
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
        const actualizarProducto = await ProductoModel.findByIdAndUpdate(_idProducto, { $set:{ ...req.body}}, {new :true});
        //console.log(actualizarProducto);

        if (!actualizarProducto)
        {
            return res.status(400).json(
                {
                    ok:false,
                    msg: 'No se logro actualizar el producto',
                    cont:
                    {
                        ...req.body
                    }
                }) 

        }

        return res.status(200).json(
            {
                ok:true,
                msg: 'El producto se actualizo de manera existosa',
                cont:
                {
                    productoAnterior: encontroProducto,
                    productoActual: actualizarProducto  //req.body
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

//los datos se envian preferentemente por query o params
app.delete('/', async (req,res) =>{
    
    try {
        //identificar el elemento a eliminar
        const _idProducto = req.query._idProducto;
        const _blnEstado = req.query.blnEstado == "false" ? false : true ;
        //validamos que se envie un id, o que el id no tenga la longitud correcta
        if (!_idProducto || _idProducto.length !=24)
        {
            return res.status(400).json(
                {
                    ok:false,
                    //utilizamos un operador ternarrio para validar cual de las 2 condiciones es la que se esta cumpliendo
                    msg: _idProducto ? 'El id no es valido, se requiere un id de almenos 24 caracteres' : 'No se recibio un producto',
                    cont:
                    {
                        _idProducto
                    }
                }) 
        }

        const encontroProducto = await ProductoModel.findOne({_id: _idProducto, blnEstado:true});
        
        if (!encontroProducto)
            {
                return res.status(400).json(
                    {
                        ok:false,
                        msg: 'No se encuentra registrado el producto',
                        cont:
                        {
                            _idProducto: _idProducto
                        }
                    }) 

            }

        //Este elimina de manera definitva elproducto
        //const eliminarProducto= await ProductoModel.findOneAndDelete({_id: _idProducto});

        //Esta funcion solo cambia el estado del producto
        const eliminarProducto= await ProductoModel.findOneAndUpdate({_id: _idProducto},{$set:{blnEstado:_blnEstado}},{new:true});

        if (!eliminarProducto)
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
                    msg: _blnEstado == true ? 'Se activo el usuario de manera existosa' : 'El usuario se desactivo de manera exitosa' ,
                    cont:
                    {
                        productoEliminado: eliminarProducto  //req.body
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