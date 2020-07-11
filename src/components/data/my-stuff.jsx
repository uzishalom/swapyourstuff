import React, { Component } from 'react';

import PageHeader from "../common/page-header"

class MyStuff extends Component {
    state = {}
    render() {
        return (
            <React.Fragment>
                <PageHeader title="My Stuff" />
            </React.Fragment>

        );
    }
}

export default MyStuff;