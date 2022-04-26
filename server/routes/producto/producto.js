const express= require ('Express');
const app = express.Router();
const ProductoModel = require('../../models/productos/producto.model');

app.get('/', async (req, res) => {
    const obtenerProductos = await ProductoModel.find();
    if (obtenerProductos.length == 0){
        return res.status(400).json({
            ok: false,
            msg:'No se encontraron usuarios en la base de datos',
            cont:{
                obtenerProductos
            }
        })
    }
    
    return res.status(200).json({
        ok: true,
        msg: 'se obtuvieron productos de manera exitosa',
        cont:{
            obtenerProductos
        }
      // obtenerProductos

        
    })
})

app.post('/', async (req, res) =>{
    try {
        const body = req.body;
    const productoBody = new ProductoModel(body);
    const err = ProductoBody.validateSync();
    if (err){
        return res.status(400).json({
            ok:false,
            msg:'No se recibio 1 o mas campos, favor de validar',
            cont:{
                err
            }
        })
    }

    const productoRegistrado = await productoBody.save();
    return res.status(200).json({
        ok:true,
        msng: 'El producto se registro de manera exitosa',
        cont:{
            productoRegistrado 
        }
    })

        
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Error en el servior',
            cont:{
                error
            }

        })
        console.log(error,'mensaje de error')
        
    }
    
})
app.put('/', async (req, res)=>{
    try {
        //const _idProducto= req.query._idProducto;
 //   const encontrarProducto = await ProductoModel.updateOne({_id: _idProducto})
   // console.log(encontrarProducto, 'encontratProducto');


    const _idProducto = req.query._idProducto;

    
    if(!_idProducto || _idProducto.length != 24){
        
        return res.status(400).json({
            ok: false,
            msg: _idProducto ? 'El identificador no es valido': 'No se recibio el identificador del producto',
            cont:{
                _idProdcuto
            }
        })
    }

    
        const encontroProducto = await ProductoModel.findOne({_id: _idProducto});
        console.log(_idProducto)
        if (!encontroProducto){
            return res.status(400).json({
                ok: false,
                msg: 'El producto no se encuentra registrado',
                cont:{
                    _idProdcuto
                }
            })

        }
        
        //const actualizarProducto = await ProductoModel.updateOne({ _id: _idProducto} , { $set:{...req.body} })
        const actualizarProducto = await ProductoModel.findByIdAndUpdate( _idProducto, { $set:{...req.body} })
        if(!actualizarProducto){
            return res.status(400).json({
                ok: false,
                msg: 'El producto no se logro actualiar',
                cont:{
                    ...req.body
                }
            })


        }
        return res.status(200).json({
            ok: true,
            msg: 'El producto se actualizo de  manera exitosa',
            cont:{
                productoAnterior: encontroProducto,
                productoActual: req.body
            }
        })
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Error en el serviorPUT',
            cont:{
                error
            }

        })

    }
    

})
module.exports = app;