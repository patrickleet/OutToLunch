var express = require('express'),
	app = express.createServer(),
    fs = require('fs');

// bootstrap our schemas/models
var schemaPath = __dirname + '/models/';
var schemaFiles = fs.readdirSync(schemaPath);
schemaFiles.forEach(function(file){
    require(schemaPath + file);
});

// configure our application
require('./config.js')(app, express);

// bootstrap our routes
var routesPath = __dirname + '/routes/';
var routesFiles = fs.readdirSync(routesPath);
routesFiles.forEach(function(file){
    require(routesPath + file)(app, express);
});


app.listen(3000);