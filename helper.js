const bcrpyt = require("bcrypt");
const salt = bcrpyt.genSaltSync(10);
//function to sort through emails
const checkEmailExists = (obj, email) => {
  for (const key in obj) {
    if (obj[key].email === email) {
      return true
    } 
    }
    return false
  };

// Function to check password
const checkPassword = (obj, password) => {
  for (const key in obj) {
    if (bcrpyt.compareSync(password, obj[key].password) === true) {
      return true;
    } else {
      return false;
    }
  }
};

//function that returns
const findID = (obj, email) => {
  for (const key in obj) {
    if (obj[key].email === email) {
      return obj[key].id
    } 
    }
    return undefined
  }


const findURL = (obj, id) => {
  const emptyObj = {};
  for (const key in obj) {
    if (obj[key].userID === id) {
      emptyObj[key] = obj[key]
    } 
  }
  return emptyObj
}

function generateRandomString() {
  let shortedString = Math.random().toString(36).substring(2,8);
  return shortedString;
}

const getUserByEmail = (emailAddress, database) => {
  for (const user in database) {
    if (database[user].email !== emailAddress) {
      return undefined
    } else {
      return database[user].id
    }
  } 
}

//function to check if shortURL is a link
const checkShortLink = (shortLink, database) => {
  for (const id in database) {
    if (shortLink !== id) {
      return false
    }
  }
  return true;
};


module.exports = {
  checkEmailExists,
  generateRandomString,
  findURL,
  findID,
  checkPassword,
  getUserByEmail,
  checkShortLink
}