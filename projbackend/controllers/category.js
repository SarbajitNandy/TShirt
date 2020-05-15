const Category = require("../models/category");
const Product = require("../models/product")

exports.getCategoryById = (request, response, next, id) => {
    Category.findById(id)
    .exec( (err, category) => {
        if (err) {
            return response.status(400)
                .json({
                    error: "Category not found"
                })
        }
        request.category = category;
        next();
    })
}

exports.createCategory = (request, response) => {

    const category = new Category(request.body);

    category.save( (err, category)=>{
        if (err) {
            return response.status(400)
                .json({
                    error: "Not able to save category"
                })
        }
        response.json({category})
    })
}

exports.getCategory = (request, response) => {
    return response.json(request.category);
}

exports.getAllCategory = (request, response) => {
    Category.find({})
    .exec( (err, categories) => {
        if (err) {
            return response.status(400)
                .json({
                    error: "No category found"
                })
        }

        return response.json(categories)
    })
}

exports.updateCategory = (request, response) => {
    let category = request.category;
    category.name = request.body.name;
    category.save( (err, update_category) => {
        if (err){
            return response.status(400)
            .json({
                error: "Updation failed"
            })
        }
        return response.json(update_category)
    } )
}

exports.removeCategogry = (request, response) => {
    let category = request.category

    Product.find({ category: category._id})
    .exec( (err, Products) => {
        if (err) {
            return response.status(400)
            .json({
                error: "Deletion failed"
            })
        } else if ( Products.length>=1 ) {
            return response.status(403)
            .json({
                error: `Can not remove category '${category.name}', Some Products are belonging to this category.`
            })
        } else {
            category.remove( (err, category) => {
                if (err){
                    return response.status(400)
                    .json({
                        error: "Deletion failed"
                    })
                }
        
                return response.json({
                    message: "category deleted"
                })
            })
        }
    })

    
}