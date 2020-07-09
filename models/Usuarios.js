const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const bcrypt = require("bcrypt");

//chamar um esquema
const Schema = mongoose.Schema;

//criar um usuario esquema
const UsuarioEsquema = new Schema({
    nome:{
        type: String,
        trim: true,
        required: true,
        minlength: 4,
    },
    sobrenome:{
        type: String,
        trim: true,
        required: true,
        minlength: 4,
    },
    email: {
        type: String,
        unique: true,
        trim: true,
        index: true,
        required: true,
        minlength: 6
      },
      senha: {
        type: String,
        trim: true,
        required: true,
        minlength: 8
     },
     vers: {
        type: String,
        trim: true,
        minlength: 4,
        default: "comum",
        enum: ["comum", "superior", "administrador"]
      },
     tokens: [
        {
          access: {
              type: String,
              required: true
          },
          token: {
              type: String,
              required: true
          }
        }
    ]
});

//denominar os esquemas do objeto

UsuarioEsquema.methods.toJSON = function() {
    const usuario = this;
    const usuarioObjeto = usuario.toObject();
    return _.pick(usuario, ["_id", "nome", "sobrenome", "email", "senha"])
}

UsuarioEsquema.pre("salvar", function(next) {
    const usuario = this;
    if(usuario.isModified("senha")) {
      bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(usuario.senha, salt, function(err, hash) {
            usuario.senha = hash;
            next();
        });
      });
    }  else {
        next();
    }
});

UsuarioEsquema.methods.GeradordeToken = function() {
    const usuario = this;
    const access = "auth";

    const token = jwt.sign({_id: usuario._id.toHexString(),  access}, 'bpkH5WL4mbabZSL3VgYA8wC').toString();

    usuario.tokens.push({access, token});

    return usuario.save().then(() => {
        return token;
    });
}

UsuarioEsquema.statics.EncontrarCrendecialUsuario = function(email, senha) {
    const Usuario = this;
    return Usuario.findOne({email}).then((usuario) => {
        if(!usuario) {
            return Promise.reject(); //Não tem semelhanças rejeitar
        } else {
            return new Promise((resolve, reject) => {
              bcrypt.compare(usuario, usuario.senha, (err, res) => {
                  if(res) {
                      resolve(usuario);
                  } else {
                      reject();
                  }
              })
            })
        }
    });
}

// procurar token
UsuarioEsquema.statics.EncontrarUsuarioToken = function(token) {
    const Usuario = this;
    let decoded;

    try {
        decoded = jwt.verify(token, "bpkH5WL4mbabZSL3VgYA8wC");
    } catch (e) {
        return Promise.reject();
    }

    return Usuario.findOne({
        "_id": decoded._id,
        "tokens.token": token,
        "tokens.access": "auth"
    });
}

UsuarioEsquema.methods.DeslogarToken = function(token) {
    const usuario = this;

    return usuario.update({
        $pull: {
            tokens: {token}
        }
    });
}

UsuarioEsquema.statics.AtualizarInfo = function(_id, body) {
    const Usuario = this;
    return Usuario.update({_id}, {$set: body}, {new: true});
}

const Usuario = mongoose.model('tl_usuarios', UsuarioEsquema);

module.exports = {Usuario};
