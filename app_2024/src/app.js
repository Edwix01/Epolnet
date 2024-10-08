const express = require('express');
const { engine } = require('express-handlebars');
const myconnection = require('express-myconnection');
const mysql = require('mysql');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
var https = require('https'); 
var fs = require('fs');
const loginRoutes = require('./routes/login');
const multer = require('multer');
const app = express();

const currentDir = path.join(__dirname, '..');

const PUERTO = 443;

https.createServer({
    key: fs.readFileSync(path.join(currentDir, 'http/key.pem')),
    cert: fs.readFileSync(path.join(currentDir, 'http/cert.pem'))
}, app).listen(PUERTO, function(){
    console.log('Escuchando en el puerto 443');
});

app.set('views', __dirname + '/views');
app.engine('.hbs', engine({
    extname: '.hbs'
}));
app.set('view engine', 'hbs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(myconnection(mysql, {
    host: 'sqlapp',
    user: 'adminnet',
    password: 'Cuador.0730',
    port: 3306,
    database: 'epolaris'
}));

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'next')));
app.use(express.static(path.join(__dirname, '..', '..', 'modulo_automatizacion', 'registros')));
app.use(express.static(path.join(__dirname, '..', '..', 'modulo_automatizacion', 'comandos')));
app.use(express.static(path.join(__dirname, '..', '..', 'Epops', 'inventarios')));
app.use(express.static(path.join(__dirname, '..', '..', 'Epops', 'balanceo')));
 
app.use('/', loginRoutes);

app.get('/', (req, res) => {
    if (req.session.loggedin) {
        // Verificar el privilegio del usuario
        if (req.session.privilege === 'admin') {
            res.render('home', { name: req.session.name, isAdmin: req.session.privilege === 'admin' }); // Página para administradores
        } else {
            res.render('homeOperadores', { name: req.session.name }); // Página para usuarios no administradores
        }
    } else {
        res.redirect('/login'); // Redirigir a los usuarios no autenticados a la página de inicio de sesión
    }
});
