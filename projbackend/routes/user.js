var express = require("express")
var router = express.Router();

const {getUser, getUserById, getAllUser, updateUser, userPurchaseList } = require("../controllers/user");
const {isSignedIn, isAdmin, isAuthenticated} = require("../controllers/auth");


router.param("userId", getUserById);

router.get("/user/:userId", isSignedIn, isAuthenticated, getUser);

router.put("/user/:userId", isSignedIn, isAuthenticated, updateUser);

router.get("/users", isSignedIn, isAuthenticated, isAdmin, getAllUser);

router.get("/orders/user/:userId", isSignedIn, isAuthenticated, userPurchaseList);

module.exports = router