import React from 'react';
import Joi from "joi-browser"

import PageHeader from "../common/page-header"
import Form from "../common/form"

class Signup extends Form {
    state = {
        data: { name: "", email: "", password: "", city: "", phone: "" },
        errors: {}
    }

    validationSchema = {
        name: Joi.string().required().min(4).max(25).label("Name"),
        email: Joi.string().required().email().label("Email"),
        password: Joi.string().required().min(6).max(10).label("Password"),
        city: Joi.string().required().label("City"),
        phone: Joi.any()
    }

    submit() {
        console.log("DO SUBMIt")
    }



    render() {
        return (
            <div className="container">
                <PageHeader title="sign up man :)" />
                <form onSubmit={this.handleSubmit} method="Post" className="form-group mt-5" auto-complete="off">
                    <div className="row">
                        {this.renderInput(true, "name", "Name", "text", "Your Name")}
                        {this.renderInput(true, "email", "Email", "email", "Your Email")}
                        {this.renderInput(true, "password", "Password", "password", "Password")}
                        {this.renderInput(true, "city", "City", "text", "City")}
                        {this.renderInput(false, "phone", "Phone (optional)", "text", "Phone Number")}
                    </div>
                    {this.renderButton("Signup")}
                </form>
            </div>

        );
    }
}

export default Signup;