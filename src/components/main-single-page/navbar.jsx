import React, { Component } from 'react';
import { Link, NavLink } from "react-router-dom"

import logo from "../../images/logo.png"
import userService from "../../services/user-service";

class Navbar extends Component {
    state = { userDetails: null }
    render() {
        const { user } = this.props;

        return (

            <nav className="navbar navbar-expand-lg navbar-light shadow-sm">
                <div className="container">
                    <Link className="navbar-brand" to="/">
                        <img src={logo} width="30" height="30" alt="swap your stuff logo" /> Swap Your Stuff</Link>
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-toggle="collapse"
                        data-target="#navbarSupportedContent"
                        aria-controls="navbarSupportedContent"
                        aria-expanded="false"
                        aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav mr-auto">
                            {user && <React.Fragment>
                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/my-stuff">
                                        {this.state.userDetails ? `${this.state.userDetails.name} Stuff` : "My Stuff"}
                                    </NavLink>
                                </li>
                            </React.Fragment>}
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/search">Search</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/about">About</NavLink>
                            </li>
                        </ul>
                        <ul className="navbar-nav ml-auto">
                            {user &&
                                (<React.Fragment>
                                    <li className="nav-item">
                                        <NavLink className="nav-link" to="/logout">Logout</NavLink>
                                    </li>
                                    <li className="nav-item">
                                        <NavLink className="nav-link" to="/user-details">My Details</NavLink>
                                    </li>
                                    <li className="nav-item">
                                        <NavLink className="nav-link" to="/change-password">Change Password</NavLink>
                                    </li>
                                </React.Fragment>)}
                            {!user &&
                                (<React.Fragment>
                                    <li className="nav-item">
                                        <NavLink className="nav-link" to="/signin">Signin</NavLink>
                                    </li>
                                    <li className="nav-item">
                                        <NavLink className="nav-link" to="/signup">Signup</NavLink>
                                    </li>
                                </React.Fragment>)}
                        </ul>
                    </div>
                </div>
            </nav>
        );
    }

    async componentDidMount() {
        if (this.props.user) {
            try {
                const userDetails = await userService.getUserDetails();
                this.setState({ userDetails });
            }
            catch (ex) {
                console.log(ex);
            }
        }
    }
}

export default Navbar;