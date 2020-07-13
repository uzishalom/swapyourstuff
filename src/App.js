import React, { Component } from 'react';
import { Switch, Route } from "react-router-dom"
import './App.css';

import Navbar from "./components/main-single-page/navbar";
import Footer from "./components/main-single-page/footer";

import userService from "./services/user-service"
import MyStuff from "./components/data/my-stuff"
import Search from "./components/data/search"
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
            <Route exact path="/" component={user ? MyStuff : Home} />
            <Route exact path="/my-stuff" component={user ? MyStuff : Home} />
            <Route exact path="/search" component={Search} />
            <Route exact path="/about" component={Home} />
            <Route exact path="/signin" component={user ? Home : Signin} />
            <Route exact path="/signup" component={user ? Home : Signup} />
            <Route exact path="/logout" component={user ? Logout : Home} />
            <Route exact path="/user-details" component={user ? UserDetails : Home} />
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
