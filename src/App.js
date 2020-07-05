import React from 'react';
import { Switch, Route } from "react-router-dom"
import './App.css';

import Navbar from "./components/main/navbar";
import Footer from "./components/main/footer";
import About from "./components/data/about"

function App() {
  return (
    <React.Fragment>

      <header>
        <Navbar />
      </header>

      <main style={{ minHeight: '900px' }}>
        <Switch>
          <Route path="/about" exact component={About} />
        </Switch>
      </main>

      <footer>
        <Footer />

      </footer>

    </React.Fragment>

  );
}

export default App;
