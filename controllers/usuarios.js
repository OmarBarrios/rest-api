const { response } = require('express');
const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');
const { emailExiste } = require('../helpers/db-validators');

const usuariosGet = async(req, res = response) => {
    
    const { limite = 5, desde = 0 } = req.query;

    const [usuarios, total] = await Promise.all([
        Usuario.find({estado: true})
        .skip(Number(desde))
        .limit( Number(limite)),
        Usuario.countDocuments({estado: true})
    ])

    res.json({
        total,
        usuarios
    });
}

const usuariosPut = async(req, res = response) => {
    const { id } = req.params;
    const { _id, password, google, correo, ...resto } = req.body;

    // validar contra db
    if (password) {
        //encriptar
        const sall = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync( password, sall);
    }

    const usuario = await Usuario.findByIdAndUpdate( id, resto);

    res.json(usuario);
}

const usuariosPost = async (req, res = response) => {
    let body = req.body;
    let usuario = new Usuario({
        nombre : body.nombre,
        correo : body.correo,
        password : body.password,
        rol : body.rol
    });

    

    // verificar si el correo existe
    await emailExiste(body.correo);

    // ecriptar la contraseña
    const sall = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync( body.password, sall);

    //guardar en db
    await usuario.save();

    res.json({
        msg: 'post API',
        usuario 
    });
}

const usuariosDelete = async(req, res = response) => {
    
    const { id } = req.params;

    //borrar de la db.
    //const usuario = await Usuario.findByIdAndDelete(id);

    const usuario = await Usuario.findByIdAndUpdate(id, {estado: false});

    res.json(usuario);
}



module.exports = {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete
}