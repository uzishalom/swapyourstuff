import React from 'react';
import PropTypes from "prop-types";

const PageHeader = ({ title }) => {
    return (
        <h1 className="text-success text-center"><u>{title}</u></h1>
    );
}
PageHeader.prototypes = {
    title: PropTypes.string
}


export default PageHeader;