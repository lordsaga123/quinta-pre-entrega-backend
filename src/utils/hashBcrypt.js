const bcrypt = require("bcrypt");

const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

const isValidPassword = (password, user) => bcrypt.compareSync(password, user);

module.exports = {
    createHash,
    isValidPassword
}