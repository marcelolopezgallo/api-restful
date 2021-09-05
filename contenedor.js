const fs = require('fs')

class Contenedor {
    constructor(filename) {
        this.filename = filename
    }

    async create(product) {
        const contenido = await this.getAll()

        if (contenido.length == 0) {
            product.id = 1
            contenido.push(product)
        } else {
            product.id = contenido[contenido.length - 1].id + 1
            contenido.push(product)
        }

        await fs.promises.writeFile(this.filename, JSON.stringify(contenido))

        return product.id
    }

    async update(id, product) {
        const contenido = await this.getAll()

        const index = contenido.findIndex(p => p.id === id)
        if (index !== -1) {
            contenido[index].title = product.title
            contenido[index].price = product.price
            contenido[index].thumbnail = product.thumbnail
        } else {
            throw Error('producto no encontrado')
        }

        await fs.promises.writeFile(this.filename, JSON.stringify(contenido))
    }

    async getById(id) {
        const contenido = await this.getAll()

        const filteredProduct = contenido.filter(producto => producto['id'] == id)

        if (filteredProduct.length !== 0) {
            return filteredProduct[0]
        } else {
            throw Error('producto no encontrado')
        }
    }

    async getAll() {
        try {
            const contenido = await fs.promises.readFile(this.filename, 'utf-8')
            return JSON.parse(contenido)
        } catch (err) {
            throw new Error(`Error al abrir el archivo: ${err}`)
        }
    }

    async deleteById(id) {
        const contenido = await this.getAll()
        const filteredProduct = contenido.filter(producto => producto['id'] == id)
        
        if (filteredProduct.length !== 0) {
            await fs.promises.writeFile(this.filename, JSON.stringify(contenido.filter(element => element.id != id)))
        } else {
            throw Error('producto no encontrado')
        }
    }

    async deleteAll() {
        await fs.promises.writeFile(this.filename, JSON.stringify([])) //borro todos los elementos
    }
}

module.exports = Contenedor