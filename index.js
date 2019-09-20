const http = require('http'),
      fs = require('fs'),
      url = require('url'),
      methodOverride = require('method-override'),
      bodyParser = require('body-parser'),
      express = require('express'),
      morgan = require('morgan');

// Initalise express
const app = express();

let topMovies = [{
    title: 'Spider-Man: Far from Home',
    author: 'Jon Watts'
  },
  {
    title: 'Downton Abbey',
    author: ' Michael Engler'
  },
  {
    title: 'Angel Has Fallen',
    author: 'Ric Roman Waugh'
  },
  {
    title: 'Fast & Furious: Hobbs & Shaw',
    director: 'David Leitch'
  },
  {
    title: 'Toy Story 4',
    director: 'Josh Cooley'
  },
  {
    title: 'Young Sherlock Holmes',
    director: 'Barry Levinson'
  },
  {
    title: 'Sherock Holmes: A Game of Shadows',
    director: 'Guy Ritchie'
  },
  {
    title: 'Lock, Stock and Two Smoking Barrels',
    director: 'Guy Ritchie'
  },
  {
    title: 'Scott Pilgrim Vs. The World',
    director: 'Edgar Wright'
  },
  {
    title: 'Baby Driver',
    director: 'Edgar Wright'
  }
]

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(morgan('common'));
app.use(express.static('public'));

// Routes
app.get('/', function(req, res) {
  res.sendFile('index.html');
});

app.get('/documentation', function(req, res) {
  res.sendFile('documentation.html');
});

app.get('/movies', function(req, res) {
  res.json(topMovies);
});

app.listen(3000);
