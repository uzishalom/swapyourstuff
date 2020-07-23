import React from 'react';
import PropTypes from "prop-types";


const SelectBox = ({ required = false, name, title, options, noSelectionTitle, errorMessage = "", className = "col-12", ...rest }) => {
    return (
        <div className={"form-group " + className}>
            <label className="d-none d-lg-block" htmlFor={name}><span className="text-danger">{required ? "* " : ""}</span>{title}</label>
            <select {...rest} id={name} name={name} className="form-control">
                <option value="">{noSelectionTitle}</option>
                {options && options.length && options.map(option => (
                    <option key={option.value} value={option.value}>{option.title}</option>
                ))
                }
            </select>
            <span className="small text-danger">{errorMessage}</span>
        </div>
    );
}

SelectBox.prototypes = {
    required: PropTypes.bool,
    name: PropTypes.string,
    title: PropTypes.string,
    options: PropTypes.arrayOf(PropTypes.object),
    noSelectionTitle: PropTypes.string,
    errorMessage: PropTypes.string,
    placeholder: PropTypes.string
}

export default SelectBox;

