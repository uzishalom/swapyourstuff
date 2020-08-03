import React from 'react';
import PropTypes from "prop-types";

const PageHeader = ({ title, children }) => {
    return (
        <div className="container mt-3">
            <h3 className="text-success text-center"><u>{title}</u></h3>
            <div className="mt-3 text-success text-lg-center">
                {children}
            </div>
        </div>
    );
}
PageHeader.prototypes = {
    title: PropTypes.string,
}


export default PageHeader;