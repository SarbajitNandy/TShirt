import React, {useState, useEffect} from 'react';
import {Link} from "react-router-dom"
import Base from "../core/Base";
import { isAuthenticated} from "../auth/helper/index"
import {getProduct, updateProduct, getCategories} from "../admin/helper/adminapicall"

const UpdateProduct = ({match}) => {

    const [values, setValues] = useState({
        name:"",
        description:"",
        price: "",
        stock: "",
        categories: [],
        category: "",
        loading: false,
        error: "",
        createdProduct: "",
        getRedirect: false,
        // formData : new FormData()
    })

    const {
      name,
      description,
      price,
      stock,
      categories,
      category,
      loading,
      error,
      createdProduct,
      getRedirect,
      // formData
    } = values;

    const {user, token} = isAuthenticated();

    const preload = (productId) => {
      getProduct(productId).then((productData) => {
        console.log(productData);
        if (productData.error) {
          setValues({ ...values, error: productData.error });
        } else {
          getCategories()
            .then((categories) => {
              console.log(categories);
              if (categories.error) {
                setValues({ ...values, error: categories.error });
              } else {
                setValues({
                  ...values,
                  name: productData.name,
                  description: productData.description,
                  price: productData.price,
                  stock: productData.stock,
                  category: productData.category._id,
                  categories: categories,
                  // formData: new FormData(),
                });
                
                console.log("CATE:", categories);
              }
            });
        }
      });
    };

    useEffect( () => {
        preload(match.params.productId);
    }, [])

    const onSubmit = (event) => {
        event.preventDefault();
        setValues({...values, error: "", loading: true, createdProduct: ""})

        // create a form with the existing data, then use that for submitting
        let formData = new FormData()

        formData.set("name", name)
        formData.set("description", description)
        formData.set("price", price)
        formData.set("stock", stock)
        formData.set("category", category)

        updateProduct(match.params.productId, user._id, token, formData)
        .then( data => {
          console.log(data)
          if (data.error) {
            setValues({...values, error: data.error, loading: false})
          } else {
            setValues({
              ...values,
              error: "",
              loading: false,
              name: "",
              description: "",
              price: "",
              stock: "",
              createdProduct: data.name
            });
          }
        })
    }
     
    const handleChange = name => event => {
      const value = name==="photo" ? event.target.files[0] : event.target.value;
      // formData.set(name, value)
      setValues({...values, [name]: value})
    }

    const successMessage = () => (
      <div className="alert alert-success mt-3" style={{display: createdProduct ? "": "none"}}>
        { createdProduct } updation successful
      </div>
    )
    
    const errorMessage = () => (
      <div className="alert alert-danger mt-3" style={{display: error ? "": "none"}}>
        { createdProduct } updation failed
      </div>
    )
    const loaderMessage = () => (
      <div className="alert alert-info mt-3" style={{display: loading ? "": "none"}}>
        Loading...
      </div>
    )

    const createProductForm = () => (
        <form >
          <span>Post photo</span>
          <div className="form-group">
            <label className="btn btn-block btn-success">
              <input
                onChange={handleChange("photo")}
                type="file"
                name="photo"
                accept="image"
                placeholder="choose a file"
              />
            </label>
          </div>
          <div className="form-group">
            <input
              onChange={handleChange("name")}
              name="photo"
              className="form-control"
              placeholder="Name"
              value={name}
            />
          </div>
          <div className="form-group">
            <textarea
              onChange={handleChange("description")}
              name="photo"
              className="form-control"
              placeholder="Description"
              value={description}
            />
          </div>
          <div className="form-group">
            <input
              onChange={handleChange("price")}
              type="number"
              className="form-control"
              placeholder="Price"
              value={price}
            />
          </div>
          <div className="form-group">
            <select
              onChange={handleChange("category")}
              className="form-control"
              placeholder="Category"
            >
              <option>Select</option>
              {categories && 
                categories.map( (item,index) => (
                <option key={index} value={item._id}>{item.name}</option>
                ))
              }
            </select>
          </div>
          <div className="form-group">
            <input
              onChange={handleChange("stock")}
              type="number"
              className="form-control"
              placeholder="Quantity"
              value={stock}
            />
          </div>
          
          <button type="submit" onClick={onSubmit} className="btn btn-outline-success mb-2">
            Update Product
          </button>
        </form>
      );

    return ( 
        <Base
        title="Update a product here"
        description="Welcome to the product updation section"
        className="container bg-info p-4"
        >
            <Link to="/admin/dashboard" className="btn btn-md btn-dark mb-3" >Admin Home</Link>
            <div className="row bg-dark text-white rounded">
                <div className="col-md-8 offset-md-2">
                    {successMessage()}
                    {errorMessage()}
                    {loaderMessage()}
                    {createProductForm()}
                </div>
                <p>{JSON.stringify(values)}</p>
            </div>
        </Base>
     );
}
 
export default UpdateProduct;