import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import ImageHelper from "./helper/ImageHelper";
import {addItemToCart, removeItemFromCart} from "../core/helper/cartHelper"

const Card = ({
  product,
  addToCart = true,
  removeFromCart = false,
  setReload = f => f,
  reload = undefined,
}) => {
  const [redirect, setRedirect] = useState(false);
  const [count, setCount] = useState(product.count);

  const cardTitle = product ? product.name : "A photo from pixel";
  const cardDescription = product ? product.description : "A photo from pixel";
  const cardPrice = product ? product.price : "5";

  const getRedirect = () => {
    if (redirect) {
      return <Redirect to="/cart" />;
    }
  };

  const showAddToCard = () => {
    return (
      addToCart && (
        <button
          onClick={() => addItemToCart(product, () => setRedirect(true))}
          className="btn btn-block btn-outline-success mt-2 mb-2"
        >
          Add to Cart
        </button>
      )
    );
  };

  const showRemoveFromCart = () => {
    return (
      removeFromCart && (
        <button
          onClick={() => { removeItemFromCart(product._id); setReload(!reload) } }
          className="btn btn-block btn-outline-danger mt-2 mb-2"
        >
          Remove from cart
        </button>
      )
    );
  };

  return (
    <div className="card text-white bg-dark border border-info">
      <div className="card-header lead">{cardTitle}</div>
      <div className="card-body">
        {getRedirect()}
        <ImageHelper product={product} />
        <p className="lead bg-success font-weight-normal text-wrap">
          {cardDescription}
        </p>
        <p className="btn btn-success rounded  btn-sm px-4">$ {cardPrice}</p>
        <div className="row">
          <div className="col-12">{showAddToCard()}</div>
          <div className="col-12">{showRemoveFromCart()}</div>
        </div>
      </div>
    </div>
  );
};

export default Card;
