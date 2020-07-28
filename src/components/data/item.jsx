import React, { Component } from 'react';
import { Link } from "react-router-dom"

import { apiUrl } from "../../config/config.json"


class Item extends Component {
    state = { showLargeImage: false }

    showLargeImage = async () => {
        await this.setState({ showLargeImage: true })
    }

    hideLargeImage = async () => {
        await this.setState({ showLargeImage: false })
    }

    render() {
        const { item } = this.props;
        return (
            <React.Fragment>
                <div className="card card border-secondary">
                    {this.props.showItemSelection && <input className="big-check-box" type="checkbox" value="" onChange={this.props.onItemSelectionChanged} />}
                    {item.image && <img className="card-img-top item-image" src={apiUrl + "/" + item.image} alt="Item" style={{ cursor: "pointer" }} onClick={this.showLargeImage} />}
                    {!item.image && <div className="text-center"><h1 className="text-secondary bg-light border py-5" ><i className="fas fa-camera fa-4x"></i></h1></div>}

                    <div className="card-body">
                        <h3 className="card-title">{this.props.showUser && <span><Link to="" onClick={this.props.onShowUserDetails}><i className="fas fa-user" title="View User Details" /></Link> </span>}     {item.title} </h3>

                        <p className="card-text">{item.description}</p>
                    </div>

                    <ul className="list-group list-group-flush">
                        <li className="list-group-item"><b>Category: </b>{this.props.categoryName}</li>

                        <li className="list-group-item"><b>Status: </b>{item.swapped ? 'Allready Swapped' : 'Not Swapped Yet'}</li>

                        <li className="list-group-item"><b>Interested Users: </b>{item.numOfInterestedUsers}</li>

                        <li className="list-group-item"><b>Last update: </b>{item.lastUpdatedAt}</li>
                    </ul>

                    <div className="card-body">
                        <a href="#" className="card-link">Favorite</a>

                        <a href="#" className="card-link">Edit</a>

                        <a href="#" className="card-link">Delete</a>
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
}

export default Item;