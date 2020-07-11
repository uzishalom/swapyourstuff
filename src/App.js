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
import UserDetails from "./components/user/user-details"

class App extends Component {
  state = {}

  componentDidMount() {
    const user = userService.currentUser();
    this.setState({ user });
  }


  render() {
    const { user } = this.state;
    return (
      <React.Fragment>

        <header>
          <Navbar user={user} />
        </header>

        <main style={{ minHeight: '900px' }}>
          <Switch>
            <Route path="/" exact component={user ? MyStuff : About} />
            <Route path="/my-stuff" exact component={user ? MyStuff : About} />
            <Route path="/about" exact component={About} />
            <Route path="/signin" exact component={Signin} />
            <Route path="/signup" exact component={Signup} />
            <Route path="/user-details" exact component={UserDetails} />
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
