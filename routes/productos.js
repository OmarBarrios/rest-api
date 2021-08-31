const { Router } = require('express');
const { check } = require('express-validator');
const { obtenerProductos, obtenerProducto, crearProducto, actualizarProducto, borrarProducto } = require('../controllers/productos');
const { existeProducto } = require('../helpers/db-validators');

const { validarJWT, validarCampos } = require('../middlewares');
const { esAdminRole } = require('../middlewares/validar-roles');


const router = Router();

// obtener todas las productos
router.get('/', obtenerProductos);

// obtener una producto
router.get('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeProducto ),
    validarCampos
],  obtenerProducto);

// crear producto - privado 
router.post('/', [ 
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'No es un id de MongoDb').isMongoId(),
    validarCampos
 ],  crearProducto);

// actualizar producto - privado
router.put('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeProducto ), 
    validarCampos
],  actualizarProducto);

// borrar una producto - admin
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeProducto ),
    validarCampos
], borrarProducto);


module.exports = router;