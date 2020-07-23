import React, { Component } from 'react';
import { Link } from "react-router-dom";

import PageHeader from "../common/page-header"

class MyStuff extends Component {
    state = {}
    render() {
        return (
            <React.Fragment>
                <PageHeader title="My Stuff" />
                <Link className="btn btn-primary" to="/add-item">Add Item</Link>
            </React.Fragment>

        );
    }
}

export default MyStuff;