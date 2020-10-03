const bcrpyt = require("bcrypt");


//function to sort through emails
const checkEmailExists = (database, email) => {
  for (const ID in database) {
    if (database[ID].email === email) {
      return true;
    }
  }
};

// Function to check password
const checkPassword = (database, password) => {
  for (const ID in database) {
    if (bcrpyt.compareSync(password, database[ID].password)) {
      return true;
    }
  }
};

//function that returns
const findID = (database, email) => {
  for (const id in database) {
    if (database[id].email === email) {
      return database[id].id;
    }
  }
};

// a function used to shift through urls belonging to each user
const findURL = (database, id) => {
  const newDatabase = {};
  for (const ID in database) {
    if (database[ID].userID === id) {
      newDatabase[ID] = database[ID];
    }
  }
  return newDatabase;
};

// a function to generate a random id for users
const generateRandomString = () => {
  let shortedString = Math.random().toString(36).substring(2,8);
  return shortedString;
};

// function to search for a user be email
const getUserByEmail = (emailAddress, database) => {
  for (const user in database) {
    if (database[user].email === emailAddress) {
      return database[user].id;
    }
  }
};

//function to check if shortURL is a link
const checkShortLink = (shortLink, database) => {
  for (const id in database) {
    if (shortLink === id) {
      return true;
    }
  }
};


module.exports = {
  checkEmailExists,
  generateRandomString,
  findURL,
  findID,
  checkPassword,
  getUserByEmail,
  checkShortLink
};