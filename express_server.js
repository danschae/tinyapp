const express = require("express");
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const bcrpyt = require("bcrypt");
const salt = bcrpyt.genSaltSync(10);
const {
  checkEmailExists,
  generateRandomString,
  findURL,
  findID,
  checkPassword,
  checkShortLink
} = require("./helper"); // list of helper functions, check helper.js in the same folder to see more


// can use bodyparser
app.use(bodyParser.urlencoded({extended: true}));


//implementing cookiesession
app.use(cookieSession({
  name: 'session',
  keys: ["checkef3423242ffdesfdk", "32523523jdsfsdfs"]
}));

app.set('view engine', 'ejs');

//object containing all the saved urlsear
const urlDatabase = {};

//user informationd
const users = {};

//get the user registration page
app.get("/register", (req, res) => {
  const templatVars = {
    urls: urlDatabase,
    username: req.session.user_id,
    users: users[req.session.user_id]
  };
  res.render("register",templatVars);
});

//get to sign in page
app.get("/login", (req, res) => {
  const templatVars = {
    username: req.session.user_id,
  };
  res.render("log_in",templatVars);
});

//registration post
app.post("/register", (req,res) => {
  // check email
  if (req.body.email.length <= 0 || req.body.password.length <= 0) {
    return res.send("please fill in everything!");
  }
  if (checkEmailExists(users, req.body.email)) {
    return res.send("email already exists!");
  }

  let generatedId = generateRandomString();
  users[generatedId] = {
    "id" : generatedId,
    "email": req.body.email,
    "password": bcrpyt.hashSync(req.body.password, salt)
  };

  // res.cookie("user_id", users[generatedId].id);
  req.session.user_id =  generatedId;
  res.redirect("/urls");
});

//validating log in
app.post("/login", (req, res) => {

  if (req.body.email.length <= 0 || req.body.password.length <= 0) {
    return res.send("please fill in everything!");
  }
  if (checkEmailExists(users, req.body.email) === false) {
    return res.send("information is incorrect!");
  }
  if (checkEmailExists(users, req.body.email)) {
    if (!checkPassword(users, req.body.password)) {
      return res.send("information is incorrect");
    }
  }
  req.session.user_id = findID(users, req.body.email);
  res.redirect("/urls");
});

// the method to login and store a cookie
app.post("/registere", (req, res) => {
  res.redirect("/register");
});

app.post("/signin", (req, res) => {
  res.redirect("/login");
});


//make it logout
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/urls");
});

//used to render the index url page
app.get("/urls", (req, res) => {
  const newDatabase = findURL(urlDatabase, req.session.user_id);
  const templatVars = {
    findURL,
    urls: urlDatabase,
    username: req.session.user_id,
    users: users[req.session.user_id],
    newDatabase
  };
  if (!templatVars.username) {
    return res.redirect("/login");
  }
  res.render("urls_index", templatVars);
});

// the page to add a new url
app.get("/urls/new", (req, res) => {
  const templatVars = {
    urls: urlDatabase,
    username: req.session.user_id,
    users: users[req.session.user_id]
  };
  if (!templatVars.username) {
    res.send("must sign in first!");
    return res.redirect("/urls");
  }
  res.render("urls_new", templatVars);
});

// the posting method to add a new url
app.post("/urls", (req, res) => {
  let shortened = generateRandomString();
  urlDatabase[shortened] = {
    "longURL": req.body.longURL,
    "userID" : req.session.user_id
  };
  res.redirect(`/urls/${shortened}`);
});

//the page for showing and then editing the urls
app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  if (!checkShortLink(shortURL, urlDatabase)) {
    return res.send("404 - page not found");
  }
  const templatVars = {
    shortURL: req.params.shortURL,
    longurl: urlDatabase[shortURL].longURL,
    urls: urlDatabase,
    username: req.session.user_id,
    users: users[req.session.user_id]
  };

  // if they're not signed in, or the url does not belong to them they can be redirected
  if (urlDatabase[shortURL].userID !== req.session.user_id){
    return res.send("do not have permission to access this page!")
  }

  res.render("urls_show", templatVars);
});

// the posting method for editing the long url
app.post("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  if (urlDatabase[shortURL]["userID"] === req.session.user_id) {
    urlDatabase[shortURL].longURL = req.body.longURL;
  }
  res.redirect("/urls");
});

// the posting method for deleting a url
app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  if (urlDatabase[shortURL]["userID"] === req.session.user_id) {
    delete urlDatabase[shortURL];
  }
  res.redirect("/urls");
});

// the ability to reach a website by using its shortURL form
app.get("/u/:shortURL", (req, res) => {
  const  shortURL = req.params.shortURL;
  
  if (!urlDatabase[shortURL]) {
    return res.send("404 - page not found");
  } 
  const longurl = urlDatabase[shortURL].longURL;
  res.redirect(longurl);
});

app.get("/", (req, res) => {
  res.redirect("/urls");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});