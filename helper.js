const bcrpyt = require("bcrypt");
const salt = bcrpyt.genSaltSync(10);
//function to sort through emails
const checkEmailExists = (obj, email) => {
  for (const key in obj) {
    if (obj[key].email === email) {
      return true
    } else {
    return false
    }
  }
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
    } else{
      return undefined
    }
  }
};

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

const getUserByEmail = (email, database) => {
  for (const user in database) {
    if (user.email === email) {
      return user.id
    } else {
      return "user not found!"
    }
  } 
}


module.exports = {
  checkEmailExists,
  generateRandomString,
  findURL,
  findID,
  checkPassword,
  getUserByEmail
}