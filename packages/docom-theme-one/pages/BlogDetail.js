import React from 'react';
import * as R from 'ramda';
import toReactElement from 'jsonml-to-react-element';

import { format } from '../utils';

export default class DetailItem extends React.Component {
    constructor(props) {
        super(props);

        const { location: { pathname }, imports } = props;
        const paths = pathname.split('/').filter(Boolean);
        const c = R.path(paths, imports);
        c()
            .then((response) => {
                this.setState({
                    meta: response.meta,
                    content: response.content,
                });
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                this.setState({
                    loading: false,
                });
            });

        this.state = {
            loading: true,
            content: [],
            pathname,
        };
    }

    render() {
        const {
            loading, content, description = '', meta,
        } = this.state;
        if (loading) {
            return <p>Loading...</p>;
        }
        const { title, publishDate: date } = meta;
        return (
            <div className="content">
                <h1 className="content__title">{title}</h1>
                <div className="content__container">
                    <article>{toReactElement(content)}</article>
                </div>
                <div className="content__meta">
                    <time className="content__updated-date">{format(date)}</time>
                </div>
            </div>
        );
    }
}
