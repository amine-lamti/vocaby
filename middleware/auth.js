const jwt = require('jsonwebtoken')
const jwtSecret = "secret"

module.exports = function(req, res, next){
    // Get token from the header
    const token = req.header('x-auth-token')

    // Check if token exists
    if(!token){
        return res.json({msg: "No token, access denied!"})
    }

    jwt.verify(token, jwtSecret, (err, decoded) => {
        if(err){
            res.json({msg: 'Token not valid!'})
        }

        req.user = decoded.user
        next()
    })
}