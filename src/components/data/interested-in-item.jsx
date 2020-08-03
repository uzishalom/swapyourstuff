import React from 'react';
import Joi from "joi-browser";
import Swal from 'sweetalert2'

import PageHeader from "../common/page-header"
import itemsService from "../../services/items-service"
import Form from "../common/form"
import InProcessIndicator from "../common/in-process-indicator";
import Item from "./item"
import { yesOption, noOption, hasImageOptions } from "../../config/definitions"
import userService from "../../services/user-service"



class InterestedInItem extends Form {
    item = null;

    swapCandidatesItems = [];
    categoryIdToNameArray = [];

    state = {
        data: { title: "", categoryId: "", hasImage: "" },
        errors: {},
        inSubmitProcess: false,
        categories: [],
        filteredItems: [],
        inLoadingProcess: true,
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
        if (this.swapCandidatesItems.length === 0) return;
        const { title, categoryId, hasImage } = { ...this.state.data };
        let filteredItems = [...this.swapCandidatesItems];

        if (title) {
            filteredItems = filteredItems.filter(item => item.title.toLowerCase().includes(title.toLowerCase()));
        }

        if (categoryId) {
            filteredItems = filteredItems.filter(item => item.categoryId === categoryId);
        }

        if (hasImage) {
            filteredItems = filteredItems.filter(item =>
                (hasImage === yesOption && item.image !== "") || (hasImage === noOption && item.image === "")
            );
        }

        this.setState({ filteredItems });

    }

    showUserDetails = async (e) => {
        e.preventDefault();
        let userId = e.target.id.split("_")[0];
        let user = null;
        try {
            user = await userService.getUserById(userId);
        }
        catch (ex) {
            console.log(ex);
        }

        if (!user) {
            Swal.fire({
                icon: "error",
                title: 'Oops ...',
                html: `<div class="text-left">We are sorry, but we can not show the user details at the moment.</div>`,
                confirmButtonColor: '#f27474'
            });
            return;
        }

        Swal.fire({
            title: '<span class="text-info"><u>User Details</u></span>',
            html: `
            <div class="text-left">
            <div><b>Name: </b>${user.name}</divWe>
            <div><b>Email: </b><a href = "mailto:${user.email}">${user.email}</a> </div>
            <div><b>Phone: </b><a href = "tel:${user.phone}">${user.phone}</a></div>
           <div><b>City: </b> ${user.city}</div>
           </div>
        `,
        })
    }


    render() {
        const criteriaClassName = "col-lg-3";

        return (
            <React.Fragment>
                <PageHeader title="Suggested Swaps" >
                    The list below shows all items that other users suggested to get your <b>{this.item ? this.item.title : ""}</b> item.
                    <br />
                    You can see the user personal details by pressing the user icon on the item details
                    <br />
                </PageHeader>


                <div className="container mt-3">
                    <div className="row mt-5">
                        {this.renderInput(false, "title", "Search By Title", "text", criteriaClassName, "Search By Title")}
                        {this.renderSelectBox(false, "categoryId", "Category", this.state.categories, "Serach By  Category", criteriaClassName, this.state.categoryId)}
                        {this.renderSelectBox(false, "hasImage", "Image", hasImageOptions, "Image", criteriaClassName, this.state.hasImage)}
                    </div>
                </div>

                <div className="container mt-3">
                    {!this.state.inLoadingProcess && this.state.filteredItems.length > 0 && <div className="row">
                        {this.state.filteredItems.map(item =>
                            <div key={item._id} className="col-lg-4 px-3 py-3">
                                <Item item={item}
                                    showUser={true}
                                    onShowUserDetails={this.showUserDetails}

                                    categoryName={this.categoryIdToNameArray[item.categoryId]}
                                >
                                </Item>
                            </div>
                        )}
                    </div>}
                    {!this.state.inLoadingProcess && this.state.filteredItems.length === 0 &&
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

        // Get all suggested items for an item 
        const itemId = this.props.match.params.itemId;
        try {
            this.item = await itemsService.getItem(itemId);
            this.swapCandidatesItems = await itemsService.getSuggestedSwapItems(itemId);
            this.filterData();
        }
        catch (ex) {
            console.log(ex);
        }

        this.setState({ inLoadingProcess: false })
    }

}

export default InterestedInItem;
