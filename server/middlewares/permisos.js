const jwt = require('jsonwebtoken');
require('../config/config');
require('colors')

const verificarAcceso = async (req , res, next) => {
    try {
        const url = req.originalUrl.split('?');
        const originalUrl = url[0];
        //console.log('estoy en el middleware');
        const token = req.get('token');
       

        if(!token)
        {
            console.log(`No se recibio token valido:`,  `${originalUrl}`.red)
            return res.status(400).json(
                {
                    ok:false,
                    msg: 'No se recibio un token valido',
                    cont:
                    {
                        token
                    }
                })
        }

        jwt.verify(token, process.env.SEED, (err, decoded) => {
            if(err)
            {
                
                console.log(`Se denego el acceso a la ruta:`,  `${originalUrl}`.red)
               //console.log(err.name);
               return res.status(400).json(
                {
                    ok:false,
                    msg: err.name == "JsonWebTokenError" ? 'EL token no es valido': 'El token expiro',
                    cont:
                    {
                        token
                    }
                })
            }
            
            //console.log(decoded);
            console.log(`Se permitio el acceso a la ruta:`,  `${originalUrl}`.green)
            next();
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
    
}

module.exports = { verificarAcceso }