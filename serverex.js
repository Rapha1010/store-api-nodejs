const express = require('express')
const morgan = require('morgan')
const routerClient = require('./routes/routerClient')
const routerAPI = require('./routes/routerAPI')

const app = express()
require('dotenv').config()

app.use(morgan("tiny"))
// app.use('/public', routerClient)
app.use('/api/v1', routerAPI)

app.use(function(req, res) {
    res.status(404).send('recurso nao encontrado')
})

app.listen(3000, function() {
    console.log('servidor rodando na porta 3000');
})