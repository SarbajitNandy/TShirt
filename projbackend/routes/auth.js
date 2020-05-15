var express = require("express")
var router = express.Router();
const { check } = require('express-validator');
const {signOut, signUp, signIn, isSignedIn} = require("../controllers/auth")


router.post(
  "/signup",
  [
    check("name", "Name should be atleast 3 chars").isLength({ min: 3 }),
    check("email", "email is required").isEmail(),
    check("password", "Password should be at least 3 char").isLength({min: 3})
  ],
  signUp
);
router.get("/signout", signOut)
router.post(
  "/signin",
  [
    check("email", "email is required").isEmail(),
    check("password", "Password field is required").isLength({ min: 1 })
  ],
  signIn
);

// example of protected route
router.get("/testroute",
    isSignedIn,
    (request, response) => {
      const user = request.auth;
      return response.json(user)
    }
)

module.exports = router;