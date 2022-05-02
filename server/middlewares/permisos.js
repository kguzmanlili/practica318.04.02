const jwt = require('jsonwebtoken');
require('../config/config');
require('colors')

const verificarAcceso = async (req , res, next) => {
    try {
        //console.log('estoy en el middleware');
        const token = req.get('token');
       

        if(!token)
        {
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
                console.log("Se denego el acceso a la ruta:".red)
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
            console.log("Se permitio el acceso a la ruta:".green)
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