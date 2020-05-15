const User = require("../models/user");
const Order = require("../models/order");


exports.getUserById = (request, response, next, id) => {
    User.findById(id)
    .exec( (err, user) => {
        if (err || !user) {
            return response
                .status(400)
                .json({
                    error: "No user was found in DB"
                })
        }
        request.profile = user;
        next();
    })
}

exports.getUser = (request, response) => {
    request.profile.salt = undefined;
    request.profile.encry_password = undefined;
    request.profile.createdAt = undefined;
    request.profile.updatedAt = undefined;

    return response.json(request.profile);
}

exports.getAllUser = (request, response) => {
    User.find({}, (err, users) => {
        if (err || !users) {
            return response.status(400)
                .json({
                    error: "No user found"
                })
        }

        users.forEach( (item) => {
            item.salt = undefined;
            item.encry_password = undefined;
            item.createdAt = undefined;
            item.updatedAt = undefined;
        })
        
        return response.json({
            Users: users
        })
    })
}

exports.updateUser = (request, response) => {
    // Here profile is supplied from the user over frontend
    User.findByIdAndUpdate(
        { _id: request.profile._id},
        {$set: request.body},
        { new: true, useFindAndModify: false},
        ( err, user) => {
            if (err) {
                return response.status(400)
                    .json( {
                        error: "You are not authorized to update user"
                    })
            }
            user.salt = undefined;
            user.encry_password = undefined;
            user.createdAt = undefined;
            user.updatedAt = undefined;
            return response.json(user)
        }

    )
}

exports.userPurchaseList = (request, response) => {
    // Here profile is supplied from the user over frontend
    Order.find({ user: request.profile._id})
    .populate("user", "_id name")
    .exec( (err, orders ) => {
        if (err) {
            return response.status(401)
                .json({
                    error: "No order in this account"
                })
        }

        return response.json(orders);
    })
}

exports.pushOrderInPurchaseList = (request, response, next) => {
    let purchases = [];

    request.body.order.products.forEach( product => {
        purchases.push({
            _id: product._id,
            name: product.name,
            description: product.description,
            category: product.category,
            quantity: product.quantity,
            amount: request.body.order.amount,
            transaction_id: request.body.order.transaction_id
        });
    });

    User.findOneAndUpdate(
        { _id: request.profile._id},
        {$push: {purchases: purchases}},
        { new: true},  // new: true means return me the updated object
        (err, purchases) => {
            if (err) {
                return response.status(400)
                        .json({
                            error: "Unable to save purchase list"
                        });
            }
            next();
        }
    )
}