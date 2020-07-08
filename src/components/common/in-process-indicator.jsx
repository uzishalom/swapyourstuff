import React from 'react';
import spinner from "../../images/spinner.gif"

const InProcessIndicator = () => {
    return (
        <React.Fragment>
            <img src={spinner} width="50" height="50" alt="please wait indicator" />
            <div className="text-info small">
                please wait ...
            </div>
        </React.Fragment>

    );
}

export default InProcessIndicator;