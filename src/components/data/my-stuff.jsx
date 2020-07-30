import React from 'react';
import { Link } from "react-router-dom";
import Joi from "joi-browser";

import PageHeader from "../common/page-header"
import itemsService from "../../services/items-service"
// import userService from "../../services/user-service" YYYYYYYYYY
import Form from "../common/form"
import InProcessIndicator from "../common/in-process-indicator";
import Item from "./item"
import { yesOption, noOption, hasImageOptions, swappedOptions } from "../../config/definitions"



class MyStuff extends Form {
    allUserItems = [];
    categoryIdToNameArray = [];
    // selectedItems = [] // YYYYYYYY

    state = {
        data: { title: "", categoryId: "", hasImage: "", swapped: noOption },
        errors: {},
        inSubmitProcess: false,
        categories: [],
        filteredUserItems: [],
        inLoadingProcess: true,
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


    // YYYYYYYYYY
    /*
    changeItemSelection = (itemId) => {
        const indexToRemove = this.selectedItems.indexOf(itemId);
        if (indexToRemove > -1) {
            this.selectedItems.splice(indexToRemove, 1);
        }
        else {
            this.selectedItems.push(itemId);
        }

    }
    */

    /*


    // YYYYYYYYYY
    showUserDetails = async (userId) => {
        userService.showUserDetailsPopup(userId);
    }

    */

    changeSwapStatus = async (item) => {
        try {
            item.swapped = !item.swapped;
            await itemsService.updateItem(item, null);
            this.filterData();
        }
        catch (ex) {
            console.log(ex);
        }
    }


    addToInterestingItems = (itemId) => {

        console.log("show warning that the details will be exposed");


    }

    removeFromInterestingItems = (itemId) => {

        console.log("not show");


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
                    {!this.state.inLoadingProcess && this.state.filteredUserItems.length > 0 && <div className="row">
                        {this.state.filteredUserItems.map(item =>
                            <div key={item._id} className="col-lg-4 px-3 py-3">
                                <Item item={item}
                                    //showItemSelection={false}  // YYYYYYYYYY
                                    //onItemSelectionChanged={() => this.changeItemSelection(item._id)}  // YYYYYYYYYY

                                    //showUser={false} // YYYYYYYYYY
                                    //onShowUserDetails={() => this.showUserDetails(item.userId)}  // YYYYYYYYYY

                                    categoryName={this.categoryIdToNameArray[item.categoryId]}

                                    showChangeSwapStatus={true}
                                    onChangeSwapStatus={() => this.changeSwapStatus(item)}

                                    showInterestedUsersAsLink={true}

                                    showAddToInterestingItems={true}
                                    showRemoveFromInterestingItems={true}
                                    onAddToInterestingItems={() => this.addToInterestingItems(item._id)}
                                    onRemoveFromInterestingItems={() => this.removeFromInterestingItems(item._id)}

                                    showUpdate={true}
                                    onUpdate={() => this.updateItem(item._id)}

                                    showDelete={true}
                                    onDelete={() => this.deleteItem(item._id)}
                                >
                                </Item>
                            </div>
                        )}
                    </div>}
                    {!this.state.inLoadingProcess && this.state.filteredUserItems.length === 0 &&
                        <div className="text-center mt-5 text-info"><h3>No Items Found</h3></div>
                    }
                    {this.state.inLoadingProcess &&
                        <div className="text-center mt-5 text-info"><h3><InProcessIndicator /></h3></div>
                    }

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

        this.setState({ inLoadingProcess: false })
    }

}

export default MyStuff;