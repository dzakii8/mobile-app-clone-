var jwt = require('jsonwebtoken');

const signToken = (payload)=>{
  var token = jwt.sign(payload, process.env.JWT_SECRET);
  return token
}
const verifyToken = (token)=>{
  var decoded = jwt.verify(token, process.env.JWT_SECRET);
  return decoded
}

module.exports = {signToken, verifyToken}
