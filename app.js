
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.home);
app.get('/song/:id', routes.song.one);

app.get('/album', routes.album.list);
app.get('/album/:id', routes.album.one);
app.get('/lyricist', routes.lyricist.list);
app.get('/lyricist/:id', routes.lyricist.one);
app.get('/composer', routes.composer.list);
app.get('/composer:id', routes.composer.one);
app.get('/singer', routes.singer.list);
app.get('/singer/:id', routes.singer.list);


http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
