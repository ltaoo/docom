import React from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";

import Home from './pages/Home';
import Detail from './pages/Detail';
import About from './pages/About';

import './App.css';

function App({ imports, source }) {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            {Object.keys(source).map(module => {
              const { title } = source[module].index.meta;
              return (
                <li key={module}><Link to={`/${module}/index`}>{title}</Link></li>
              );
            })}
          </ul>
        </nav>
        <Switch>
          <Route path="/" exact render={(props) => {
            return <Home {...props} imports={imports} />;
          }} />
          <Route path="/develop" render={(props) => {
            return <Detail {...props} imports={imports} />;
          }} />
          <Route path="/components/" component={About} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
