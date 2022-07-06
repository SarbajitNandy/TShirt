const router = require("express").Router()

const {isSignedIn, isAuthenticated} = require("../controllers/auth")
const {getToken, processPayment} = require("../controllers/paymentB")
const { getUserById } = require("../controllers/user")


router.param("userId", getUserById)

router.post("/payment/btraintree/:userId", isSignedIn, isAuthenticated, processPayment)

router.get("/payment/get_token/:userId", isSignedIn, isAuthenticated, getToken)

module.exports = router