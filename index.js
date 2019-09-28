const http = require("http"),
  fs = require("fs"),
  url = require("url"),
  methodOverride = require("method-override"),
  bodyParser = require("body-parser"),
  express = require("express"),
  morgan = require("morgan");

// Initalise express
const app = express();

let Users = [
  {
    id: "1",
    name: "Lorenzo",
    username: "lorepirri",
    password: "",
    email: "",
    birthday: "",
    favorites: ["3"]
  }
];

let Directors = [
  { name: "Christopher Nolan", bio: "", birthyear: "", deathyear: "" },
  { name: "Steven Spielberg", bio: "", birthyear: "", deathyear: "" },
  { name: "Ridley Scott", bio: "", birthyear: "", deathyear: "" },
  { name: "Alex Proyas", bio: "", birthyear: "", deathyear: "" },
  { name: "Mel Brooks", bio: "", birthyear: "", deathyear: "" },
  { name: "Stanley Kubrick", bio: "", birthyear: "", deathyear: "" },
  { name: "Andrew Niccol", bio: "", birthyear: "", deathyear: "" }
];

let Genres = [
  {
    name: "SciFi",
    description:
      'Science fiction (often abbreviated Sci-Fi or SF) is a genre of speculative fiction that has been called the "literature of ideas". It typically deals with imaginative and futuristic concepts such as advanced science and technology, time travel, parallel universes, fictional worlds, space exploration, and extraterrestrial life. Science fiction often explores the potential consequences of scientific innovations.'
  },
  {
    name: "Crime",
    description:
      "Crime films, in the broadest sense, are a cinematic genre inspired by and analogous to the crime fiction literary genre. Films of this genre generally involve various aspects of crime and its detection."
  },
  {
    name: "Drama",
    description:
      "Drama is a genre of narrative fiction (or semi-fiction) intended to be more serious than humorous in tone"
  }
];

let topMovies = [
  {
    title: "Spider-Man: Far from Home",
    description:
      "Following the events of Avengers: Endgame (2019), Spider-Man must step up to take on new threats in a world that has changed forever.",
    genres: ["Action", "Adventure", "Sci-Fi"],
    director: "Jon Watts",
    imageUrl:
      "https://m.media-amazon.com/images/M/MV5BMGZlNTY1ZWUtYTMzNC00ZjUyLWE0MjQtMTMxN2E3ODYxMWVmXkEyXkFqcGdeQXVyMDM2NDM2MQ@@._V1_SY1000_CR0,0,674,1000_AL_.jpg",
    featured: true
  },
  {
    title: "Downton Abbey",
    description:
      "The continuing story of the Crawley family, wealthy owners of a large estate in the English countryside in the early 20th century.",
    genres: ["Drama"],
    director: " Michael Engler",
    imageUrl: "https://www.imdb.com/title/tt6398184/mediaviewer/rm2990120193",
    featured: false
  },
  {
    title: "Angel Has Fallen",
    description:
      "Secret Service Agent Mike Banning is framed for the attempted assassination of the President and must evade his own agency and the FBI as he tries to uncover the real threat. ",
    genres: ["Action", "Thriller"],
    director: "Ric Roman Waugh",
    imageUrl: "https://www.imdb.com/title/tt6189022/mediaviewer/rm3986854145",
    featured: true
  },
  {
    title: "Fast & Furious: Hobbs & Shaw",
    description:
      "Lawman Luke Hobbs and outcast Deckard Shaw form an unlikely alliance when a cyber-genetically enhanced villain threatens the future of humanity.",
    genres: ["Action", "Adventure"],
    director: "David Leitch",
    imageUrl:
      "https://m.media-amazon.com/images/M/MV5BOTIzYmUyMmEtMWQzNC00YzExLTk3MzYtZTUzYjMyMmRiYzIwXkEyXkFqcGdeQXVyMDM2NDM2MQ@@._V1_UY268_CR1,0,182,268_AL_.jpg",
    featured: true
  },
  {
    title: "Toy Story 4",
    description:
      'When a new toy called "Forky" joins Woody and the gang, a road trip alongside old and new friends reveals how big the world can be for a toy.',
    genres: ["Animation", "Adventure", "Comedy"],
    director: "Josh Cooley",
    imageUrl:
      "https://m.media-amazon.com/images/M/MV5BMTYzMDM4NzkxOV5BMl5BanBnXkFtZTgwNzM1Mzg2NzM@._V1_UX182_CR0,0,182,268_AL_.jpg",
    featured: false
  },
  {
    title: "Young Sherlock Holmes",
    description:
      "When assorted people start having inexplicable delusions that lead to their deaths, a teenage Sherlock Holmes (Nicholas Rowe) decides to investigate.",
    genres: ["Adventure", "Fantasy", "Mystery"],
    director: "Barry Levinson",
    imageUrl:
      "https://m.media-amazon.com/images/M/MV5BNmE0NTQ5ZjItN2MzNC00NjBhLTg0ZjYtYzFiMzFlMjhjNmNiXkEyXkFqcGdeQXVyNDk3NzU2MTQ@._V1_UX182_CR0,0,182,268_AL_.jpg",
    featured: false
  },
  {
    title: "Sherock Holmes: A Game of Shadows",
    description:
      "Detective Sherlock Holmes is on the trail of criminal mastermind Professor Moriarty, who is carrying out a string of random crimes across Europe.",
    genres: ["Action", "Adventure", "Crime"],
    director: "Guy Ritchie",
    imageUrl:
      "https://m.media-amazon.com/images/M/MV5BMTQwMzQ5Njk1MF5BMl5BanBnXkFtZTcwNjIxNzIxNw@@._V1_UX182_CR0,0,182,268_AL_.jpg",
    featured: false
  },
  {
    title: "Lock, Stock and Two Smoking Barrels",
    description:
      "A botched card game in London triggers four friends, thugs, weed-growers, hard gangsters, loan sharks and debt collectors to collide with each other in a series of unexpected events, all for the sake of weed, cash and two antique shotguns.",
    genres: ["Comedy", "Crime"],
    director: "Guy Ritchie",
    imageUrl:
      "https://m.media-amazon.com/images/M/MV5BMTAyN2JmZmEtNjAyMy00NzYwLThmY2MtYWQ3OGNhNjExMmM4XkEyXkFqcGdeQXVyNDk3NzU2MTQ@._V1_UX182_CR0,0,182,268_AL_.jpg",
    featured: true
  },
  {
    title: "Scott Pilgrim Vs. The World",
    description:
      "Scott Pilgrim must defeat his new girlfriend's seven evil exes in order to win her heart.",
    genres: ["Action", "Comedy", "Fantasy"],
    director: "Edgar Wright",
    imageUrl:
      "https://m.media-amazon.com/images/M/MV5BMTkwNTczNTMyOF5BMl5BanBnXkFtZTcwNzUxOTUyMw@@._V1_UX182_CR0,0,182,268_AL_.jpg",
    featured: true
  },
  {
    title: "Baby Driver",
    description:
      "After being coerced into working for a crime boss, a young getaway driver finds himself taking part in a heist doomed to fail.",
    genres: ["Action", "Crime", "Drama"],
    director: "Edgar Wright",
    imageUrl:
      "https://m.media-amazon.com/images/M/MV5BMjM3MjQ1MzkxNl5BMl5BanBnXkFtZTgwODk1ODgyMjI@._V1_UX182_CR0,0,182,268_AL_.jpg",
    featured: true
  }
];

app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(bodyParser.json());
app.use(methodOverride());
app.use(morgan("common"));
app.use(express.static("public"));

// Routes
app.get("/", function(req, res) {
  res.sendFile("index.html");
});

app.get("/documentation", function(req, res) {
  res.sendFile("documentation.html");
});

// Gets list of all movies
app.get("/movies", function(req, res) {
  res.send("Successful GET request returning data about all movies.");
});

// Gets the data about a single movie by title
app.get("/movies/:title", (req, res) => {
  res.send("Successful GET request returning data about a single movie.");
});

// Gets the data about a movie genre by name
app.get("/genre/:name", (req, res) => {
  res.send("Successful GET request returning data about a movie genre.");
});

// Gets the data about a director by name
app.get("/director/:name", (req, res) => {
  res.send("Successful GET request returning data about a director.");
});

// Adds data for a new user
app.post("/users", (req, res) => {
  let newUser = req.body;

  if (!newUser.username) {
    const message = "Missing username in request body";
    res.status(400).send(message);
  } else {
    res.send("User successfully added.");
  }
});

// Update the a user's information
app.put("/users/:username/:password/:email/:dateofbirth", (req, res) => {
  res.send("User information updated.");
});

// Adds movie to favorites for a user
app.post("/favorites/:username/:title", (req, res) => {
  res.send("add favorite movie by user.");
});

// Deletes a movie from a user's favorites list by username
app.delete("/favorites/:username/:title", (req, res) => {
  res.send("Movie successfully deleted from favorites.");
});

// Deletes a user from the user registry
app.delete("/users/:username", (req, res) => {
  res.send("User successfully deleted from registry.");
});

app.listen(3000);
