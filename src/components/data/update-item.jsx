import React from 'react';
import Joi from "joi-browser";
import { toast } from 'react-toastify';
import path from "path";

import Form from "../common/form";
import PageHeader from "../common/page-header";
import InProcessIndicator from "../common/in-process-indicator";
import itemsService from "../../services/items-service"


class UpdateItem extends Form {
    itemId = this.props.match.params.id;
    generalErrorMessage = "There was an error in updating the item, please try again";
    allowedFileTypes = ".gif,.png,.jpeg,.jpg";
    allowedFileTypesToShow = this.allowedFileTypes.split('.').join(' ');
    fileToUpload = null;
    maxFileSize = 10;

    state = {
        data: { title: "", description: "", categoryId: "", swapped: false, image: "" },
        errors: {},
        inSubmitProcess: false,
        categories: [],
        originalItem: null,
    }

    validationSchema = {
        title: Joi.string().required().min(2).max(50).label("Title"),
        description: Joi.string().required().min(5).max(4000).label("Description"),
        categoryId: Joi.string().required().min(1).max(4000).error(() => {
            return {
                message: "Please Choose Category"
            };
        }),
        swapped: Joi.boolean().required(),
        image: Joi.any()
    }


    // called from the parent Form
    additionalInputChangeHandling(input) {
        if (input.type === "file") {
            this.fileToUpload = input.files.length === 0 ? null : input.files[0];
        }
    }


    submit = async () => {
        const data = { ...this.state.data }
        const errors = { ...this.state.errors }
        delete errors.general;
        delete data.image; // image is uploaded on second phase.
        data._id = this.itemId;
        data.numOfInterestedUsers = this.state.originalItem.numOfInterestedUsers;
        this.setState({ errors });

        try {
            await this.setState({ inSubmitProcess: true });

            const fileValidationError = this.validateFile();
            if (fileValidationError) {
                await this.setState({ inSubmitProcess: false });
                this.showFileErrorMessage(fileValidationError);
                return;
            }

            await itemsService.updateItem(data, this.fileToUpload);
            toast.success(`The "${this.state.originalItem.title}" item was updated successfully`);
            this.props.history.goBack();

        }
        catch (ex) {
            console.log(ex);
            await this.setState({ inSubmitProcess: false });
            if (ex.response?.data?.error) {
                this.handleServerErrors(ex.response.data.error);
                return;
            }
            this.showGeneralErrorMessage();
            return;
        }
    }



    validateFile() {
        if (!this.fileToUpload) return "";
        const fileType = path.extname(this.fileToUpload.name).toLowerCase();
        if (!this.allowedFileTypes.includes(fileType)) {
            return "Unsupported File Format";
        }
        if (this.fileToUpload.size > this.maxFileSize * 1048576) {
            return "File size is too big";
        }
        return "";
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


    showFileErrorMessage(message) {
        const errors = { ...this.state.errors }
        errors.image = message;
        this.setState({ errors })
    }





    render() {
        const inputClassName = "";

        return (
            <React.Fragment>
                {this.state.originalItem && <div className="container">
                    <PageHeader title={`Update ${this.state.originalItem ? this.state.originalItem.title : ''} Item`} />
                    <form onSubmit={this.handleSubmit} method="Post" className="form-group mt-5" auto-complete="off">
                        <div className="row">
                            <div className="col-lg-3"></div>
                            <div className="col-lg-6 col-12">
                                {this.renderInput(true, "title", "Title", "text", inputClassName, "Item Title")}
                                {this.renderTextarea(true, "description", "Description", "10", "50", inputClassName, "Detailed Description")}
                                {this.renderSelectBox(true, "categoryId", "Category", this.state.categories, "Choose Category...", inputClassName, this.state.categoryId)}
                                {this.renderCheckBox("swapped", "Swapped ?", inputClassName, this.state.categoryId)}
                                <br />
                                {this.renderFileUpload(false, "image", `Upload Item Image (Up to ${this.maxFileSize}MB in ${this.allowedFileTypesToShow} formats)`, this.allowedFileTypes, inputClassName)}
                                <div className="mt-3">
                                    {this.state.inSubmitProcess ? <InProcessIndicator /> : this.renderButton("Save")}
                                    <span className="ml-3"></span>
                                    {this.state.inSubmitProcess ? "" : this.renderCancelButton("Cancel")}
                                </div>
                                <div className="text-danger mt-3">{this.state.errors.general}</div>
                            </div>
                            <div className="col-lg-3"></div>
                        </div>
                    </form>
                </div>}

                {!this.state.originalItem &&
                    <div className="container text-center">
                        <InProcessIndicator />
                    </div>
                }
            </React.Fragment>

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

        // Get item
        try {
            const originalItem = await itemsService.getItem(this.itemId);
            await this.setState({ originalItem });
            const data = { title: originalItem.title, description: originalItem.description, categoryId: originalItem.categoryId, swapped: originalItem.swapped, image: "" };
            await this.setState({ data });
        }
        catch (ex) {
            console.log(ex);
        }
    }

}

export default UpdateItem;