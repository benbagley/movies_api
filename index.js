const http = require('http'),
      fs = require('fs'),
      url = require('url'),
      methodOverride = require('method-override'),
      bodyParser = require('body-parser'),
      express = require('express'),
      morgan = require('morgan');

const mongoose = require('mongoose');
const Models = require('./models.js');

// Initalise express
const app = express();

// Connect mongodb database via connection string
mongoose.connect('mongodb://localhost:27017/myFlixDB', { useNewUrlParser: true });
// Database models
const Movies = Models.Movie;
const Users = Models.User;

app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.use(bodyParser.json());
app.use(methodOverride());
app.use(morgan('common'));
app.use(express.static('public'));

// Routes
app.get('/', function(req, res) {
  res.sendFile('index.html')
});

app.get('/documentation', function(req, res) {
  res.sendFile('documentation.html')
});

// USER ROUTES
// Get all users
app.get('/users', (req, res) => {
  Users.find()
    .then(function(users) {
      res.status(201).json(users)
    })
    .catch(function(err) {
      console.error(err)
      res.status(500).send('Eorror ' + err)
    });
});

// Adds data for a new user
app.post('/users', (req, res) => {
  Users.findOne({ Username: req.body.username })
  .then(function(user) {
    if (user) {
      return res.status(400).send(req.body.Username + 'already exists')
    } else {
      Users.create({
        Username: req.body.Username,
        Password: req.body.Password,
        Email: req.body.Email,
        Birthday: req.body.Birthday
      })
      .then(function(user) { res.status(201).json(user) })
      .catch(function(user) {
        console.error(error)
        res.status(500).send('Error ' + error)
      })
    }
  }).catch(function(error) {
    console.log(error)
    res.status(500).send('Error ' + error)
  });
});

// Get a user my their username
app.get('/users/:Username', (req, res) => {
  Users.findOne({ Username: req.params.Username })
  .then(function(user) {
    res.json(user)
  })
  .catch(function(err) {
    console.error(err)
    res.status(500).send('Error: ' + error)
  });
});

// Update a user by their username
app.put('/users/:Username', (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, { $set:
  {
    Username: req.body.Username,
    Password: req.body.Password,
    Email: req.body.Email,
    Birthday: req.body.Birthday
  }},
  { new: true }, // This line makes sure that the updated record is returned
  function(err, updatedUser) {
    if (err) {
      console.error(err)
      res.status(500).send('Error: ' + err)
    } else {
      res.json(updatedUser)
    }
  });
});

// Delete a user by their username
app.delete('/users/:Username', (req, res) => {
  Users.findOneAndDelete({ Username: req.params.Username })
  .then(function(user) {
    if (!user) {
      res.status(400).send(req.params.Username + ' was not found')
    } else {
      res.status(200).send(req,params.Username + ' was deleted')
    }
  })
  .catch(function(err) {
    console.error(err)
    res.status(500).send('Error: ' + err)
  });
});

// Add a movie to the users favorites
app.post('/users/:Username/Movies/:MovieID', (req, res) => {
  Users.findByIdAndUpdate({ Username: req.body.Username }, {
    $push: { FavoriteMovies: req.params.MovieID }
  },
  { new: true },
  function(err, updatedUser) {
    if (err) {
      console.error(err)
      res.status(500).send('Error ' + err);
    } else {
      res.json(updatedUser)
    }
  });
});

// MOVIE ROUTES
// Gets list of all movies
app.get('/movies', function(req, res) {
  res.send('Successful GET request returning data about all movies.')
});

app.listen(3000);
