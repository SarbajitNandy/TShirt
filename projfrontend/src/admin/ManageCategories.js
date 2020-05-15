import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Base from "../core/Base";
import { getCategories, deleteCategory } from "../admin/helper/adminapicall";
import { isAuthenticated } from "../auth/helper/index";

const ManageCategories = () => {
  const { user, token } = isAuthenticated();
  const [categories, setCategories] = useState("");
  const [error, setError] = useState("");

  const preload = () => {
    getCategories().then((categoryData) => {
      if (categoryData.error) {
        console.log(categoryData.error);
        setError(categoryData.error)
      } else {
        setCategories(categoryData);
        setError("")
      }
    });
  };

  useEffect(() => {
    preload();
  }, []);

  const onDeleteCategory = (categoryId) => {
    deleteCategory(categoryId, user._id, token).then((data) => {
      if (data.error) {
        setError(data.error)
      } else {
        preload();
      }
    });
  };

  const errorMessage = () => {
    return (
      <div className="alert alert-danger text-center" style={{display: error ? "" : "none"}}>
        <h4>{error}</h4>
      </div>
    )
  }

  return (
    <Base title="Welcome admin" description="Manage Categories here">
      <h2 className="mb-4">All Categories:</h2>
      <Link className="btn btn-info" to={`/admin/dashboard`}>
        <span className="">Admin Home</span>
      </Link>
      <div className="row">
        <div className="col-12">
          {errorMessage()}
          <h2 className="text-center text-white my-3">
            Total {categories.length} Categories
          </h2>
          {categories &&
            categories.map((item, index) => (
              <div key={index} className="row text-center mb-2 ">
                <div className="col-4">
                  <h3 className="text-white text-left">{item.name}</h3>
                </div>
                <div className="col-4">
                  <Link
                    className="btn btn-success"
                    to={`/admin/category/update/${item._id}`}
                  >
                    <span className="">Update</span>
                  </Link>
                </div>
                <div className="col-4">
                  <button
                    onClick={() => {
                      onDeleteCategory(item._id);
                    }}
                    className="btn btn-danger"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </Base>
  );
};

export default ManageCategories;
