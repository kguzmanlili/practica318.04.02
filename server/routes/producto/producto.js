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
})
module.exports = app;