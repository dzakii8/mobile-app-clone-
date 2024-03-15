var bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(10);

const hashPassword = (password) =>{
  var hashedPassword = bcrypt.hashSync(password, salt); 
  return hashedPassword
}

const comparePassword = (password, hashedPassword) =>{
  return bcrypt.compareSync(password, hashedPassword); // true
}

module.exports = {hashPassword, comparePassword}