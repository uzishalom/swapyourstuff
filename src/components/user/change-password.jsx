import React from 'react';
import Joi from "joi-browser"
import { toast } from "react-toastify";

import PageHeader from "../common/page-header"
import InProcessIndicator from "../common/in-process-indicator"
import Form from "../common/form"
import userService from "../../services/user-service"


class ChangePassword extends Form {

    generalErrorMessage = "There was an error in changing your password, please try again"

    state = {
        data: { name: "", email: "", password: "", city: "", phone: "" },
        errors: {},
        inSubmitProcess: false,
    }

    validationSchema = {
        password: Joi.string().required().min(6).max(10).label("Password"),
    }


    submit = async () => {
        const data = { ...this.state.data }
        const errors = { ...this.state.errors }
        delete errors.general;
        this.setState({ errors });

        try {
            await this.setState({ inSubmitProcess: true });
            await userService.changePassword(data);
            toast.success("Your password was updated successfully");
            this.props.history.replace("/")
        }
        catch (ex) {
            await this.setState({ inSubmitProcess: false });

            if (ex.response?.data?.error) {
                this.handleServerErrors(ex.response.data.error);
            }
            this.showGeneralErrorMessage();

            return;
        }
    }



    handleServerErrors(errorData) {
        const errors = { ...this.state.errors }

        if (errorData && Array.isArray(errorData) && errorData.length > 0 && errorData[0].message) {
            errors.general = errorData[0].message // invalid input
            this.setState({ errors })
            return;
        }

        this.showGeneralErrorMessage();

    }

    render() {
        const inputClassName = "col-12 ";
        const { data } = this.state;

        return (
            <div className="container">
                <PageHeader title="Change Your Password" description="" />
                <h4 className="text-center text-info mt-5">{data.email}</h4>
                <div className="row">
                    <div className="col-lg-3"></div>
                    <div className="col-lg-6">
                        <form onSubmit={this.handleSubmit} method="Post" className="form-group mt-5" auto-complete="off">
                            <div className="row">
                                {this.renderInput(true, "password", "New Password", "password", inputClassName, "New Password")}
                            </div>
                            <div>{this.state.inSubmitProcess ? <InProcessIndicator /> : this.renderButton("Save")}</div>
                            <div className="text-danger mt-3">{this.state.errors.general}</div>
                        </form>
                    </div>
                    <div className="col-lg-3"></div>
                </div>
            </div>

        );
    }

    async componentDidMount() {
        try {
            const data = await userService.getUserDetails();
            data.password = "";
            this.setState({ data })
        }
        catch (ex) {
            console.log(ex);
        }


    }
}

export default ChangePassword;