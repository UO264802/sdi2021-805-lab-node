
//mongodb://admin:sdi@tiendamusica-shard-00-00.gu0l8.mongodb.net:27017,
// tiendamusica-shard-00-01.gu0l8.mongodb.net:27017,
// tiendamusica-shard-00-02.gu0l8.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-hld8dh-shard-0&authSource=admin&retryWrites=true&w=majority
//Modulos
let express = require('express');
let app = express();

let expressSession = require('express-session');
app.use(expressSession({
    secret: 'abcdefg',
    resave: true,
    saveUninitialized: true
}));

let mongo = require('mongodb');
let swig = require('swig');
let bodyParser = require('body-parser');
let fileUpload = require('express-fileupload');
let crypto = require('crypto');


app.use(fileUpload());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

let gestorBD = require("./modules/gestorBD.js");
gestorBD.init(app,mongo);

// Variables
app.set('port', 8081);
app.set('db', 'mongodb://admin:sdi@tiendamusica-shard-00-00.gu0l8.mongodb.net:27017,tiendamusica-shard-00-01.gu0l8.mongodb.net:27017,tiendamusica-shard-00-02.gu0l8.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-hld8dh-shard-0&authSource=admin&retryWrites=true&w=majority');
app.set('clave','abcdefg');
app.set('crypto',crypto);
//Rutas/controladores por lógica
require("./routes/rusuarios.js")(app, swig, gestorBD); // (app, param1, param2, etc.)
require("./routes/rcanciones.js")(app, swig, gestorBD);// (app, param1, param2, etc.)
require("./routes/rautores.js")(app, swig);



//Lanzar el servidor
app.listen(app.get('port'), function (){
    console.log('servidor activo');
});