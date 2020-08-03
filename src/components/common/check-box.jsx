import React from 'react';
import PropTypes from "prop-types";


const CheckBox = ({ name, title, checked, className = "col-12", ...rest }) => {
    return (
        <div className={"form-check " + className}>
            <input {...rest} type="checkbox" id={name} name={name} checked={checked} className="form-check-input" />
            <label className="form-check-label" htmlFor={name}>{title}</label>
        </div>
    );
}

CheckBox.prototypes = {
    name: PropTypes.string,
    title: PropTypes.string,
    checked: PropTypes.bool,
}

export default CheckBox;