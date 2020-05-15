require('dotenv').config();

const mongoose = require("mongoose")
const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")

// My routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const categoryRoutes = require("./routes/category");
const productRoutes = require("./routes/product");
const orderRoutes = require("./routes/order");

const app = express()

// Database connection
mongoose.connect(process.env.DATABASE, 
{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})
.then( () =>{
    console.log("DB CONNECTED")
})
.catch( () => { 
    console.log("DB CONNECTION FAILED");
})

// Middlewares
app.use(bodyParser.json())
app.use(cookieParser())
app.use(cors())

// My routes
app.use("/api", authRoutes)
app.use("/api", userRoutes)
app.use("/api", categoryRoutes)
app.use("/api", productRoutes)
app.use("/api", orderRoutes)


// Port
const port = process.env.PORT

// Starting a server
app.listen(port, ()=>{
    console.log(`App is running at ${port}`);
}) 