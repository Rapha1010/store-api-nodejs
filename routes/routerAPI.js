const express = require('express')
const routerAPI = express.Router()
const bodyParser = require('body-parser');
const ProductService = require('../src/app/services/ProductService')


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

module.exports = routerAPI