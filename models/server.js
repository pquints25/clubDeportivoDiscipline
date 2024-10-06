const express = require('express');
const path = require ('path');
const hbs = require('hbs');
const fs = require('fs');
const deporteRouter = require('../routes/deportes');

const app = express();


class Server{
    constructor(){
        this._app = express();
        this._port = 3000;
        this.middleware();
        this.routes();
    }

    middleware(){
        this._app.use(express.json());
        this._app.use(express.urlencoded({ extended: true}));
        this._app.set('view engine', 'hbs');
        this._app.set('views', path.join(__dirname, '../views'));
        /* this._app.use(express.static(path.join(__dirname, '../public'))); */
    }

    routes(){
        this._app.get('/', (req, res) => {
            res.render('index.hbs');
        })

        
        this._app.use('/deportes', deporteRouter);
    }


    listen() {
        try {
        this._app.listen(this._port, () => {
            console.log(`Escuchando en el puerto ${this._port}`);
        });
        } catch (error) {
        console.error('Error al iniciar el servidor:', error);
        }
    }
    }
    
    module.exports = Server;
