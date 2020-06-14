const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { check, validationResult } = require('express-validator')

const User = require('../models/User')

const jwtSecret = "secret"

//Register User
router.post('/', [
    check('firstname', 'Please enter your first name').not().isEmpty(),
    check('lastname', 'Please enter your last name').not().isEmpty(),
    check('email', 'Please enter a valid email').isEmail(),
    check('password', 'Password must be 6 or more characters').not().isEmpty().isLength({min: 6}),
], (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.json({errors: errors.array()})
    }

    const { firstname, lastname, email, password, image} = req.body
    User.findOne({email})
        .then(user => {
            if(user){
                res.json({msg: 'User already exists!!'})
            }else{
                user = new User({
                    firstname,
                    lastname,
                    email,
                    password,
                    image
                })

                bcrypt.genSalt(10, (err, salt) =>{
                  bcrypt.hash(user.password, salt, (err, hashedPassword) => {
                      user.password = hashedPassword
                      user.save()
                      
                      const payload = {
                          user: {
                              id: user.id
                          }
                      }

                     jwt.sign(payload, jwtSecret, {expiresIn:3600000}, (err, token) => {
                         if(err) throw err
                         res.json({token})
                     })
                  })
                })

               
            }
        })
        .catch(err => console.log(err.message))
})

module.exports = router