const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

console.log(process.env.TOKEN_SECRET);

var authenticateToken = (req, res, next) => {
    const authHeaders = req.headers['authorization']
    const token = authHeaders && authHeaders.split(' ')[1]

    // token not found
    if (token === null) return res.sendStatus(401)

    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {

        if (err) return res.sendStatus(403)

        req.user = user
        next()
    })


}

var generateToken = function(username){
    return jwt.sign({username}, process.env.TOKEN_SECRET, { expiresIn: '1d' })
}

module.exports = { authenticateToken: authenticateToken, generateToken: generateToken };