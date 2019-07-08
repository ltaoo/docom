import React from 'react';
import { Link } from 'react-router-dom';

import Header from '../components/Header';
import Item from '../components/Item';
import './index.css';

export default class Blogs extends React.Component {
    render() {
        const { source: { blog } } = this.props;
        console.log(blog);
        const { index, ...restProps } = blog;
        return (
            <React.Fragment>
                <Header site="ltaoo" />
                <div className="document yue">
                    <h1 className="entry-title">Archive</h1>
                    <div className="entry-list">
                        {Object.keys(restProps).map(key => {
                            const { meta: { title, publishDate } } = restProps[key];
                            return (
                                <Item
                                    key={key}
                                    link={`/blog/${key}`}
                                    title={title}
                                    date={publishDate}
                                />
                            );
                        })}
                    </div>
                </div>
            </React.Fragment>
        );
    }
}
