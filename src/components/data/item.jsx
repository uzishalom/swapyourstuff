import React, { Component } from 'react';
import { Link } from "react-router-dom"

import { apiUrl } from "../../config/config.json"
import { swapTitles } from "../../config/definitions"



class Item extends Component {
    state = {
        showLargeImage: false,
        swapped: true,
    }

    showLargeImage = async () => {
        await this.setState({ showLargeImage: true })
    }

    hideLargeImage = async () => {
        await this.setState({ showLargeImage: false })
    }

    updateSwapStatus = async () => {
        await this.setState({ swapped: !this.props.item.swapped })
        this.props.onChangeSwapStatus();
    }


    render() {
        const { item } = this.props;
        return (
            <React.Fragment>
                <div className="card card border-secondary h-100">
                    {this.props.showItemSelection && <input className="big-check-box" type="checkbox" value="" onChange={this.props.onItemSelectionChanged} />}
                    {item.image && <img className="card-img-top item-image" src={apiUrl + "/" + item.image} alt="Item" style={{ cursor: "pointer" }} onClick={this.showLargeImage} />}
                    {!item.image && <div className="text-center"><h1 className="text-secondary bg-light border py-5" ><i className="fas fa-camera fa-4x"></i></h1></div>}

                    <div className="card-body">
                        <h3 className="card-title">{this.props.showUser && <span><Link to="" onClick={this.props.onShowUserDetails}><i className="fas fa-user" title="View User Details" /></Link> </span>}     {item.title} </h3>

                        <p className="card-text long-text">{item.description}</p>
                    </div>

                    <div >
                        <ul className="list-group list-group-flush border">
                            <li className="list-group-item"><b>Category: </b>{this.props.categoryName}</li>

                            <li className="list-group-item"><b>Status: </b>{this.state.swapped ? swapTitles.swapped : swapTitles.notSwapped}
                                {this.props.showChangeSwapStatus && !this.state.swapped && <button className="btn btn-sm btn-outline-success float-right ml-auto" onClick={this.updateSwapStatus}>Set as Swapped</button>}
                            </li>

                            <li className="list-group-item"><b>Interested Users: </b>
                                {this.props.showInterestedUsersAsLink && item.numOfInterestedUsers > 0 ?
                                    <Link to={`/interested-in-item/${item._id}`}>{item.numOfInterestedUsers}</Link> :
                                    item.numOfInterestedUsers}
                            </li>

                            <li className="list-group-item"><b>Last update: </b>{item.lastUpdatedAt}</li>
                        </ul>

                        <div className="card-body border">
                            <a href="#" className="card-link">Favorite</a>

                            <a href="#" className="card-link">Edit</a>

                            <a href="#" className="card-link">Delete</a>
                        </div>
                    </div>
                </div>

                {this.state.showLargeImage && <div id="id_dark" className="dark container-fluid center">
                    <div className="dark-box text-center">
                        <img src={apiUrl + "/" + item.image} alt="Item" className="w-100 mb-3" />
                        <button onClick={this.hideLargeImage} className="btn btn-success mb-3">close</button>
                    </div>
                </div>}


            </React.Fragment>
        );
    }

    componentDidMount() {
        this.setState({ swapped: this.props.item.swapped });
    }
}

export default Item;