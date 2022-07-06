const stripe = require("stripe")("sk_test_51H1TigBgFNxBYUunMoGYrKJm2CDIeNRzS49tBYoJk36yLC76ku4dVpEnk68B3IFE7ijTKmpOsSKgD7gGJMTi4ywG001jd1JPkS")
const uuid = require("uuid/v4")


exports.makePayment = (request, response) => {
    const {token, products} = request.body;

    console.log(products);

    let amount = products.reduce( (currentVal, nextVal) => {
        return currentVal + nextVal.count * nextVal.price
    },0)

    const idempotencyKey = uuid();

    return stripe.customers.create({
        email: token.email,
        source: token.id,
    })
        .then( customer => {
            stripe.charges.create({
                amount: amount*100,
                currency: "usd",
                customer: customer.id,
                receipt_email: token.emnail,
                description: "a test account",
                shipping: {
                    name: token.card.name,
                    address: {
                        line1: token.card.address_line1,
                        line2: token.card.address_line2,
                        city: token.card.address_city,
                        country: token.card.address_country,
                        postal_code: token.card.address_zip
                    }
                }
            }, {idempotencyKey})
                .then( result => response.status(200).json(result))
                .catch( err => console.log(err))
        })
        .catch(err => console.log(err))
}