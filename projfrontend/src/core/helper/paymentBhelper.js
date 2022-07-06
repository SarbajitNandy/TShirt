import {API} from "../../backend"

export const getMeToken = (userId, token ) => {
    return fetch(`${API}/payment/get_token/${userId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`
        }
    })
        .then( response  => response.json())
        .catch(err => console.log(err))
} 

export const processPayment = (userId, token , paymentInfo) => {
    return fetch(`${API}/payment/btraintree/${userId}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(paymentInfo)
    })
        .then( response  => response.json())
        .catch(err => console.log(err)) 
}