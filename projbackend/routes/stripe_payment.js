const router = require("express").Router()

const {makePayment} = require("../controllers/stripe_payment")

router.post("/stripe_payment", makePayment)

module.exports = router