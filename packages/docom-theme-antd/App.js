import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Layout from './src/template/Layout';
import MainContent from './src/template/Content/MainContent';

export default class App extends React.Component {
    render() {
        return (
            <Router>
                <Switch>
                    <Route
                        path="/"
                        render={(props) => {
                            return <Layout {...props} />;
                        }}
                    />
                </Switch>
            </Router>
        );
    }
}