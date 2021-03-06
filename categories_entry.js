var express = require('express');
var path = require('path');
var logger = require('morgan');
var compression = require('compression');
var methodOverride = require('method-override');
var session = require('express-session');
var flash = require('express-flash');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var dotenv = require('dotenv');
var nunjucks = require('nunjucks');
var mongoose = require('mongoose');

// Load environment variables from .env file
dotenv.load();

// Controllers
var ContactController = require('./controllers/contact');
var DirectoryController = require('./controllers/directory');
var HomeController = require('./controllers/home');
var SchoolController = require('./controllers/school');
var SearchController = require('./controllers/search');
var SitemapController = require('./controllers/sitemap');

var app = express();

mongoose.connect(process.env.MONGODB);
mongoose.connection.on('error', function() {
  console.log('MongoDB Connection Error. Please make sure that MongoDB is running.');
  process.exit(1);
});
mongoose.set('debug', true);

// view engine setup
var env = nunjucks.configure('views', {
  autoescape: true,
  noCache: true,
  express: app
});
require('nunjucks-phone-filter').install(env);

app.set('view engine', 'html');
app.set('port', process.env.PORT || 6001);
app.use(compression());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(methodOverride('_method'));
app.use(session({ secret: process.env.SESSION_SECRET, resave: true, saveUninitialized: true }));
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', HomeController.index);
app.get('/sitemap.xml', SitemapController.index);
app.get('/contact', ContactController.contactGet);
app.post('/contact', ContactController.contactPost);
app.get('/schools/:state/:slug', SchoolController.index);
// Handles routes like CA-schools, 94043-shools.
app.get('/:directory', DirectoryController.index);
app.get('/district/:district', DirectoryController.index);
app.get('/api/search', SearchController.index);

// Production error handler
if (app.get('env') === 'production') {
  app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.sendStatus(err.status || 500);
  });
}

app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});

module.exports = app;
