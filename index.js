const http = require('http'),
      fs = require('fs'),
      url = require('url'),
      methodOverride = require('method-override'),
      bodyParser = require('body-parser'),
      express = require('express'),
      morgan = require('morgan'),
      { check, validationResult } = require('express-validator');

const mongoose = require('mongoose');
const Models = require('./models.js');
const passport = require('passport');
require('./passport');

// Initalise express
const app = express();

// Implement CORS
const cors = require('cors');
app.use(cors()); // Allows all origin requests

// Custom CORS example
// let allowedOrigins = ['http://localhost:8080', 'http://test.herokuapp.com']; // Heroku app will get added here when live

// app.use(cors({
//   origin: function(origin, callback){
//     if(!origin) return callback(null, true);
//     if(allowedOrigins.indexOf(origin) === -1) { // If a specific origin isn’t found on the list of allowed origins
//       let message = 'The CORS origin policy for this application does not allow access from origin ' + origin;
//       return callback(new Error(message), false);
//     }
//     return callback(null, true);
//   }
// }));

// Connect mongodb database via connection string
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });
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

// AUTH ROUTES
let auth = require('./auth')(app);
let authentication = passport.authenticate('jwt', { session: false });

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
app.post('/users',
  // Validation
  [check('Username', 'Username is required').isLength({ min: 5 }),
  check('Username', 'Username contains non alphanumeric characters - not allowed').isAlphanumeric(),
  check('Password', 'Password is required').not().isEmpty(),
  check('Email', 'Email does not appear to be valid').isEmail()
  ], (req, res) => {
  // Check for errors
  let errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  let hashedPassword = Users.hashPassword(req.body.Password);
  Users.findOne({ Username: req.body.Username })
  .then(function(user) {
    if (user) {
      return res.status(400).send(req.body.Username + 'already exists')
    } else {
      Users.create({
        Username: req.body.Username,
        Password: hashedPassword,
        Email: req.body.Email,
        Birthday: req.body.Birthday
      })
      .then(function(user) { res.status(201).json(user) })
      .catch(function(error) {
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
app.get("/movies", function(req, res) {
  Movies.find()
    .then(function(movies) {
      res.status(201).json(movies);
    }).catch(function(error) {
      console.error(error);
      res.status(500).send("Error: " + error);
    });
});

let port = process.env.PORT || 8080;
app.listen(port, "0.0.0.0", function() {
  console.log(`Application is listening on port ${port}`);
});
