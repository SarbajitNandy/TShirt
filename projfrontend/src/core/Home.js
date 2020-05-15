import React, {useState, useEffect} from "react";
import { API } from "../backend";
import Base from "./Base";
import Card from "./Card";
import {getAllProducts} from "../core/helper/coreapicalls"

const Home = () => {
  console.log(API);

    const [products, setProducts] = useState([])
    const [error, setError] = useState("")

    const preload = () => {
        getAllProducts()
        .then( data => {
            if (data.error) {
                setError(data.error)
            } else {
                console.log(data)
                setProducts(data)
            }
        })
    }

    useEffect(()=>{
        preload();
    },[])

    const loadProductAsCard = () => {
        return products.map((product, index) => (
          <div className="col-4" key={index}>
            <Card product={product} />
          </div>
        ));
    }

  return (
    <Base title="Home Page" description="Welcome to the tshirt store">
      <div className="row text-center">
        {loadProductAsCard()}
      </div>
    </Base>
  );
};

export default Home;
