const express = require('express')
const cors = require('cors');
const { dbConnection } = require('../db/config');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;

        this.path = {
            auth:      '/api/auth',
            buscar:    '/api/buscar',
            usuarios:  '/api/usuarios',
            figuras:   '/api/categorias',
            productos: '/api/productos'
        }

        // Conectar db.
        this.conectarDb();

        //Midlewares
        this.middlewares();

        // Rutas de la app

        this.routes();
    }

    async conectarDb() {
        await dbConnection();
    }

    middlewares() {
        // cors
        this.app.use( cors() );

        // lectura y parseo
        this.app.use( express.json() );

        //directorio publico
        this.app.use(express.static('public') );
    }

    routes() {
        this.app.use(this.path.auth, require('../routes/auth'));
        this.app.use(this.path.buscar, require('../routes/buscar'));
        this.app.use(this.path.usuarios, require('../routes/usuarios'));
        this.app.use(this.path.figuras, require('../routes/categorias'));
        this.app.use(this.path.productos, require('../routes/productos'));
        
    }

    listen() { 
        this.app.listen(this.port, () => {
            console.log(`Server in port `, this.port);
        })
    }

}

module.exports = Server;