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

// can use cookie parsing
app.use(cookieParser());

app.set('view engine', 'ejs');

//object containing all the saved urls
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

// the method to login and store a cookie
app.post("/login", (req, res) => {
  res.cookie("username", req.body.username, {});
  res.redirect("/urls")
});

//make it logout
app.post("/logout", (req, res) => {
  res.clearCookie("username")
  res.redirect("/urls")
});

//used to render the index url page
app.get("/urls", (req, res) => {
  const templatVars = {
    urls: urlDatabase,
    username: req.cookies["username"]
  };
  res.render("urls_index", templatVars);
});

// the page to add a new url
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
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
  const templatVars = {shortURL: shortURL, longURL: urlDatabase[shortURL]};
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

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});