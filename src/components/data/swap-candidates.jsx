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


class SwapCandidates extends Form {

    interestingInItemIds = this.props.match.params.itemIds.split("-");

    allUserUnswappedItems = [];
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
        if (this.allUserUnswappedItems.length === 0) return;
        const { title, categoryId, hasImage } = { ...this.state.data };
        let filteredUserItems = [...this.allUserUnswappedItems];

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


    addInterestingItem = async () => {
        let userConfirmed = false;
        await Swal.fire({
            icon: 'info',
            title: 'Interested In Item ?',
            html: "By setting an item as interested, you agree that the person who owns the item will be able to see that your are interested in his/her item and be able to view your personal details in order to contact you when needed."
            ,
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonText:
                '<i class="fa fa-thumbs-up"></i> I agree!',
            cancelButtonText:
                '<i class="fa fa-thumbs-down"></i>I Disagree',
        }).then((result) => {
            userConfirmed = result.isConfirmed;
        }).catch((error) => {
            console.log(error);
        });

        if (!userConfirmed) return;

        await this.setState({ inSubmitProcess: true });
        const data = this.generateDataToSend();
        try {
            await itemsService.addInterestingItems(data);
            toast.success("The item was added to your interesting items list.");
            this.props.history.goBack();
        }
        catch (ex) {
            console.log(ex);
            toast.error("There was an error , please try again");
            await this.setState({ inSubmitProcess: false });
        }
    }

    cancelSwapSuggestion = () => {
        this.props.history.goBack();
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


    generateDataToSend() {
        const selectedItems = [...this.state.selectedItems];
        let data = [];
        this.interestingInItemIds.forEach((itemId) => {
            data.push({
                itemId: itemId,
                itemUserId: null, // will be updated by the server
                interestedUserId: null, // wil be updated by the server
                swapCandidateItems: selectedItems
            })
        })
        return data;
    }



    render() {
        const criteriaClassName = "col-lg-3";

        return (
            <React.Fragment>
                <PageHeader title="Swap Candidates" />
                <div className="container mt-3">
                    <div className="mt-3 text-success text-lg-center">
                        You have chosen <b>{this.interestingInItemIds.length}</b> interesting items that you would like to have.
                    <br />
                    Please select from your own items below, the ones that you would like to give in return.
                    </div>

                    <div className="row mt-5">
                        {this.renderInput(false, "title", "Search By Title", "text", criteriaClassName, "Search By Title")}
                        {this.renderSelectBox(false, "categoryId", "Category", this.state.categories, "Serach By  Category", criteriaClassName, this.state.categoryId)}
                        {this.renderSelectBox(false, "hasImage", "Image", hasImageOptions, "Image", criteriaClassName, this.state.hasImage)}
                    </div>

                    <div className="mt-5">
                        {this.state.inSubmitProcess ? <InProcessIndicator /> : <React.Fragment>
                            <button className="btn btn-primary mb-0" disabled={this.state.selectedItems.length === 0} onClick={this.addInterestingItem}>Send To Users</button>
                            <button className="btn btn-secondary ml-3 mb-0" onClick={this.cancelSwapSuggestion}>Cancel</button>
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

        // Get all user items.
        try {
            this.allUserUnswappedItems = await itemsService.getUserUnswappedItems();
            this.filterData();
        }
        catch (ex) {
            console.log(ex);
        }

        this.setState({ inLoadingProcess: false })
    }

}

export default SwapCandidates;