import React, { Component } from 'react';
import { Link } from "react-router-dom";

import PageHeader from "../common/page-header"
import usersService from "../../services/user-service"

class About extends Component {
    state = {}
    render() {
        const { user } = this.state;

        return (
            <React.Fragment>
                <PageHeader title="About Stuff" />
                <div className="container">
                    <div className="row">
                        <div className="col-lg-3"></div>
                        <div className="col-lg-6">
                            <p>Hi,</p>
                            <p>Welcone to Swap Your Stuff.</p>
                            <p>Here you can exchange your private materials with others from all over the country.</p>
                            <p>Just share with everyone which items you want to give and search for items you want to get.</p>
                            <p>You can view who is intersted in your stuff and decide if you want to make the exchange.</p>

                            {user && (
                                <React.Fragment>
                                    <p>Let's check your <Link class="text-primary" to="/my-stuff">stuff</Link></p>
                                </React.Fragment>
                            )}

                            {!user && (
                                <React.Fragment>
                                    <p>If you allready have an account, please<Link className="text-primary" to="/signin"> sign in </Link></p>
                                    <p>If you don't have an account, please <Link className="text-primary" to="/signup">sign up</Link></p>
                                </React.Fragment>
                            )}
                        </div>
                    </div>
                    <div className="col-lg-3"></div>
                </div>
            </React.Fragment>);
    }

    async componentDidMount() {
        const user = await usersService.currentUser();
        if (user) {
            this.setState({ user });
        }
    }
}

export default About;



