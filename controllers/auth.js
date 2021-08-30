const { response } = require('express');
const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');

const login = async (req, res = response ) => {

    const { correo, password } = req.body;

    try {

        // verificar si el email existe
        const usuario = await Usuario.findOne({ correo });
        if (!usuario) {
            return res.status(400).json({
                msg: 'Usuario / password no son correctos - correo'
            });
        }

        // si el usuario esta activo
        if ( usuario.estado === false ) {
            return res.status(400).json({
                msg: 'Usuario / password no son correctos - estado:false'
            });
        }

        // verificar la contraseña
        const validarPassword = bcrypt.compareSync( password, usuario.password );
        if ( !validarPassword ) {
            return res.status(400).json({
                msg: 'Usuario / password no son correctos - password'
            });
        }

        // generar el JWT
        const token = await generarJWT(usuario.id);
        
        res.json({
            usuario,
            token
        })



    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Hable con el administrador'
        })
    }
}

const googleSignin = async (req, res = response) => {
    
    const {id_token} = req.body;

    try {

        const { correo, nombre, img} = await googleVerify(id_token);

        let usuario = await Usuario.findOne({correo});

        if (!usuario) {
            //tengo que crearlo
            const data = {
                nombre,
                correo,
                password: ':p',
                img,
                google: true
            };

            usuario= new Usuario(data);
            await usuario.save();
        }

        //si el usuario en db
        if (!usuario.estado) {
            res.status(401).json({
                msg: 'Hable con el administrador, usuario bloqueado',
            })
        }

        // generar el JWT
        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        })


    } catch (error) {
        console.log(error);
        res.status(400).json({
            msg: 'Tooken de google no es valido'
        })
    }
}

module.exports = {
    login,
    googleSignin
}