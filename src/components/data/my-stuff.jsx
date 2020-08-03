import React from 'react';
import { Link } from "react-router-dom";
import Joi from "joi-browser";
import Swal from 'sweetalert2'
import { toast } from 'react-toastify';


import PageHeader from "../common/page-header"
import itemsService from "../../services/items-service"
import Form from "../common/form"
import InProcessIndicator from "../common/in-process-indicator";
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
        filteredItems: [],
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
        let filteredItems = [...this.allUserItems];

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

        if (swapped) {
            filteredItems = filteredItems.filter(item =>
                (swapped === yesOption && item.swapped) || (swapped === noOption && !item.swapped)
            );
        }

        this.setState({ filteredItems });
    }

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

    deleteItem = async (e) => {
        e.preventDefault();
        const itemId = e.target.id.split("_")[0];

        let userConfirmed = false;
        await Swal.fire({
            icon: 'warning',
            title: 'Attention !!!',
            html: "You have chosen to completely remove the item from the system <br/> By doing so, you will loose all information regarding this item",
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Remove the item!',
            cancelButtonText: 'I regret, keep it'
        }).then((result) => {
            userConfirmed = result.isConfirmed;
        }).catch((error) => {
            console.log(error);
        });

        if (!userConfirmed) return;

        // Update Display
        this.allUserItems = this.allUserItems.filter(item => item._id !== itemId);
        this.filterData();

        //Update DB
        try {
            await itemsService.deleteItem(itemId);
            toast.success("The item with all its related data was removed completelly from the system.");
        }
        catch (ex) {
            console.log(ex);
            toast.error("There was an error , please try again");
        }
    }


    render() {
        const criteriaClassName = "col-lg-3";
        return (
            <React.Fragment >
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
                    {!this.state.inLoadingProcess && this.state.filteredItems.length > 0 && <div className="row">
                        {this.state.filteredItems.map(item =>
                            <div key={item._id} className="col-lg-4 px-3 py-3">
                                <Item item={item}
                                    categoryName={this.categoryIdToNameArray[item.categoryId]}

                                    showChangeSwapStatus={true}
                                    onChangeSwapStatus={() => this.changeSwapStatus(item)}

                                    showInterestedUsersAsLink={true}

                                    showUpdate={true}

                                    showDelete={true}
                                    onDelete={this.deleteItem}
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

            </React.Fragment >
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