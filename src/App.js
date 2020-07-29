import React, { Component } from 'react';
import { Switch, Route } from "react-router-dom"
import './App.css';

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Navbar from "./components/main-single-page/navbar";
import Footer from "./components/main-single-page/footer";

import userService from "./services/user-service"
import MyStuff from "./components/data/my-stuff"
import AddItem from "./components/data/add-item"
import InterestedInItem from "./components/data/interested-in-item"
import Search from "./components/data/search"
import About from "./components/data/about"
import Signin from "./components/user/signin"
import Signup from "./components/user/signup"
import Logout from "./components/user/logout"
import UserDetails from "./components/user/user-details"
import ChangePassword from "./components/user/change-password"


class App extends Component {
  state = {}

  componentDidMount() {
    const user = userService.currentUser();
    this.setState({ user });
  }


  render() {
    const { user } = this.state;
    const Home = About;
    return (
      <React.Fragment>

        <header>
          <ToastContainer />
          <Navbar user={user} />
        </header>

        <main style={{ minHeight: '900px' }}>
          <Switch>
            <Route exact path="/" component={user ? MyStuff : Home} />
            <Route exact path="/my-stuff" component={user ? MyStuff : Home} />
            <Route exact path="/add-item" component={user ? AddItem : Home} />
            <Route exact path="/interested-in-item/:id" component={user ? InterestedInItem : Home} />
            <Route exact path="/search" component={Search} />
            <Route exact path="/about" component={Home} />
            <Route exact path="/signin" component={user ? Home : Signin} />
            <Route exact path="/signup" component={user ? Home : Signup} />
            <Route exact path="/logout" component={user ? Logout : Home} />
            <Route exact path="/user-details" component={user ? UserDetails : Home} />
            <Route exact path="/change-password" component={user ? ChangePassword : Home} />
            <Home />
          </Switch>
        </main>

        <footer>
          <Footer />
        </footer>

      </React.Fragment>

    );



  }
}

export default App;
