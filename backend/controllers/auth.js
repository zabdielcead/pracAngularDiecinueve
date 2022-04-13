const { response } = require('express'); 
const { validationResult } = require('express-validator');
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');



const crearUsuario = async (req, res = response) => {


    // const errors = validationResult(req);
    // console.log('errors',errors);

    // if(!errors.isEmpty()){
    //     return res.status(400).json({
    //         ok: false,
    //         errors: errors.mapped()
    //     });
    // }

   const {email,name,password} = req.body;
   console.log(email, name, password);



   try {

        //verificar el email

        const usuario = await Usuario.findOne({email: email});

        if( usuario ){
            return res.status(400).json({
                ok: false,
                msg: 'El usuario ya existe con ese email'
            })
        }

        //Crear el usuario con el modelo
        const dbUser = new Usuario(req.body);


        //Hashear el pass
        const salt = bcrypt.genSaltSync();
        dbUser.password = bcrypt.hashSync(password, salt);


        //generar el jwt
        const token = await generarJWT(dbUser.id, name);

        //crear usuario db
        await dbUser.save();

        //generar respuesta
        return res.status(201).json({
            ok: true,
            uid:dbUser.id,
            name,
            token
        });

       
   } catch (error) {
    return res.status(500).json({
        ok:     false,
        msg:    'Hable con el administrador'
    });
   }


  



    
};

const loginUsuario = async (req, res = response) => {

    // const errors = validationResult(req);
    // console.log('errors',errors);

    // if(!errors.isEmpty()){
    //     return res.status(400).json({
    //         ok: false,
    //         errors: errors.mapped()
    //     });
    // }

   const {email,password} = req.body;

   console.log(email, password);


   try {

        const dbUser = await Usuario.findOne({email:email});
        console.log('dbuser', dbUser);
        if(!dbUser){
            return res.status(400).json({
                ok:false,
                msg: 'El correo no existe'
            });
        }

        const validPassword = bcrypt.compareSync( password, dbUser.password );

        if(!validPassword){
            return res.status(400).json({
                ok:false,
                msg: 'El password no existe'
            });
        }

        // generar jwt 
        const token = await generarJWT(dbUser.id, dbUser.name);

        return res.json({
            ok:true,
            uid: dbUser.id,
            name: dbUser.name,
            token
        })
       
   } catch (error) {
       console.log(error);
       return res.status(500).json({
        ok:false,
        msg: 'Hable con el administrador'
    });
   }

    
};

const renew = async (req, res) => {

    const {uid, name } = req;

    const token = await generarJWT(uid, name);
   


    return res.json({
        ok:true,
        msg: 'renew',
        uid,
        name,
        token
    });
}


module.exports = {
    crearUsuario, 
    loginUsuario,
    renew
}