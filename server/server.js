require('./config/config');
require('colors');
const express = require('express');
const app = express();


app.use(express.urlencoded({extended:true}));
app.use('/api', require('./routes/index'))

app.listen(process.env.port, ()=> {
    console.log('[Node]'.green,' esta corriendo en el puerto', (process.env.port).yellow);
})