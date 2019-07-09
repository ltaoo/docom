import React from 'react';

import './index.css';

export default class Content extends React.Component {
    render() {
        const { title, description = '', content, date } = this.props;
        return (
            <div className="content">
                <h1 className="content__title">{title}</h1>
                <div className="content__description">
                    <section>
                        <p>{description}</p>
                    </section>
                </div>
                <div className="content__container">
                    <article>{content}</article>
                </div>
                <div className="content__meta">
                    <time className="content__updated-date">{date}</time>
                </div>
            </div>
        );
    }
}
