import React, { Component } from "react";
import Joi from "joi-browser";
import Input from "./input";

class Form extends Component {
    generalErrorMessage = "There was an error while executing your request, please try again"

    state = {
        data: {},
        errors: {},
        inSubmitProcess: false
    };

    validate = () => {
        const options = { abortEarly: false, allowUnknown: true };
        const { error } = Joi.validate(this.state.data, this.validationSchema, options);
        if (!error) return null;

        const errors = {};
        for (let item of error.details) errors[item.path[0]] = item.message;
        return errors;
    };

    validateProperty = ({ name, value }) => {
        const obj = { [name]: value };
        const schema = { [name]: this.validationSchema[name] };
        const { error } = Joi.validate(obj, schema);
        return error ? error.details[0].message : null;
    };

    handleSubmit = e => {

        e.preventDefault();

        const errors = this.validate();
        this.setState({ errors: errors || {} });
        if (errors) return;

        this.submit();

    };

    handleChange = ({ currentTarget: input }) => {
        const errors = { ...this.state.errors };
        const errorMessage = this.validateProperty(input);
        if (errorMessage) {
            errors[input.name] = errorMessage;
        }
        else {
            delete errors[input.name];
        }

        const data = { ...this.state.data };
        data[input.name] = input.value;

        this.setState({ data, errors });
    };

    renderButton(title) {
        return (
            <button disabled={this.validate()} className="btn btn-primary">
                {title}
            </button>
        );
    }

    renderInput(required, name, title, type, className, placeholder) {
        const { data, errors } = this.state;

        return (
            <Input
                required={required}
                type={type}
                name={name}
                value={data[name]}
                title={title}
                onChange={this.handleChange}
                errorMessage={errors[name]}
                placeholder={placeholder}
                className={className}
            />
        );
    }

    showGeneralErrorMessage() {
        const errors = { ...this.state.errors }
        errors.general = this.generalErrorMessage;
        this.setState({ errors })
    }

}

export default Form;