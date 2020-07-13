import React, { Component } from 'react';
import { Switch, Route } from "react-router-dom"
import './App.css';

import Navbar from "./components/main-single-page/navbar";
import Footer from "./components/main-single-page/footer";

import userService from "./services/user-service"
import MyStuff from "./components/data/my-stuff"
import About from "./components/data/about"
import Signin from "./components/user/signin"
import Signup from "./components/user/signup"
import Logout from "./components/user/logout"
import UserDetails from "./components/user/user-details"


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
          <Navbar user={user} />
        </header>

        <main style={{ minHeight: '900px' }}>
          <Switch>
            <Route path="/" exact component={user ? MyStuff : Home} />
            <Route path="/my-stuff" exact component={user ? MyStuff : Home} />
            <Route path="/about" exact component={Home} />
            <Route path="/signin" exact component={user ? Home : Signin} />
            <Route path="/signup" exact component={user ? Home : Signup} />
            <Route path="/logout" exact component={user ? Logout : Home} />
            <Route path="/user-details" exact component={user ? UserDetails : Home} />
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
