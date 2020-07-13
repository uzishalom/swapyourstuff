import { Component } from 'react';

import userService from '../../services/user-service';

class Logout extends Component {
    state = {}
    render() {
        return null;
    }

    async componentDidMount() {
        await userService.logout();
        window.location = "/";
    }
}

export default Logout;