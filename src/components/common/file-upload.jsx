import React from 'react';
import PropTypes from "prop-types";


const FileUpload = ({ required = false, name, title, accept = "", errorMessage = "", className = "col-12", ...rest }) => {
    return (
        <div className={"form-group " + className}>
            <label className="d-none d-lg-block" htmlFor={name}><span className="text-danger">{required ? "* " : ""}</span>{title}</label>
            <input {...rest} id={name} name={name} type="file" accept={accept} className="form-control-file" />
            <span className="small text-danger">{errorMessage}</span>
        </div>
    );
}

FileUpload.prototypes = {
    required: PropTypes.bool,
    name: PropTypes.string,
    title: PropTypes.string,
    accept: PropTypes.string,
    errorMessage: PropTypes.string,
}

export default FileUpload;