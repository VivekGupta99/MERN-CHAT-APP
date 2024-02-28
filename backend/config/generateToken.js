const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, 'secrate', {
        expiresIn: "1d"
    })
}

module.exports = generateToken