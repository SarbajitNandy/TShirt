import React, {useState} from 'react';
import { isAuthenticated } from '../auth/helper';
import {Link} from "react-router-dom"
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

    const showStripButton = () => {
        return isAuthenticated() ? (
            <button className="btn btn-success">Pay with Stipe</button>
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