const express = require('express')
const app = express()
const port = 9000
const addRoom = require('./routes/addRoom')

//OBS : Mudar endpoint do POST

app.use(express.urlencoded())
app.set('views', './views')
app.use('/form',addRoom)
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.get('/', (req,res)=>{
    res.render('index')
})


app.listen(port, () => console.log('Servidor iniciado'))


