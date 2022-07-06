import React, {useState} from 'react';
import { isAuthenticated } from '../auth/helper';
import {cartEmpty} from "./helper/cartHelper"
import {Link} from "react-router-dom"
import StripeCheckout from 'react-stripe-checkout';
import {API} from "../backend"

const StripCheckout = ({products, setReload}) => {

    const [data, setData] = useState({
        loader: false,
        success: false,
        error: "",
        address : ""
    })

    const user = isAuthenticated() && isAuthenticated().user;
    const token = isAuthenticated() && isAuthenticated().token;

    const getFinalPrice = () => {
        return products.reduce( (currentVal, nextVal) => {
            return currentVal + nextVal.count * nextVal.price
        },0)
    }

    const makePayment = token => {
        const body = {
            token, products
        }
        const headers = {
            "Content-Type": "application/json"
        }
        return fetch(`${API}/stripe_payment`, {
            method: "POST",
            headers,
            body: JSON.stringify(body)
        })
            .then( response => {
                console.log(response);
                cartEmpty();
            })
            .catch( error => console.log(error))
    }

    const showStripButton = () => {
        return isAuthenticated() ? (
            <StripeCheckout
            stripeKey = "pk_test_51H1TigBgFNxBYUun1T8I7kHmH9EVXYPy8tmtS0yRTusV1xKyOxR3pJScXggymPvbvE9AFvwekPryu9DU8BdTRrEv00uzQrhqke"
            token={makePayment}
            amount={getFinalPrice() * 100}
            name="Buy Tshirt"
            shippingAddress
            billingAddress
            >    
                <button className="btn btn-success">Pay with Stipe</button>
            </StripeCheckout>
        ) : (
            <Link to="/signin">
                <button className="btn btn-warning">Sign In</button>
            </Link>
        )
    }

    return (
        <div>
            <h3 className="text-white">Strip checkout section {getFinalPrice()}</h3>
            {showStripButton()}
        </div>
    );
}
 
export default StripCheckout;