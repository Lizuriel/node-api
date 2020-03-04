require('rootpath')(); // permet d'avoir des liens relatifs exprimé a partir du dossier racine du projet
const express = require('express');
const app = express();
const cors = require('cors'); // options pour Connect Express
const bodyParser = require('body-parser');
const jwt = require('_middleware/jwt');
const errorHandler = require('_middleware/error-handler');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// use sequelize 
var MODELS = require('models/index');
MODELS.sequelize.sync({});
// app.use()

// use JWT auth to secure the api
app.use(jwt());

// api routes
app.use('/users', require('router/user.router'));

// global error handler
app.use(errorHandler);

// start server
const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 3333;
const server = app.listen(port, function () {
    console.log('Server listening on port ' + port);
});
