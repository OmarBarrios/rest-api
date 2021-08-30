const validarCampos = require('../middlewares/validar-campos');
const validarJWT  = require('../middlewares/validar-jwt');
const validarRole = require('../middlewares/validar-roles');

const {tieneRole} = validarRole; 

module.exports = {
    tieneRole,
    ...validarCampos,
    ...validarJWT,
    
}