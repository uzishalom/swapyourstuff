import React from 'react';
import Joi from "joi-browser";

import PageHeader from "../common/page-header"
import itemsService from "../../services/items-service"
import Form from "../common/form"
import InProcessIndicator from "../common/in-process-indicator";
import Item from "./item"
import { yesOption, noOption, hasImageOptions } from "../../config/definitions"


class Search extends Form {

    allItemsToSearchBy = [];
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


    filterData = () => {
        if (this.allItemsToSearchBy.length === 0) return;
        const { title, categoryId, hasImage } = { ...this.state.data };
        let filteredUserItems = [...this.allItemsToSearchBy];

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


    addInterestingItems = async () => {
        const selectedItems = [...this.state.selectedItems];
        const itemIdsToSend = selectedItems.join("-");
        this.props.history.push(`/swap-candidates/${itemIdsToSend}`);
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
                <PageHeader title="Search For Interesting Items" />
                <div className="container mt-3">
                    <div className="mt-3 text-success text-lg-center">
                        Please select items that you are interested to get and press the button below to add them to your interesting items list.
                    <br />
                    Please note that after selecting, you will need to choose which items you are willing to give in return.
                    <br />
                    </div>

                    <div className="row mt-5">
                        {this.renderInput(false, "title", "Search By Title", "text", criteriaClassName, "Search By Title")}
                        {this.renderSelectBox(false, "categoryId", "Category", this.state.categories, "Serach By  Category", criteriaClassName, this.state.categoryId)}
                        {this.renderSelectBox(false, "hasImage", "Image", hasImageOptions, "Image", criteriaClassName, this.state.hasImage)}
                    </div>

                    <div className="mt-5">
                        {this.state.inSubmitProcess ? <InProcessIndicator /> : <React.Fragment>
                            <button className="btn btn-primary mb-0" disabled={this.state.selectedItems.length === 0} onClick={this.addInterestingItems}>Add to my Interesting Items</button>
                        </React.Fragment>}
                    </div>
                </div>

                <div className="container mt-3">
                    {!this.state.inLoadingProcess && this.state.filteredUserItems.length > 0 && <div className="row">
                        {this.state.filteredUserItems.map(item =>
                            <div key={item._id} className="col-lg-4 px-3 py-3">
                                <Item item={item}
                                    showItemSelection={true}
                                    onItemSelectionChanged={() => this.changeItemSelection(item._id)}
                                    checked={this.state.selectedItems.includes(item._id)}

                                    categoryName={this.categoryIdToNameArray[item.categoryId]}

                                    showAddToInterestingItems={true}
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

        // Get items to search
        try {
            this.allItemsToSearchBy = await itemsService.getItemsToSearch();
            this.filterData();
        }
        catch (ex) {
            console.log(ex);
        }

        this.setState({ inLoadingProcess: false })
    }

}

export default Search;