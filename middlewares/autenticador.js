const {Usuario} = require("../models/Usuarios");

const Autenticador = (req, res, next) => {
    var token = req.header("x-auth");
    console.log(token);
    Usuario.EncontrarUsuarioToken(token).then((usuario) => {
        if(!usuario) {
            return Promise.reject();
        } else {
            req.usuario = usuario;
            req.token = token;
            next();
        }
    }).catch((error) => {
        res.status(401).send();
    });
}

module.exports = {Autenticador};
