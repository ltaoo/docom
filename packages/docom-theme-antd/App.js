import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Layout from './src/template/Layout';

export default class App extends React.Component {
    shouldComponentUpdate() {
        return false;
    }

    render() {
        return (
            <Router>
                <Switch>
                    <Route
                        path="/"
                        render={props => <Layout {...props} {...this.props} />}
                    />
                </Switch>
            </Router>
        );
    }
}
