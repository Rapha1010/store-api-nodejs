const express = require('express')
const routerAPI = express.Router()
const bodyParser = require('body-parser');
const ProductService = require('../src/app/services/ProductService')
const UserService = require('../src/app/services/UserService')

const knex = require('knex')({
    client: 'sqlite3',
    connection: {
        filename: './dev.sqlite3'
    }
})

routerAPI.use(express.urlencoded())
routerAPI.use(express.json())

routerAPI.get('/products', function (req, res) {
    res.status(200).send(ProductService.getAllProducts())
});

routerAPI.get('/products/:id', function (req, res) {
    res.status(200).send(ProductService.getProductById(req.params.id))
});

routerAPI.post('/products', function (req, res) {
    let productLength = ProductService.getAllProducts().products.length;
    req.body.id = productLength + 1;
    res.status(201).send(ProductService.postProduct(req.body))
});

routerAPI.put('/products', function (req, res) {
    res.status(204).send(ProductService.putProduct(req.body))
});

routerAPI.delete('/products/:id', function (req, res) {
    res.status(204).send(ProductService.deleteProduct(req.params.id))
});

routerAPI.get('/users', function (req, res) {
    UserService.getAllUsers().then(users => res.json(users)).catch(err => res.json({ message: `Erro ao recuperar users: ${err.message}` }))
});

routerAPI.get('/users/:id', function (req, res) {
    UserService.getUserById(req.params.id).then(users => res.json(users)).catch(err => res.json({ message: `Erro ao recuperar users: ${err.message}` }))
});

routerAPI.post('/users', function (req, res) {
    UserService.postUser(req.body)
        .then(users => {
            let id = users[0].id
            res.json({ message: `usuario inserido com sucesso.`, id })
        })
        .catch(err => res.json({ message: `Erro ao inserir usuario: ${err.message}` }))
});

routerAPI.put('/users', function (req, res) {
    UserService.putUser(req.body).then(users => res.json(users)).catch(err => res.json({ message: `Erro ao atualizar user: ${err.message}` }))
});

routerAPI.delete('/users/:id', function (req, res) {
    UserService.deleteUser(req.params.id).then(users => res.json(users)).catch(err => res.json({ message: `Erro ao remover user: ${err.message}` }))
});

module.exports = routerAPI