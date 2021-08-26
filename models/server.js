const express = require('express')
const cors = require('cors');
const { dbConnection } = require('../db/config');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.usuariosPath = '/api/usuarios';

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
        this.app.use(this.usuariosPath, require('../routes/usuarios'));
    }

    listen() { 
        this.app.listen(this.port, () => {
            console.log(`Server in port `, this.port);
        })
    }

}

module.exports = Server;