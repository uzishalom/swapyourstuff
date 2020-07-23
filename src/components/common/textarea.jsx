import React from 'react';
import PropTypes from "prop-types";


const Textarea = ({ required = false, name, title, rows = "4", cols = "50", errorMessage = "", placeholder = "", className = "col-12", ...rest }) => {
    return (
        <div className={"form-group " + className}>
            <label className="d-none d-lg-block" htmlFor={name}><span className="text-danger">{required ? "* " : ""}</span>{title}</label>
            <textarea {...rest} id={name} name={name} rows={rows} cols={cols} className="form-control" placeholder={placeholder} />
            <span className="small text-danger">{errorMessage}</span>
        </div>
    );
}

Textarea.prototypes = {
    required: PropTypes.bool,
    name: PropTypes.string,
    title: PropTypes.string,
    rows: PropTypes.string,
    cols: PropTypes.string,
    errorMessage: PropTypes.string,
    placeholder: PropTypes.string
}

export default Textarea;

