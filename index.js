//Requiring packages
const express = require('express');
const app =  express();
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const http = require ('http').createServer(app);
const io = require('socket.io')(http);


//Informing us of socketio connections
io.on('connection', function(socket){
  console.log('a user connected');
});


//Setting view engine to ejs
app.set('view engine', 'ejs');



//Creating store for sessions
const MongoDBStore = require('connect-mongodb-session')(session);

//Connecting database for users and chat messages
require('./db/db');

//Requiring controllers
const chatController = require('./controllers/chatController.js');
const userController = require('./controllers/userController.js');
const authController = require('./controllers/authController.js');
const boardController = require('./controllers/boardController.js');
const chatSocket = require('./controllers/chatSocket.js')(io);
const boardSocket = require('./controllers/boardSocket.js')(io);

//Connecting to session database
const store = new MongoDBStore({
  uri: 'mongodb://localhost:27017/connect_mongodb_session_test',
  collection: 'mySessions'
});
//Database connection success message
store.on('connected', function() {
  store.client; // The underlying MongoClient object from the MongoDB driver
  console.log("THE STORE IS CONNECTED")
});

//Database connection failure message
store.on('error', function(error) {
  console.log(error)
});

//Use statement for the session
app.use(session({
  secret: 'This is a secret',
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
  },
  store: store,
  // Boilerplate options, see:
  // * https://www.npmjs.com/package/express-session#resave
  // * https://www.npmjs.com/package/express-session#saveuninitialized
  resave: true,
  saveUninitialized: true
}));

//Set port here
const port = 3000;

app.use(bodyParser.urlencoded({extended: false}));
app.use(methodOverride('_method'));
app.use(express.static('static'));

//Session handler
app.use((req, res, next)=>{
  if(!req.session){
    req.session = {};
  }
  if(typeof(req.session.user) == 'undefined'){
    req.session.user = {};
  }
  res.locals.user = req.session.user || {};
  if(req.session.message){
    res.locals.message = req.session.message;
    delete req.session.message;
    }
  next();
})

//Using controllers
app.use('/chat', chatController);
app.use('/user', userController);
app.use('/auth', authController);
app.use('/board', boardController);

app.get('/', (req, res) => {
  res.render('index.ejs');
});

//Start listening on port
http.listen(port, () => {
  console.log(`listening on port ${port}`);
});
