import React, { useState } from "react";
import { Link } from "react-router-dom";
import Base from "../core/Base";
import { isAuthenticated } from "../auth/helper/index";
import { createCategory } from "./helper/adminapicall";

const AddCategory = () => {
  const { user, token } = isAuthenticated();

  const [name, setName] = useState("");
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const goBack = () => (
    <div className="mt-5">
      <Link className="btn btn-sm btn-success mb-3" to="/admin/dashboard">
        go back
      </Link>
    </div>
  );

  const handleChange = (event) => {
    setError(false);
    setName(event.target.value);
  };

  const onSubmitForm = (event) => {
    event.preventDefault()
    setError(false);
    setSuccess(false);

    createCategory(user._id, token, { name })
    .then( data => {
      if (data.error) {
        setError(true)
      } else {
        setError(false);
        setSuccess(true)
        setName("")
      }
      
    })
  };

  const successMessage = () => {
    if (success) {
      return <h4 className="text-success">Category created successfully</h4>;
    }
  }
  
  const errorMessage = () => {
    if (error) {
      return <h4 className="text-dange">Category creation failed</h4>;
    }
  }
  
  const myCategoryForm = () => {
    return (
      <form>
        <div className="form-group">
          <p className="lead">Enter the category here</p>
          <input
            type="text"
            className="form-control my-3"
            autoFocus
            required
            onChange={handleChange}
            placeholder="For Ex. Summer"
          />
          <button onClick={onSubmitForm} className="btn btn-outline-info">
            Create Category
          </button>
    <p className="text-dark">{JSON.stringify(name)}</p>
        </div>
      </form>
    );
  };

  return (
    <Base
      title="Create a category here"
      description="Add a new Category for new TShirt"
      className="container bg-info p-4"
    >
      <div className="row bg-white rounded">
        <div className="col-md-8 offset-md-2">
          {successMessage()} {errorMessage()}
          {myCategoryForm()} {goBack()}
        </div>
      </div>
    </Base>
  );
};

export default AddCategory;
