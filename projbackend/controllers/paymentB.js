var braintree = require("braintree");
const { request } = require("express");

var gateway = braintree.connect({
  environment: braintree.Environment.Sandbox,
  merchantId: "45zx4bp7mnp8s8mr",
  publicKey: "q8v4sz822ghftxmr",
  privateKey: "144375de3499eaa541e132330a58d0b2"
});

exports.getToken = (req, res) => {
    gateway.clientToken.generate({}, function (err, response) {
        if (err) {
            res.status(500).send(err)
        } else {
            res.send(response);
        }
      });
}

exports.processPayment = (req, res ) => {
    let nonceFromTheClient = req.body.paymentMethod

    let amountFromTheClient = req.body.amount

    gateway.transaction.sale({
        amount: amountFromTheClient,
        paymentMethodNonce: nonceFromTheClient,
        options: {
          submitForSettlement: true
        }
      }, function (err, result) {
          if (err) {
              res.send(500).json(err)
          } else {
              res.json(result)
          }
      });
}