import React, {useState} from 'react';
import Base from "../core/Base";
import {Link} from "react-router-dom"
import {signup} from '../auth/helper';

const Signup = () => {

    const [values, setValues] = useState({
        name: "",
        email: "",
        password:"",
        error: "",
        success: ""
    })

    const {name, email, password, error, success} = values;

    const handleChange = name => event => {
        setValues({...values, error: false, [name]: event.target.value})
    }

    const onSubmit = event => {
        event.preventDefault()
        // setValues({...values, error: false})
        signup({name, email, password})
        .then(data => {
            console.log(data)
            if (data.error) {
                setValues({...values, error: data.error})
            } else {
                setValues({ 
                    ...values,
                    name: "",
                    email: "",
                    password: "",
                    error: "",
                    success: true
                });
            }
        })
        .catch()
    }

    const signupForm = () => (
        <div className="row">
            <div className="col-md-6 offset-sm-3 text-left">
                <form action="">
                    <div className="form-group">
                        <label className="text-light">Name</label>
                        <input className="form-control" type="text" value={name} onChange={handleChange("name")} />
                    </div>
                    <div className="form-group">
                        <label className="text-light">Email</label>
                        <input className="form-control" type="email" value={email} onChange={handleChange("email")}/>
                    </div>
                    <div className="form-group">
                        <label className="text-light">Password</label>
                        <input className="form-control" type="password" value={password} onChange={handleChange("password")} />
                    </div>
                    <button onClick={onSubmit} className="btn btn-success btn-block">Submit</button>
                </form>
            </div>
        </div>
    )
     
    const successMessage = () => (
      <div className="row">
        <div className="col-md-6 offset-sm-3 text-left">
          <div
            className="alert alert-success"
            style={{ display: success ? "" : "none" }}
          >
            New account created successfully. Please{" "}
            <Link to="/signin">Login Here</Link>
          </div>
        </div>
      </div>
    );

    const errorMessage = () => (
      <div className="row">
        <div className="col-md-6 offset-sm-3 text-left">
          <div
            className="alert alert-danger"
            style={{ display: error ? "" : "none" }}
          >
            {error}
          </div>
        </div>
      </div>
    );

    return (
        <Base title="Signup Page" description="A page for user to signup">
            {successMessage()}
            {errorMessage()}
            {signupForm()}
    <p className="text-white text-center">{JSON.stringify(values)}</p>
        </Base>
    )
}
 
export default Signup;