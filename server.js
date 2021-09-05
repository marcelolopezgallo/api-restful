const Contenedor = require('./contenedor.js')
const express = require('express')
const { stat } = require('fs')
const { error } = require('console')
const { Router } = express


const contenedor = new Contenedor('./productos.txt')
const app = express()
const router = new Router()

async function getProducts(req, res, next) {
    try {
        const products = await contenedor.getAll()
        res.json(products)
    } catch (error) {
        next(error)
    }
}

async function getProductsById(req, res, next) {
    try {
        const product = await contenedor.getById(req.params.id)
        res.json(product)
    } catch (error) {
        next(error)
    }
}

async function createProduct(req, res, next) {
    try {
        const id = await contenedor.create(req.body)
        res.json(id)
    } catch (error) {
        next(error)
    }
}

async function updateProduct(req, res, next) {
    try {
        contenedor.update(parseInt(req.params.id), req.body)
        res.json(`id: ${req.params.id} updated`)
    } catch (error) {
        next(error)
    }
}

async function deleteProduct(req, res, next) {
    try {
        contenedor.deleteById(req.params.id)
        res.json(`id: ${req.params.id} deleted`)
    } catch (error) {
        next(error)
    }
}

function errorFunction(err, req, res, next) {
    switch (err.message) {
        case 'producto no encontrado':
            res.json({
                error: err.message
            })
            break;

        default:
            break;
    }
    next()
}


app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
router.get('/', getProducts)
router.get('/:id', getProductsById)
router.post('/', createProduct)
router.put('/:id', updateProduct)
router.delete('/:id', deleteProduct)
router.use(errorFunction)

app.use('/api/productos', router)

const PORT = process.env.PORT || 8080

const server = app.listen(PORT, () => {
    console.log(`Servidor http escuchando en el puerto ${server.address().port}`)
})
server.on('error', error => console.log(`Error en servidor ${error}`))