import React from 'react';
import Joi from "joi-browser"

import PageHeader from "../common/page-header"
import InProcessIndicator from "../common/in-process-indicator"

import Form from "../common/form"
import userService from "../../services/user-service"


class Signin extends Form {

    generalErrorMessage = "There was an error in the signin process, please try again"

    state = {
        data: { email: "", password: "" },
        errors: {},
        inSubmitProcess: false
    }

    validationSchema = {
        email: Joi.string().required().email().label("Email"),
        password: Joi.string().required().min(6).max(10).label("Password"),
    }

    submit = async () => {
        const data = { ...this.state.data }
        const errors = { ...this.state.errors }
        delete errors.general;
        this.setState({ errors });

        // signin
        const { email, password } = data;
        try {
            await this.setState({ inSubmitProcess: true });
            await userService.signin({ email, password });
            window.location = "/";
        }
        catch (ex) {
            await this.setState({ inSubmitProcess: false });

            if (ex.response?.data?.error) {
                this.handleSigninServerErrors(ex.response.data.error);
                return
            }
            this.showGeneralErrorMessage();
        }
    }



    handleSigninServerErrors(errorData) {
        const errors = { ...this.state.errors }

        if (errorData && typeof (errorData) === "string" && (errorData === "NO_USER" || errorData === "WRONG_PASSWORD")) {
            errors.general = "Incorrect Email and/or Password"
            this.setState({ errors })
            return;
        }

        if (errorData && Array.isArray(errorData) && errorData.length > 0 && errorData[0].message) {
            errors.general = errorData[0].message // invalid input
            this.setState({ errors })
            return;
        }

        this.showGeneralErrorMessage();
    }


    render() {
        return (
            <div className="container">
                <PageHeader title="Signin" />
                <form onSubmit={this.handleSubmit} method="Post" className="form-group mt-5" auto-complete="off">
                    <div className="row">
                        {this.renderInput(true, "email", "Email", "email", "Your Email")}
                        {this.renderInput(true, "password", "Password", "password", "Password")}
                    </div>
                    <div>{this.state.inSubmitProcess ? <InProcessIndicator /> : this.renderButton("Login")}</div>
                    <div className="text-danger mt-3">{this.state.errors.general}</div>
                </form>
            </div>

        );
    }

}

export default Signin;