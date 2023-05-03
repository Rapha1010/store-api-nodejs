const express = require('express')
const routerAPI = express.Router()
const bodyParser = require('body-parser');
const ProductService = require('../src/app/services/ProductService')
const UserService = require('../src/app/services/UserService')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const knex = require('knex')({
    client: 'sqlite3',
    connection: {
        filename: './dev.sqlite3'
    }
})

routerAPI.use(express.urlencoded({ extended: true }))
routerAPI.use(express.json())

const checkToken = (req, res, next) => {
    let authInfo = req.get('authorization')
    if (authInfo) {
        const [bearer, token] = authInfo.split(' ')

        if (!/Bearer/.test(bearer)) {
            res.status(400).json({ message: 'Tipo de token esperado não informado...', error: true })
            return
        }

        jwt.verify(token, process.env.SECRET_KEY, (err, decodeToken) => {
            if (err) {
                res.status(401).json({ message: 'Acesso negado' })
                return
            }
            req.usuarioId = decodeToken.id
            req.roles = decodeToken.roles
            next()
        })
    }
    else
        res.status(401).json({ message: 'Acesso negado' })
}

let isAdmin = (req, res, next) => {
    knex
        .select('*').from('users').where({ id: req.usuarioId })
        .then((usuarios) => {
            if (usuarios.length) {
                let usuario = usuarios[0]
                let roles = usuario.roles.split(';')
                let adminRole = roles.find(i => i === 'ADMIN')
                if (adminRole === 'ADMIN') {
                    next()
                    return
                }
                else {
                    res.status(403).json({ message: 'Role de ADMIN requerida' })
                    return
                }
            }
        })
        .catch(err => {
            res.status(500).json({
                message: 'Erro ao verificar roles de usuário - ' + err.message
            })
        })
}
routerAPI.get('/products', checkToken, function (req, res) {
    res.status(200).send(ProductService.getAllProducts())
});

routerAPI.get('/products/:id', checkToken, function (req, res) {
    res.status(200).send(ProductService.getProductById(req.params.id))
});

routerAPI.post('/products', checkToken, isAdmin, function (req, res) {
    let productLength = ProductService.getAllProducts().products.length;
    req.body.id = productLength + 1;
    res.status(201).send(ProductService.postProduct(req.body))
});

routerAPI.put('/products', checkToken, isAdmin, function (req, res) {
    res.status(204).send(ProductService.putProduct(req.body))
});

routerAPI.delete('/products/:id', checkToken, isAdmin, function (req, res) {
    res.status(204).send(ProductService.deleteProduct(req.params.id))
});

routerAPI.get('/users', checkToken, function (req, res) {
    UserService.getAllUsers().then(users => res.json(users)).catch(err => res.json({ message: `Erro ao recuperar users: ${err.message}` }))
});

routerAPI.get('/users/:id', checkToken, function (req, res) {
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

routerAPI.put('/users', checkToken, function (req, res) {
    UserService.putUser(req.body).then(users => res.json(users)).catch(err => res.json({ message: `Erro ao atualizar user: ${err.message}` }))
});

routerAPI.delete('/users/:id', checkToken, function (req, res) {
    UserService.deleteUser(req.params.id).then(users => res.json(users)).catch(err => res.json({ message: `Erro ao remover user: ${err.message}` }))
});

routerAPI.post('/security/register', function (req, res) {
    knex('users').insert({
        name: req.body.name,
        login: req.body.login,
        password: bcrypt.hashSync(req.body.password, 8),
        email: req.body.email,
        roles: req.body.roles
    }, ['id']).then((result) => {
        let user = result[0]
        res.status(200).json({
            "message": "usuário inserido com sucesso",
            "id": user.id
        })
        return
    }).catch(err => {
        console.log(err);
    })
});

routerAPI.post('/security/login', (req, res) => {
    knex
        .select('*').from('users').where({ login: req.body.login })
        .then(usuarios => {
            if (usuarios.length) {
                let usuario = usuarios[0]
                let checkSenha = bcrypt.compareSync(req.body.password, usuario.password)
                console.log(process.env.SECRET_KEY);
                if (checkSenha) {
                    var tokenJWT = jwt.sign({ id: usuario.id },
                        process.env.SECRET_KEY, {
                        expiresIn: 3600
                    })
                    res.status(200).json({
                        id: usuario.id,
                        login: usuario.login,
                        nome: usuario.name,
                        roles: usuario.roles,
                        token: tokenJWT
                    })
                    return
                }
            }

            res.status(200).json({ message: 'Login ou senha incorretos' })
        })
        .catch(err => {
            res.status(500).json({
                message: 'Erro ao verificar login - ' + err.message
            })
        })
});

module.exports = routerAPI