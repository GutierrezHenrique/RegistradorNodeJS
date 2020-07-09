const http = require('http');
const express = require("express");
const app = express();
const path = require("path");
const socketio = require('socket.io');
const bodyParser = require('body-parser');
const {mongoose} = require("./db/database");
const baseControlador = require("./controllers/base");
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, './public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/usuario", baseControlador);
const port = process.env.PORT || 3451;

server.listen(port, () => {
    console.log("Porta do Servidor 3451");
});
