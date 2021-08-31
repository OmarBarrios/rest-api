const { Router } = require('express');
const { check } = require('express-validator');
const { crearCategoria, obtenerCategorias, obtenerCategoria, actualizarCategoria, borrarCategoria } = require('../controllers/categorias');
const { existeCategoria } = require('../helpers/db-validators');
const { validarJWT, validarCampos } = require('../middlewares');
const { esAdminRole } = require('../middlewares/validar-roles');

const router = Router();

// obtener todas las categorias
router.get('/', obtenerCategorias);

// obtener una categoria
router.get('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeCategoria ),
    validarCampos
], obtenerCategoria );

// crear categoria - privado 
router.post('/', [ 
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
 ], crearCategoria );

// actualizar categoria - privado
router.put('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('id').custom( existeCategoria ), 
    validarCampos
], actualizarCategoria );

// borrar una categoria - admin
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeCategoria ),
    validarCampos
], borrarCategoria);


module.exports = router;