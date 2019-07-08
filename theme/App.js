import React from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";

import Footer from './components/Footer';

import Home from './pages/Home';
import Blogs from './pages/Blogs';
import BlogDetail from './pages/BlogDetail';

import './App.css';

function App({ imports, source }) {
  return (
    <div>
      <Router>
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
      </Router>
      <Footer />
    </div>
  );
}

export default App;
