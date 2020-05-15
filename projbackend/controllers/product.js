const Product = require("../models/product")
const formidable = require("formidable")
const _ = require("lodash")
const fs = require("fs")

exports.getProductById = (request, response, next, id) => {
    Product.findById(id)
    .populate("category")
    .exec( (err, product) => {
        if (err || !product) {
            return response.status(400).json({
                error : "No product found"
            })
        }
        request.product = product
        next();
    })
}

exports.createProduct = (request, response) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(request, (err, fields, file) => {
        if (err) {
            return response.status(400).json({
                error : "Problem with form submission"
            })
        }
        // destructure the fields
        const {name, description, price, category, stock } = fields;

        if (
            !name ||
            !description ||
            !price || 
            !category ||
            !stock
        ) {
            return response.status(400).json({
                error: "Please include all fields"
            })
        }

        // TODO: restrictions on field
        let product = new Product(fields)

        // handle file here
        if (file.photo) {
            if (file.photo.size > 3000000) {
                return response.status(400).json({
                    error: "Image size is bigger than the limit"
                })
            }

            product.photo.data = fs.readFileSync(file.photo.path)
            product.photo.contentType = file.photo.type
        }

        // save to db
        product.save( (err, product) => {
            if (err) {
                return response.status(400).json({
                    error: "Product save failed"
                })
            }
            response.json(product)
        })

    })
}

exports.getProduct = (request, response) => {
    request.product.photo.data = undefined
    return response.json(request.product);
}

exports.photo = (request, response, next) => {
    if (request.product.photo.data) {
        response.set("Content-Type", request.product.photo.contentType)
        return response.send(request.product.photo.data)
    }
    next()
}

exports.deleteProduct = (request, response) =>{
    let product = request.product;
    product.remove( (err, product) => {
        if (err) {
            return response.status(400).json({
                error: "product deletion failed"
            })
        }
        return response.json({
            message: `Product ${product._id} is deleted`
        })
    })
}

exports.updateProduct = (request, response) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(request, (err, fields, file) => {
        if (err) {
            return response.status(400).json({
                error : "Problem with form submission"
            })
        }
        // destructure the fields
        const {name, description, price, category, stock } = fields;

        if (
            !name ||
            !description ||
            !price || 
            !category ||
            !stock
        ) {
            return response.status(400).json({
                error: "Please include all fields"
            })
        }

        // Updation
        let product = request.product
        product = _.extend(product, fields)

        // handle file here
        if (file.photo) {
            if (file.photo.size > 3000000) {
                return response.status(400).json({
                    error: "Image size is bigger than the limit"
                })
            }

            product.photo.data = fs.readFileSync(file.photo.path)
            product.photo.contentType = file.photo.type
        }

        // save to db
        product.save( (err, product) => {
            if (err) {
                return response.status(400).json({
                    error: "Product updation failed"
                })
            }
            response.json(product)
        })

    })
}

exports.getAllProduct = (request, response) => {
    let limit = request.query.limit ? request.query.limit : 5;
    let sortBy = request.query.sortBy ? request.query.sortBy : "_id";

    Product.find({})
        .populate("category")
        .select("-photo")
        .sort([[sortBy, "asc"]])
        .limit(limit)
        .exec((err, allProduct) => {
            if (err) {
                return response.status(400).json({
                    error: "failed to fetch result from DB"
                })
            }
            response.json(allProduct)
    })
}

exports.updateStock = (request, response, next) => {
    let myOperations = request.body.order.products.map( prod => {
        return {
            updateOne : {
                filter: {_id: prod._id},
                update: {$inc : {stock: -prod.count, sold: +prod.count}}
            }
        }
    })

    Product.bulkWrite(myOperations, {}, (err, products) => {
        if (err) {
            return response.status(400).json({
                error: "Bulk write operation failed"
            })
        }
        next();
    })
}