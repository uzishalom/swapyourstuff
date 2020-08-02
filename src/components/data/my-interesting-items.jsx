import React from 'react';
import Joi from "joi-browser";
import Swal from 'sweetalert2'
import { toast } from 'react-toastify';

import PageHeader from "../common/page-header"
import itemsService from "../../services/items-service"
import Form from "../common/form"
import InProcessIndicator from "../common/in-process-indicator";
import Item from "./item"
import { yesOption, noOption, hasImageOptions } from "../../config/definitions"


class MyInterestingItems extends Form {

    allUserInterestingItems = [];
    categoryIdToNameArray = [];

    state = {
        data: { title: "", categoryId: "", hasImage: "" },
        errors: {},
        inSubmitProcess: false,
        categories: [],
        filteredUserItems: [],
        inLoadingProcess: true,
        selectedItems: [],
    }


    validationSchema = {
        title: Joi.string().allow(""),
        categoryId: Joi.string().allow(""),
        hasImage: Joi.string().allow(""),
    }

    additionalInputChangeHandling(input) {
        this.filterData();
    }


    filterData = async () => {
        const { title, categoryId, hasImage } = { ...this.state.data };
        let filteredUserItems = [...this.allUserInterestingItems];

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

        this.setState({ filteredUserItems });
    }


    removeInterestingItems = async (itemId) => {

        let userConfirmed = false;
        await Swal.fire({
            icon: 'warning',
            title: 'Not Interested Anymore ?',
            html: "The selected item/s will no longer be in your interesting list",
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, remove them!',
            cancelButtonText: 'No, Keep them'
        }).then((result) => {
            userConfirmed = result.isConfirmed;
        }).catch((error) => {
            console.log(error);
        });

        if (!userConfirmed) return;

        let itemIds = itemId === 0 ? [...this.state.selectedItems] : [itemId];

        // Update Display
        this.allUserInterestingItems = this.allUserInterestingItems.filter(item => !itemIds.includes(item._id));
        this.filterData();
        await this.setState({ selectedItems: [] })


        //Update DB
        try {
            await itemsService.deleteInterestingItems(itemIds);
            toast.success("The selected items were removed from your interesting items list.");
        }
        catch (ex) {
            console.log(ex);
            toast.error("There was an error , please try again");
        }
    }

    changeItemSelection = async (itemId) => {
        let selectedItems = [...this.state.selectedItems];
        const indexToRemove = selectedItems.indexOf(itemId);
        if (indexToRemove > -1) {
            selectedItems.splice(indexToRemove, 1);
        }
        else {
            selectedItems.push(itemId);
        }
        await this.setState({ selectedItems });

    }


    render() {
        const criteriaClassName = "col-lg-3";

        return (
            <React.Fragment>
                <PageHeader title="My Interesting Items" />
                <div className="container mt-3">
                    <div className="mt-3 text-success text-lg-center">
                        The following list contains other users items that you are interested in.
                    <br />
                    These users can see your personal details and which items you suggested to swap with them.
                    <br />
                    If by any reason you are not interested anymore in some of the items, please select them and press the button below.
                    </div>

                    <div className="row mt-5">
                        {this.renderInput(false, "title", "Search By Title", "text", criteriaClassName, "Search By Title")}
                        {this.renderSelectBox(false, "categoryId", "Category", this.state.categories, "Serach By  Category", criteriaClassName, this.state.categoryId)}
                        {this.renderSelectBox(false, "hasImage", "Image", hasImageOptions, "Image", criteriaClassName, this.state.hasImage)}
                    </div>

                    {this.state.filteredUserItems.length > 0 && <div className="mt-5">
                        {this.state.inSubmitProcess ? <InProcessIndicator /> : <React.Fragment>
                            <button className="btn btn-primary mb-0" disabled={this.state.selectedItems.length === 0} onClick={() => { this.removeInterestingItems() }}>Remove From List</button>
                        </React.Fragment>}
                    </div>}

                </div>
                <div className="container mt-3">
                    {!this.state.inLoadingProcess && this.state.filteredUserItems.length > 0 && <div className="row">
                        {this.state.filteredUserItems.map(item =>
                            <div key={item._id} className="col-lg-4 px-3 py-3">
                                <Item item={item}
                                    showItemSelection={true}
                                    onItemSelectionChanged={() => this.changeItemSelection(item._id)}
                                    checked={this.state.selectedItems.includes(item._id)}

                                    showRemoveFromInterestingItems={true}
                                    onRemoveFromInterestingItems={() => this.removeInterestingItems(item._id)}

                                    categoryName={this.categoryIdToNameArray[item.categoryId]}
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

        // Get all user interesting items.
        try {
            this.allUserInterestingItems = await itemsService.getUserInterestingItems();
            this.filterData();
        }
        catch (ex) {
            console.log(ex);
        }

        this.setState({ inLoadingProcess: false })
    }

}

export default MyInterestingItems;