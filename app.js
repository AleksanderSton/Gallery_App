var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var swaggerJsdoc = require("swagger-jsdoc");
var swaggerUi = require("swagger-ui-express");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var galleriesRouter = require('./routes/galleries');
var imagesRouter = require('./routes/images');
var statsRouter = require('./routes/stats');

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Gallery API",
      version: "1.0.0",
      description: "Dokumentacja API",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: ["./routes/*.js"], 
};

const swaggerSpec = swaggerJsdoc(options);
var app = express();
const mongoose = require("mongoose");
const mongoDB = "mongodb://localhost:27017/GalleryDB";

async function main() {
  await mongoose.connect(mongoDB);
}
main().catch((err) => console.log(err));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/galleries', express.static(path.join(__dirname, 'public/images')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/galleries', galleriesRouter);
app.use('/images', imagesRouter);
app.use('/stats', statsRouter);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
