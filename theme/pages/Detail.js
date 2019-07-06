import React from 'react';
import { Switch, Route, Link } from "react-router-dom";

import Item from './Item';

export default class Detail extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { imports } = this.props;
        console.log(imports);
        const pages = Object.keys(imports.develop);
        return (
            <React.Fragment>
                <h2>Detail Page</h2>
                {pages.map((page) => {
                    console.log(page);
                    return <Link key={page} to={`/develop/${page}`}>{page}</Link>
                })}
                <Route path="/develop/:id" exact render={(props) => {
                    return <Item key={props.match.params.id} {...props} imports={imports} />;
                }} />
            </React.Fragment>
        );
    }
}
