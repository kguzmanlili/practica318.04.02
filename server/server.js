require('./config/config');
require('colors');
const express = require('express');
//const { default: mongoose } = require('mongoose');
const mongoose = require('mongoose');
const app = express();


app.use(express.urlencoded({extended:true}));
app.use('/api', require('./routes/index'))

// console.log(provess.env.URLDB, 'URLDEV')
mongoose.connect(process.env.URLDB,(err, resp)=>{
    if(err){
        console.log('Error al conectar la bd'.red)
        return err
    }
    console.log(`Base de datos online`, (process.env.URLDB).blue)
})

app.listen(process.env.PORT, ()=> {
    console.log('[Node]'.green,' esta corriendo en el puerto', (process.env.PORT).yellow);
})