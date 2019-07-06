import React from 'react';
import * as R from 'ramda';
import toReactElement from 'jsonml-to-react-element';

export default class DetailItem extends React.Component {
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.location.pathname !== prevState.pathname) {
            return {
                pathname: nextProps.location.pathname,
            };
        }
        return null;
    }

    constructor(props) {
        super(props);

        console.log(props);
        const { location: { pathname }, imports } = props;
        const paths = pathname.split('/').filter(Boolean);
        const c = R.path(paths, imports);
        c()
            .then((response) => {
                console.log(response);
                this.setState({
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

    componentDidMount() {
        console.log('did mount');
    }

    componentWillUnmount() {
        console.log('will un mount');
    }

    render() {
        const { loading, content } = this.state;
        console.log(content);
        if (loading) {
            return <p>Loading...</p>;
        }
        return (
            <React.Fragment>
                <h2>Item Page</h2>
                {toReactElement(content)}
            </React.Fragment>
        );
    }
}
