const { request } = require('express');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

const validarJWT = async(req = request, res, next) => {

    const token = req.header('x-token');
    
    if (!token) {
        return res.status(401).json({
            msg: ' No hay token en la peticion'
        });
    }
    
    try {
    
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        //leer usuario que corresponde del uid
        const usuarioAuth = await Usuario.findById( uid );

        if (!usuarioAuth) {
            return res.status(401).json({
                msg: 'El usuario no existe'
            })
        }

        // verificar si el uid tieneestado true
        if (!usuarioAuth.estado) {
            return res.status(401).json({
                msg: 'Token no valido - usuario con estado: false'
            })
        }

        req.usuario = usuarioAuth;

        req.uid = uid;

        next();

    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'Token no valido'
        })
    }
}

module.exports = {
    validarJWT
}