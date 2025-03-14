const bcrypt = require('bcrypt');

// password hashing

const hashPassword = (password) => {
  const saltRounds = 10;
  return bcrypt.hashSync(password, saltRounds);
}

// compare password

const comparePassword = (password, hashedPassword) => {
  return bcrypt.compareSync(password, hashedPassword);
}

module.exports = { hashPassword, comparePassword };

