const { Order, ProductCart } = require("../models/order");

exports.getOrderById = (request, response, next, id) => {
  Order.findById(id)
    .populate("products.product", "name price")
    .exec((err, order) => {
      if (err) {
        return response.status(400).json({
          error: "Can't get order"
        });
      }
      if (!order) {
        return response.status(400).json({
          error: "No order found"
        });
      }
      request.order = order;
      next();
    });
};

exports.createOrder = ( request, response) => {
    request.body.order.user = request.profile;
    let order = new Order(request.body.order)
    order.save( (err, order) => {
        if (err || !order) {
            return response.status(400).json({
                error: "Failed to store order"
            })
        }

        response.json(order)
    })
}

exports.getAllOrders = (request, response) => {
    Order.find({})
        .populate("user", "_id name email")
        .exec( (err, order) => {
            if (err) {
                return response.status(400).json({
                    error: "No order found in DB"
                })
            }
            response.json(order)
        })  
}

exports.getOrderStatus = (request, respose) => {
    response.json(Order.schema.path("status").enumValues);
}

exports.updateOrderStatus = (request, response) => {
    Order.update(
        { _id: request.body.orderId},
        {$set : {status : request.body.status}},
        (err, order) => {
            if (err) {
                return response.status(400).json({
                    error: "Failed to update order"
                })
            }
            response.json(order)
        }  
    )
}