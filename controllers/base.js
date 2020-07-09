const express = require('express');
const router = express.Router();
const {Usuario} = require("../models/Usuarios");
const {Autenticador} = require("../middlewares/autenticador");

router.post("/fazercadastro", (req, res) => {
    const DataUser = req.body;
    if (DataUser.email == process.env.ADMINISTRADOR_EMAIL){
        DataUser.roles = "administrador";
    }
    const usuario = new Usuario(DataUser);

    //Validação de return

    usuario.save().then((usuario) =>{
        if(usuario){
            return usuario.GeradordeToken();
        } else{
            res.sendStatus(400);
        }
    }).then((token) =>{
        res.header({"x-auth": token}.send(usuario));
    }).catch((error) => {
        res.sendStatus(400);
    })
});


module.exports = router;