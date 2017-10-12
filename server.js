// server.js
// SERVER-SIDE JAVASCRIPT


/////////////////////////////
//  SETUP and CONFIGURATION
/////////////////////////////
var mongoose = require("mongoose")
mongoose.connect("mongodb://localhost/book-app");
var db = require('./models');


//require express in our app
var express = require('express'),
  bodyParser = require('body-parser');

// generate a new express app and call it 'app'
var app = express();

// serve static files in public
app.use(express.static('public'));

// body parser config to accept our datatypes
app.use(bodyParser.urlencoded({ extended: true }));

//mongoose files




////////////////////
//  DATA
///////////////////







////////////////////
//  ROUTES
///////////////////




// define a root route: localhost:3000/
app.get('/', function (req, res) {
  res.sendFile('views/index.html' , { root : __dirname});
});

// get all books
app.get('/api/books', function (req, res) {
  // send all books as JSON response
  db.Book.find(function(err, books){
    if (err) { return console.log("index error: " + err); }
  }).populate('author').exec(function(err, book){
    if(err){console.log(err)};
    console.log(book);
    res.json(book)
  });
});

// get one book
app.get('/api/books/:id', function (req, res) {
  // find one book by its id
  console.log('books show', req.params.id);
  db.Book.findOne({ _id: req.params.id},function(err,idFound){
    idFound.save(function(err, success){
      res.json(success)
    })
  })
});

// create new book
app.post('/api/books', function (req, res) {
  // create new book with form data (`req.body`)
  console.log('books create', req.body);
  var createBook = new db.Book({
    title: req.body.title,
    image: req.body.image,
    releaseDate: req.body.releaseDate
  });

  db.Author.findOne({name: req.body.author}, function(err, matchAuthor){
    console.log(err)
    createBook.author = matchAuthor;
    createBook.save(function(err, newBook){
      res.json(newBook)
    })
  })
});

// update book
app.put('/api/books/:id', function(req,res){
// get book id from url params (`req.params`)
  console.log('books update', req.params);
  var bookId = req.params.id;
  // find the index of the book we want to remove
  db.Book.findOne({ _id: bookId},function(err,bookFound){
    bookFound = new db.Book({
      title: req.body.title,
      image: req.body.image,
      releaseDate: req.body.releaseDate
    });
  db.Author.findOne({name: req.body.author}, function(err, author){
    if(err){console.log(err)};
    bookFound.author = author;
    bookFound.save(function(err, updateBook){
      res.json(updateBook)
    })
  })
  })})

// delete book
app.delete('/api/books/:id', function (req, res) {
  // get book id from url params (`req.params`)
  console.log('books delete', req.params);
  var bookId = req.params.id;
  // find the index of the book we want to remove
  db.Book.findOneAndRemove({_id: bookId},function(err,remove){
    if (err) { return console.log('err', err); }
    res.json(remove)
  })
});





app.listen(process.env.PORT || 3000, function () {
  console.log('Book app listening at http://localhost:3000/');
});
