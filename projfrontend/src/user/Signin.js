import React, {useState} from 'react';
import Base from "../core/Base";
import {Link, Redirect} from "react-router-dom"

import {signin, authenticate, isAuthenticated} from "../auth/helper/index"

const Signin = () => {

    const [values, setValues] = useState({
        email: "",
        password: "",
        error: "",
        loading: false,
        didRedirect: false
    })

    const {email, password, error, loading, didRedirect} = values;
    const {user} = isAuthenticated();

    const handleChange = name => event => {
        setValues({...values, error: false, [name]: event.target.value})
    }

    const performRedirect = () => {
        if (didRedirect) {
            if (user && user.role===1) {
                return ( <Redirect to="/admin/dashboard" /> )
            }else {
                return ( <Redirect to="/user/dashboard" /> )
            }
        }

    }

    const onSubmit = event => {
        event.preventDefault()
        setValues({...values, error: false, loading: true})
        signin({email, password})
        .then(data => {
            console.log(data)
            if (data.error) {
                setValues({...values, error: data.error, loading:false})
            } else {
                authenticate(data, () => {
                    setValues({ 
                        ...values,
                        email: "",
                        password: "",
                        error: "",
                        loading: false,
                        didRedirect: true
                    }); 
                })
            }
        })
        .catch((err)=> {console.log(err)})
    }


    const loadingMessage = () => (
        <div className="row">
          <div className="col-md-6 offset-sm-3 text-left">
            <div
              className="alert alert-info"
              style={{ display: loading ? "" : "none" }}
            >
              Loading...
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

    const signinForm = () => (
        <div className="row">
            <div className="col-md-6 offset-sm-3 text-left">
                <form action="">
                    <div className="form-group">
                        <label className="text-light">Email</label>
                        <input onChange={handleChange("email")} value={email} className="form-control" type="email"/>
                    </div>
                    <div className="form-group">
                        <label className="text-light">Password</label>
                        <input onChange={handleChange("password")} value={password} className="form-control" type="password"/>
                    </div>
                    <button onClick={onSubmit} className="btn btn-success btn-block">Submit</button>
                </form>
            </div>
        </div>
    )




    return (
        <Base title="Signin Page" description="A page for user to signin">
            {loadingMessage()}
            {errorMessage()}
            {signinForm()}
            <p className="text-white text-center">{JSON.stringify(values)}</p>
            {performRedirect()}
        </Base>
    )
}
 
export default Signin;