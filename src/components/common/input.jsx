import React from 'react';
import PropTypes from "prop-types";


const Input = ({ required = false, type = "text", name, title, errorMessage = "", placeholder = "", ...rest }) => {
    return (
        <div className="form-group col-lg-6 col-12">
            <label className="d-none d-lg-block" htmlFor={name}><span className="text-danger">{required ? "* " : ""}</span>{title}</label>
            <input {...rest} type={type} id={name} name={name} className="form-control" placeholder={placeholder} />
            <span className="small text-danger">{errorMessage}</span>
        </div>
    );
}

Input.prototypes = {
    required: PropTypes.bool,
    type: PropTypes.string,
    name: PropTypes.string,
    title: PropTypes.string,
    errorMessage: PropTypes.string,
    placeholder: PropTypes.string
}

export default Input;