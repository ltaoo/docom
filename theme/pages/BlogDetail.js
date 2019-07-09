import React from 'react';
import * as R from 'ramda';
import toReactElement from 'jsonml-to-react-element';

export default class DetailItem extends React.Component {
    constructor(props) {
        super(props);

        const { location: { pathname }, imports } = props;
        const paths = pathname.split('/').filter(Boolean);
        console.log(pathname);
        const c = R.path(paths, imports);
        c()
            .then((response) => {
                console.log(response);
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
        const { loading, content, meta } = this.state;
        console.log(content);
        if (loading) {
            return <p>Loading...</p>;
        }
        return (
            <React.Fragment>
                <h2>{meta.title}</h2>
                {toReactElement(content)}
            </React.Fragment>
        );
    }
}
