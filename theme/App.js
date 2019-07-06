import React from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";

import Home from './pages/Home';
import Detail from './pages/Detail';
import About from './pages/About';

import './App.css';

function App({ imports }) {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/develop/index">开发说明</Link>
            </li>
            <li>
              <Link to="/users/">Users</Link>
            </li>
          </ul>
        </nav>
        <Switch>
          <Route path="/" exact render={(props) => {
            return <Home {...props} imports={imports} />;
          }} />
          <Route path="/develop" render={(props) => {
            return <Detail {...props} imports={imports} />;
          }} />
          <Route path="/about/" component={About} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
