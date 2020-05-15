const User = require("../models/user");
const { validationResult } = require('express-validator');
const jwt = require("jsonwebtoken")
const expressJwt = require("express-jwt")


exports.signUp = (request, response) => {

    const errors = validationResult(request)  // validation part starts 

    if (!errors.isEmpty()){
        return response
            .status(422)
            .json({
                error: errors.array()[0].msg
            })
    }

    const user = new User(request.body);
    user.save( (err, user) => {
        if (err) {
            return response
            .status(400)
            .json({
                error: "Unable to save user in DB"
            })
        }
        response.json({
            name: user.name,
            email: user.email,
            id: user._id
        });
    })
}

exports.signOut = (request, response) => {
    response.clearCookie("token");
    response.json({
        message: "User Signout confirmed"
    })
}

exports.signIn = (request, response) => {
    const errors = validationResult(request)  // validation part starts 
    const {email, password} = request.body;

    if (!errors.isEmpty()){
        return response
            .status(422)
            .json({
                error: errors.array()[0].msg
            })
    }

    User.findOne({email}, (err, user)=> {
        if (err || !user) {
            return response
            .status(400)
            .json({
                error: "User doesn't exists"
            })
        }
        if (!user.authenticate(password)) {
            return response.status(401).json({
              error: "password do not match"
            });
        }
        // create token
        const token = jwt.sign({ _id: user._id}, process.env.SECRET)

        // put tokne in cookie 
        response.cookie("token", token, { expire: new Date()+9999});

        // send response to front end 
        const { _id, name, email, role} = user;

        return response.json({
            token,
            user: {_id, name, email, role} 
        })

    })
}

// checkings  
exports.isSignedIn = expressJwt({
    secret: process.env.SECRET,
    userProperty: "auth"
})

exports.isAuthenticated = ( request, response, next) => {
    // Here profile is supplied from the user over frontend
    let checker = request.profile && request.auth 
                && request.profile._id == request.auth._id;

    if (!checker) {
        return response.status(403)
            .json({
                error: "ACCESS DENIED"
            })
    }
    next();
}

exports.isAdmin = ( request, response, next) => {
    if ( request.auth.role === 0) {
        return response.status(403)
            .json({
                error: "You are not admin, ACCESS DENIED"
            })
    }
    next();
}