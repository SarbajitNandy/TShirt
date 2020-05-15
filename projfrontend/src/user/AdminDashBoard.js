import React from 'react';
import {Link} from "react-router-dom"
import Base from "../core/Base";
import { isAuthenticated } from '../auth/helper';

const AdminDashBoard = () => {

    const {name, email} = isAuthenticated().user;

    const adminLeftSide = () => {
        return (
            <div className="card">
                <h4 className="card-header text-white bg-dark">Admin Navigation</h4>
                <ul className="list-group">
                    <li className="list-group-item">
                        <Link to="/admin/create/category" className="nav-link text-success">Create Category</Link>
                    </li>
                    <li className="list-group-item">
                        <Link to="/admin/categories" className="nav-link text-success">Manage Category</Link>
                    </li>
                    <li className="list-group-item">
                        <Link to="/admin/create/product" className="nav-link text-success">Create Product</Link>
                    </li>
                    <li className="list-group-item">
                        <Link to="/admin/products" className="nav-link text-success">Manage Product</Link>
                    </li>
                    <li className="list-group-item">
                        <Link to="/admin/categories" className="nav-link text-success">Manage Orders</Link>
                    </li>
                </ul>
            </div>
        )
    }

    const adminRightSide = () => {
        return (
            <div className="card">
                <h4 className="card-header">Admin Information</h4>
                <ul className="list-group">
                    <li className="list-group-item">
                        <span className="badge badge-success">Name: </span> {name}    
                    </li>  
                    <li className="list-group-item">
                        <span className="badge badge-success">Email: </span> {email}    
                    </li> 
                    <li className="list-group-item">
                        <span className="badge badge-danger">Admin Area </span>    
                    </li> 
                </ul>
            </div>
        )
    }

    return (
      <Base
        title="AdminDashBoard Page"
        description="Your AdminDashBoard goes here"
        className="container bg-success p-4"
      >
        <div className="row">
          <div className="col-3">{adminLeftSide()}</div>
          <div className="col-9">{adminRightSide()}</div>
        </div>
      </Base>
    );
}
 
export default AdminDashBoard;
