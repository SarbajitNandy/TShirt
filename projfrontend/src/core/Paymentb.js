import React, {useState, useEffect} from "react"
import { loadCart, cartEmpty } from "./helper/cartHelper";
import { Link } from "react-router-dom";
import { getMeToken, processPayment } from "./helper/paymentBhelper";
import { createOrder } from "./helper/orderHelper";
import { isAuthenticated } from "../auth/helper";

import DropIn from "braintree-web-drop-in-react"

const Paymentb = ({products, setReload = f => f, reload=undefined}) => {

    const [info, setInfo] = useState({
        loading: false,
        success: false,
        clientToken: null,
        error: "",
        instance: {}
    })

    const userId = isAuthenticated() && isAuthenticated().user._id
    const token = isAuthenticated() && isAuthenticated().token

    const {clientToken} = info;

    const getToken = (userId, token) => {
        getMeToken(userId, token)
            .then( info => {
                console.log("INFORMATION", info)
                if (info.error) {
                    setInfo({...info, error: info.error})
                } else {
                    const clientToken = info.clientToken
                    setInfo({clientToken})
                }
            })
    }

    useEffect(() => {
        getToken(userId, token);
    }, [])

    const showbtDropIn = () => {
        return (
        <div>
            { info.clientToken !== null && products.length > 0 ? 
            (
                <div>
                    <DropIn
                        options={{ authorization: clientToken }}
                        onInstance={(instance) => (info.instance = instance)}
                    />
                    <button className="btn btn-block btn-success "onClick={onPurchase}>Buy</button>
                </div>
            ): (<h3>Please Login or add something to cart</h3>) }
        </div>
    )}

    const onPurchase = () => {
        setInfo({loading:true})

        let nonce;
        let getNonce = info.instance
            .requestPaymentMethod()
            .then(data => {
                nonce = data.nonce
                const paymentData = {
                    paymentMethod: nonce,
                    amount: getAmount()
                };

                processPayment(userId, token , paymentData)
                    .then ( response => {
                        setInfo({...info, success: response.success, loading: false})
                        // TODO: 
                        console.log("PAYMENT success");   
                        console.log(response);
                        const orderData = {
                            products: products,
                            transaction_id: response.transaction_id,
                            amount: response.transaction.amount
                        }
                        console.log("order obj created")

                        createOrder(userId, token , orderData);

                        cartEmpty( () => {
                            console.log("Didn't crash at cart empty")
                        })
                        // force reload 
                        setReload(!reload);

                    })
                    .catch(error => { console.log(error);setInfo({loading: false, success: false})})
            })
    }

    const getAmount = () => {
        return products.reduce( (currentVal, nextVal) => {
            return currentVal + nextVal.count * nextVal.price
        },0)
    }

    return ( 
        <div>
           {showbtDropIn()}
        </div>
    );
}
 
export default Paymentb;