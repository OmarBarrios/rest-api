const { response } = require("express");
const { Categoria } = require('../models/index');

// obtenerCategorias - paginado - total - populate
const obtenerCategorias = async(req, res=response) => {
    const { limite = 5, desde = 0 } = req.query;
 
    const [categorias, total] = await Promise.all([
        Categoria.find({estado: true}).populate('usuario', 'nombre')
        .skip(Number(desde))
        .limit( Number(limite)),
        Categoria.countDocuments({estado: true})
    ])

    res.json({
        total,
        categorias
    });
}

// obtenerCategoria - populate {}
const obtenerCategoria = async(req, res=response) => {
    const {id} = req.params;
    const getCategoria = await Categoria.findById(id).populate('usuario');
    
    res.json(getCategoria);
}

const crearCategoria = async(req, res = response) => {

    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({nombre});

    if (categoriaDB) {
        return res.status(401).json({
            msg: `La categoria ${categoriaDB.nombre}, ya existe`
        });
    }

    // generar la data a guardar
    const data = {
        nombre,
        usuario: req.usuario._id
    }

    const categoria = new Categoria(data);

    //guardar DB
    await categoria.save();

    res.status(201).json(categoria);

}

// actualizarCategoria
const actualizarCategoria = async(req, res=response) => {
    const { id } = req.params;
    const {estado, usuario, ...body} = req.body;

    body.nombre = body.nombre.toUpperCase();

    const categoria = await Categoria.findByIdAndUpdate( id, body, {new: true});

    res.json(categoria);
}

// borrarCategoria - estado:false
const borrarCategoria = async(req, res=response) => {
    const { id } = req.params;

    const categoria = await Categoria.findByIdAndUpdate(id, {estado: false});

    res.json(categoria);

}

module.exports = {
    obtenerCategorias,
    obtenerCategoria,
    crearCategoria,
    actualizarCategoria,
    borrarCategoria
}