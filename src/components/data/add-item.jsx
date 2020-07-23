import React from 'react';
import Joi from "joi-browser";

import Form from "../common/form";
import PageHeader from "../common/page-header";
import InProcessIndicator from "../common/in-process-indicator";
import itemsService from "../../services/items-service"


class AddItem extends Form {
    generalErrorMessage = "There was an error in adding the new item to your stuff, please try again"

    state = {
        data: { title: "", description: "", categoryId: "", image: "" },
        errors: {},
        inSubmitProcess: false,
        categories: [],
    }

    validationSchema = {
        title: Joi.string().required().min(2).max(50).label("Title"),
        description: Joi.string().required().min(5).max(4000).label("Description"),
        categoryId: Joi.string().required().min(1).max(4000).error(() => {
            return {
                message: "Please Choose Category"
            };
        }),
        image: Joi.any()
    }

    submit = async () => {
        const data = { ...this.state.data }
        const errors = { ...this.state.errors }
        delete errors.general;
        this.setState({ errors });

        try {
            await this.setState({ inSubmitProcess: true });
            await itemsService.AddItem(data);
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
        const inputClassName = "";
        itemsService.getCategories();

        return (
            <div className="container">
                <PageHeader title="Add New Item" />
                <form onSubmit={this.handleSubmit} method="Post" className="form-group mt-5" auto-complete="off">
                    <div className="row">
                        <div className="col-lg-3"></div>
                        <div className="col-lg-6 col-12">
                            {this.renderInput(true, "title", "Title", "text", inputClassName, "Item Title")}
                            {this.renderTextarea(true, "description", "Description", "10", "50", inputClassName, "Detailed Description")}
                            {this.renderSelectBox(true, "categoryId", "Category", this.state.categories, "Choose Category...", inputClassName)}
                            <div className="mt-3">{this.state.inSubmitProcess ? <InProcessIndicator /> : this.renderButton("Save")}</div>
                            <div className="text-danger mt-3">{this.state.errors.general}</div>
                        </div>
                        <div className="col-lg-3"></div>
                    </div>
                </form>
            </div>

        );
    }

    async componentDidMount() {
        // Get all categories to show in the select box.
        try {
            const data = await itemsService.getCategories();
            // map the object array to fit select box internal object structure
            const categories = data.map(category => { return { value: category._id, title: category.title } });
            this.setState({ categories });
        }
        catch (ex) {
            console.log(ex);
        }
    }


}

export default AddItem;