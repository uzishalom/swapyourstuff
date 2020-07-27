import React from 'react';
import { Link } from "react-router-dom";
import Joi from "joi-browser";


import PageHeader from "../common/page-header"
import itemsService from "../../services/items-service"
import Form from "../common/form"



class MyStuff extends Form {
    allUserItems = [];

    yesOption = "Yes";
    noOption = "No";

    state = {
        data: { title: "", categoryId: "", hasImage: "", swapped: this.noOption },
        errors: {},
        inSubmitProcess: false,
        categories: [],
        filteredUserItems: [],
    }

    hasImageOptions = [
        { value: this.yesOption, title: "Has Image" },
        { value: this.noOption, title: "Without Image" },
    ];

    swappedOptions = [
        { value: this.noOption, title: "Not Swappeed Yet" },
        { value: this.yesOption, title: "Allready Swapped" },
    ];


    validationSchema = {
        title: Joi.string().allow(""),
        categoryId: Joi.string().allow(""),
        hasImage: Joi.string().allow(""),
        swapped: Joi.string().allow(""),
    }

    additionalInputChangeHandling(input) {
        this.filterData();
    }


    filterData = () => {
        if (this.allUserItems.length === 0) return;
        const { title, categoryId, hasImage, swapped } = { ...this.state.data };
        let filteredUserItems = [...this.allUserItems];

        if (title) {
            filteredUserItems = filteredUserItems.filter(item => item.title.toLowerCase().includes(title.toLowerCase()));
        }

        if (categoryId) {
            filteredUserItems = filteredUserItems.filter(item => item.categoryId === categoryId);
        }

        if (hasImage) {
            filteredUserItems = filteredUserItems.filter(item =>
                (hasImage === this.yesOption && item.image !== "") || (hasImage === this.noOption && item.image === "")
            );
        }

        if (swapped) {
            filteredUserItems = filteredUserItems.filter(item =>
                (swapped === this.yesOption && item.swapped) || (swapped === this.noOption && !item.swapped)
            );
        }

        this.setState({ filteredUserItems });
    }


    render() {
        const criteriaClassName = "col-lg-3";
        itemsService.getCategories();
        return (
            <React.Fragment>
                <PageHeader title="My Stuff" />
                <div className="container">
                    <Link className={"btn btn-primary my-2 d-lg-none d--block"} to="/add-item">Add New Item</Link>
                    <div className="row">
                        {this.renderInput(false, "title", "Search By Title", "text", criteriaClassName, "Search By Title")}
                        {this.renderSelectBox(false, "categoryId", "Category", this.state.categories, "Serach By  Category", criteriaClassName, this.state.categoryId)}
                        {this.renderSelectBox(false, "hasImage", "Image", this.hasImageOptions, "Image", criteriaClassName, this.state.hasImage)}
                        {this.renderSelectBox(false, "swapped", "Status", this.swappedOptions, "Status", criteriaClassName, this.state.swapped)}
                    </div>
                    <div className="mt-5">
                        <Link className="btn btn-primary d-none d-lg-inline" to="/add-item">Add New Item</Link>
                    </div>
                </div>





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

        // Get all user items
        try {
            this.allUserItems = await itemsService.getUserItems();
            this.filterData();
        }
        catch (ex) {
            console.log(ex);
        }
    }

}

export default MyStuff;