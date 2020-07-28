import React from 'react';
import { Link } from "react-router-dom";
import Joi from "joi-browser";


import PageHeader from "../common/page-header"
import itemsService from "../../services/items-service"
import Form from "../common/form"
import Item from "./item"
import { yesOption, noOption, hasImageOptions, swappedOptions } from "../../config/definitions"



class MyStuff extends Form {
    allUserItems = [];
    categoryIdToNameArray = [];

    state = {
        data: { title: "", categoryId: "", hasImage: "", swapped: noOption },
        errors: {},
        inSubmitProcess: false,
        categories: [],
        filteredUserItems: [],
    }


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
                (hasImage === yesOption && item.image !== "") || (hasImage === noOption && item.image === "")
            );
        }

        if (swapped) {
            filteredUserItems = filteredUserItems.filter(item =>
                (swapped === yesOption && item.swapped) || (swapped === noOption && !item.swapped)
            );
        }

        this.setState({ filteredUserItems });
    }

    updateItem = (itemId) => {

    }

    deleteItem = (itemId) => {

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
                        {this.renderSelectBox(false, "hasImage", "Image", hasImageOptions, "Image", criteriaClassName, this.state.hasImage)}
                        {this.renderSelectBox(false, "swapped", "Status", swappedOptions, "Status", criteriaClassName, this.state.swapped)}
                    </div>
                    <div className="mt-5">
                        <Link className="btn btn-primary d-none d-lg-inline" to="/add-item">Add New Item</Link>
                    </div>
                </div>
                <div className="container mt-3">
                    <div className="row">
                        {this.state.filteredUserItems.map(item =>
                            <div key={item._id} className="col-lg-4 px-3 py-3">
                                <Item item={item}
                                    categoryName={this.categoryIdToNameArray[item.categoryId]}
                                    showUpdate={true}
                                    showDelete={true}
                                    showUser={false}
                                    showInterestedUsersDetails={true}
                                    showChangeSwapStatus={true}
                                    showInterestedInItemAsLink={false}
                                    onUpdate={() => this.updateItem(item._id)}
                                    onDelete={() => this.deleteItem(item._id)}
                                >
                                </Item>
                            </div>
                        )}
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
            const categories = data.map(category => {
                this.categoryIdToNameArray[category._id] = category.title;

                return { value: category._id, title: category.title }
            });
            this.setState({ categories });
        }
        catch (ex) {
            console.log(ex);
        }

        // Get all user items.
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