const { Router } = require('express');
const { check } = require('express-validator');
const { crearUsuario, loginUsuario, renew } = require('../controllers/auth');
const { validarCampos } = require('../middleware/validar-campos');
const { validarJWT } = require('../middleware/validar-jwt');

const router = Router();


router.post('/new',[
    check('name','El nombre es obligatorio').not().isEmpty(),
    check('email','El email es obligatorio').isEmail(),
    check('password','El password es obligatorio').isLength({min:6}),
    validarCampos
], crearUsuario);

router.post('/',[
    check('email','El email es obligatorio').isEmail(),
    check('password','El password es obligatorio').isLength({min:6}),
    validarCampos
], loginUsuario);

router.get('/renew', validarJWT , renew);



module.exports = router;