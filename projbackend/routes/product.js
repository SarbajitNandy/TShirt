var express = require("express");
var router = express.Router();

const {getUserById} = require("../controllers/user")
const {getProductById, createProduct, getProduct, photo, deleteProduct, updateProduct, getAllProduct} = require("../controllers/product")
const {isSignedIn, isAdmin, isAuthenticated} = require("../controllers/auth")


// params
router.param("userId", getUserById)
router.param("productId", getProductById)

// routes
// create
router.post(
  "/product/create/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  createProduct
);

// read
router.get("/product/:productId",  getProduct)
router.get("/product/photo/:productId", photo)

// delete
router.delete("/product/:productId/:userId", isSignedIn, isAuthenticated, isAdmin, deleteProduct)

// update
router.put("/product/:productId/:userId", isSignedIn, isAuthenticated, isAdmin, updateProduct)

// listing 
router.get("/products", getAllProduct)

module.exports = router;    