const { response } = require("express");
const { Producto, Categoria } = require('../models/index');

// obtenerProductos - paginado - total - populate
const obtenerProductos = async(req, res=response) => {
    const { limite = 5, desde = 0 } = req.query;
 
    const [productos, total] = await Promise.all([
        Producto.find({estado: true})
        .populate('usuario', 'nombre')
        .populate('categoria', 'nombre')
        .skip(Number(desde))
        .limit( Number(limite)),
        Producto.countDocuments({estado: true})
    ])

    res.json({
        total,
        productos
    });
}

// obtenerProducto - populate {}
const obtenerProducto = async(req, res=response) => {
    const {id} = req.params;
    const getProducto = await Producto.findById(id)
    .populate('usuario', 'nombre')
    .populate('categoria', 'nombre');
    
    res.json(getProducto);
}

const crearProducto = async(req, res = response) => {
    const {estado, usuario, ...body} = req.body;
    const productoDB = await Producto.findOne({nombre: body.nombre});
 
    if (productoDB) {
        return res.status(401).json({
            msg: `El producto ${productoDB.nombre}, ya existe`
        });
    }

     // generar la data a guardar
     const data = {
         ...body,
        nombre: body.nombre.toUpperCase(),
        usuario: req.usuario._id
     }
   
    const producto = new Producto(data);
    
    //guardar DB
    await producto.save();

    res.status(201).json(producto);
}

// actualizarProducto
const actualizarProducto = async(req, res=response) => {
    const { id } = req.params;
    const {estado, usuario, ...body} = req.body;

    if (body.nombre) {
        body.nombre = body.nombre.toUpperCase();
    }

    //body.usuario = req.usuario._id;

    const producto = await Producto.findByIdAndUpdate( id, body, {new: true});

    res.json(producto);
}

// borrarProducto - estado:false
const borrarProducto = async(req, res=response) => {
    const { id } = req.params;

    const producto = await Producto.findByIdAndUpdate(id, {estado: false});

    res.json(producto);
}

module.exports = {
    obtenerProductos,
    obtenerProducto,
    crearProducto,
    actualizarProducto,
    borrarProducto
}