import React from 'react';
import Joi from "joi-browser"

import PageHeader from "../common/page-header"
import InProcessIndicator from "../common/in-process-indicator"
import Form from "../common/form"
import userService from "../../services/user-service"


class Signup extends Form {

    generalErrorMessage = "There was an error in the signup process, please try again"

    state = {
        data: { name: "", email: "", password: "", city: "", phone: "" },
        errors: {},
        inSubmitProcess: false
    }

    validationSchema = {
        name: Joi.string().required().min(4).max(25).label("Name"),
        email: Joi.string().required().email().label("Email"),
        password: Joi.string().required().min(6).max(10).label("Password"),
        city: Joi.string().required().label("City"),
        phone: Joi.string().min(9).max(10).regex(/^0[2-9]\d{7,8}$/).allow("").error(() => {
            return {
                message: "Phone must be between 9-10 digits and starting with 0"
            };
        }),
    }


    submit = async () => {
        const data = { ...this.state.data }
        const errors = { ...this.state.errors }
        delete errors.general;
        this.setState({ errors });

        // signup
        try {
            await this.setState({ inSubmitProcess: true });
            await userService.signup(data);
        }
        catch (ex) {
            await this.setState({ inSubmitProcess: false });

            if (ex.response?.data?.error) {
                this.handleSignupServerErrors(ex.response.data.error);
            }
            this.showGeneralErrorMessage();

            return;
        }

        // login after successful signup
        const { email, password } = data;
        try {
            await userService.signin({ email, password });
            window.location = "/";
        }
        catch (ex) {
            // if the auto-signin didn't work then we will send the user to make manual signin
            this.props.history.replace("/signin");
        }
    }



    handleSignupServerErrors(errorData) {
        const errors = { ...this.state.errors }

        if (errorData && typeof (errorData) === "string" && errorData === "EMAIL_EXIST") {
            errors.email = "The Email allready exists";
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
                <PageHeader title="Signup" />
                <form onSubmit={this.handleSubmit} method="Post" className="form-group mt-5" auto-complete="off">
                    <div className="row">
                        {this.renderInput(true, "name", "Name", "text", "Your Name")}
                        {this.renderInput(true, "email", "Email", "email", "Your Email")}
                        {this.renderInput(true, "password", "Password", "password", "Password")}
                        {this.renderInput(true, "city", "City", "text", "City")}
                        {this.renderInput(false, "phone", "Phone (optional)", "text", "Phone Number")}
                    </div>
                    <div>{this.state.inSubmitProcess ? <InProcessIndicator /> : this.renderButton("Signup")}</div>
                    <div className="text-danger mt-3">{this.state.errors.general}</div>
                </form>
            </div>

        );
    }
}

export default Signup;