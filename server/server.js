const express = require('express'),
      app = express(),
      bodyParser = require('body-parser'),
      port = 3000,
      routes = require('./route');

module.exports = async () => {

    app.use(bodyParser.urlencoded({extended:true}));
    app.use(bodyParser.json());

    await routes(app);

    const server = app.listen(port);

    return server;
}