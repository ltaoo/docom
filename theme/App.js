import React from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";

import Home from './pages/Home';
import Detail from './pages/Detail';
import About from './pages/About';
import Blogs from './pages/Blogs';
import BlogDetail from './pages/BlogDetail';

import './App.css';

function App({ imports, source }) {
  return (
    <Router>
      <div>
        <Switch>
          <Route path="/" exact render={(props) => {
            return <Home {...props} source={source} imports={imports} />;
          }} />
          <Route path="/blog/:id" render={(props) => {
            return (
              <BlogDetail
                key={props.match.params.id}
                {...props}
                source={source} imports={imports}
              />
            );
          }} />
          <Route path="/blog" exact render={(props) => {
            return <Blogs {...props} source={source} imports={imports} />;
          }} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
