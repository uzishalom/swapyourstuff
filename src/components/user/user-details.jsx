import React from 'react';
import Joi from "joi-browser"
import { toast } from "react-toastify";

import PageHeader from "../common/page-header"
import InProcessIndicator from "../common/in-process-indicator"
import Form from "../common/form"
import userService from "../../services/user-service"


class UserDetails extends Form {

    generalErrorMessage = "There was an error in updating your details, please try again"

    state = {
        data: { name: "", email: "", password: "", city: "", phone: "" },
        errors: {},
        inSubmitProcess: false,
    }

    validationSchema = {
        name: Joi.string().required().min(4).max(25).label("Name"),
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

        try {
            await this.setState({ inSubmitProcess: true });
            await userService.updateUser(data);
            toast.success("Your details were updated successfully");
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
        const inputClassName = "col-lg-6 col-12 ";
        const { data } = this.state;

        return (
            <div className="container">
                <PageHeader title="My Details" description="" />
                <h4 className="text-center text-info mt-5">{data.email}</h4>
                <form onSubmit={this.handleSubmit} method="Post" className="form-group mt-5" auto-complete="off">
                    <div className="row">
                        {this.renderInput(true, "name", "Name", "text", inputClassName, "Your Name")}
                        {this.renderInput(true, "city", "City", "text", inputClassName, "City")}
                        {this.renderInput(false, "phone", "Phone (optional)", "text", inputClassName, "Phone Number")}
                    </div>
                    <div>{this.state.inSubmitProcess ? <InProcessIndicator /> : this.renderButton("Save")}</div>
                    <div className="text-danger mt-3">{this.state.errors.general}</div>
                </form>
            </div>

        );
    }

    async componentDidMount() {
        try {
            const data = await userService.getUserDetails();
            this.setState({ data })
        }
        catch (ex) {
            console.log(ex);
        }


    }
}

export default UserDetails;