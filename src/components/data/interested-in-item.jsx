import React, { Component } from 'react';

import PageHeader from "../common/page-header";

class InterestedInItem extends Component {
    state = {}
    render() {
        return (
            <React.Fragment>
                <PageHeader title="Interested In Item" />

            </React.Fragment>
        );
    }

    componentDidMount() {
        let itemId = this.props.match.params.id;
        console.log(itemId);
    }
}

export default InterestedInItem;