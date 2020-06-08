const bcrypt = require('bcryptjs');

/**
 * Returns cypted string with given salt rounds
 * @param {*} string 
 * @param {*} saltRounds 
 */
const cryptString = (string, saltRounds = 10) => {
  return bcrypt.hashSync(string, bcrypt.genSaltSync(saltRounds));
};

/**
 * Compares if gien nonHashString equals hashed string
 * @param {*} nonHashString 
 * @param {*} hashString 
 */
const cryptCompare = (nonHashString, hashString) => {
  return bcrypt.compareSync(nonHashString, hashString);
};

module.exports = {
  cryptString,
  cryptCompare
};
