import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./Components/Home";
import Review from "./Components/Review";
import "./App.css";

class App extends Component {
  render() {
    return (
      <Router>
        <div style={{ height: "100%" }}>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/:content_id" component={Review} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
