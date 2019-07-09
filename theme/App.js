import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";

import Footer from './components/Footer';

import Blogs from './pages/Blogs';
import BlogDetail from './pages/BlogDetail';

function App({ imports, source }) {
  return (
    <div>
      <Router>
        <Switch>
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
          <Redirect from="/" to="/blog" />
        </Switch>
      </Router>
      <Footer />
    </div>
  );
}

export default App;
