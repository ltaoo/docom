import React from 'react';
import { Link } from 'react-router-dom';

export default class Blogs extends React.Component {
    render() {
        const { source: { blog } } = this.props;
        console.log(blog);
        const { index, ...restProps } = blog;
        return (
            <React.Fragment>
                <h2>Blogs Page</h2>
                {Object.keys(restProps).map(key => {
                    const { meta } = restProps[key];
                    return (
                        <li key={key}><Link to={`/blog/${key}`}>{meta.title}</Link></li>
                    );
                })}
            </React.Fragment>
        );
    }
}
