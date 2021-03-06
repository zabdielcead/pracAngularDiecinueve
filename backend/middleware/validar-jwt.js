const { response } = require("express");
const jwt = require('jsonwebtoken');

const validarJWT = (req, res = response, next) => {

    const token = req.header('x-token');


    if(!token){
        res.status(403).json({
            ok:true,
            msg: 'error en el token',
            token
        })
    }


    try {


        const {uid, name} = jwt.verify(token, process.env.SECRET_JWT_SEED);
        console.log(uid, name);
        req.uid  = uid;
        req.name = name;
        
    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg:'Token no valid'
        });
    }


    next();
}




module.exports = {
    validarJWT
}