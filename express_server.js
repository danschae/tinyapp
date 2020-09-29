const express = require("express");
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

//global function for generating a random string for the shorturl
function generateRandomString() {
  let shortedString = Math.random().toString(36).substring(2,8);
  return shortedString;
}

// can use bodyparser
app.use(bodyParser.urlencoded({extended: true}));

// can use cookie parsingdfsdfs
app.use(cookieParser());

app.set('view engine', 'ejs');

//object containing all the saved urlsear
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

//user informationd
const users = {};

//fudddnction to sort through emails
const sortObj = (obj, email) => {
  for (const key in obj) {
    if (obj[key].email === email) {
      return false
    } else {
    return true
    }
  }
};


//get the user registration page
app.get("/register", (req, res) => {
  res.render("sign_in")
})

//registration post, need to refactor!!!!
app.post("/register", (req,res) => {
  let generatedId = generateRandomString();
  users[generatedId] = {
    "id" : generatedId,
    "email": req.body.email,
    "password": req.body.password
  };
  // check email
  if (req.body.email.length <= 0 || req.body.password.length <= 0) {
    res.statusCode = 400;
    res.write("please fill in everything!");
    res.end();
  } else if (sortObj(users, req.body.email) === false) {
    res.statusCode = 400;
    res.write("email already exists!");
    res.end()
  } else {
  res.cookie("user_id", users[generatedId].id);
  res.redirect("/urls")
  }
});

// the method to login and store a cookie
app.post("/login", (req, res) => {
  res.redirect("/register")
});

//make it logout
app.post("/logout", (req, res) => {
  res.clearCookie("user_id")
  res.redirect("/urls")
});

//used to render the index url page
app.get("/urls", (req, res) => {
  const templatVars = {
    urls: urlDatabase,
    username: req.cookies["user_id"],
    users: users[req.cookies["user_id"]]
  };
  res.render("urls_index", templatVars);
});

// the page to add a new url
app.get("/urls/new", (req, res) => {
  const templatVars = {
    urls: urlDatabase,
    username: req.cookies["user_id"],
    users: users[req.cookies["user_id"]]
  };
  res.render("urls_new", templatVars);
});

// the posting method to add a new url
app.post("/urls", (req, res) => {
  let shortened = generateRandomString();
  urlDatabase[shortened] = req.body.longURL;
  res.redirect("/urls");
});

//the page for showing and then editing the urls
app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const templatVars = {
    shortURL: shortURL, 
    longURL: urlDatabase[shortURL],
    urls: urlDatabase,
    username: req.cookies["user_id"],
    users: users
  };
  res.render("urls_show", templatVars);
});

// the posting method for editing the long url
app.post("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect("/urls");
});

// the posting method for deleting a url
app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  res.redirect("/urls");
});

// the ability to reach a website by using its shortURL form
app.get("/u/:shortURL", (req, res) => {
  const  shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  if(!longURL) {
    res.statusCode = 404;
    res.write("404 - page not found");
    res.end();
  } else {
  res.redirect(longURL);
  }
})

// for the below ask a mentor!!!!!!!!!!!!!!!!
app.get("/", (req, res) => {
  res.redirect("/urls");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});