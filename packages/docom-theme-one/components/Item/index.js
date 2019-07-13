import React from 'react';
import { Link } from 'react-router-dom';

import { format } from '../../utils';
import './index.css';


export default class Item extends React.Component {
    render() {
        const { title, date, link, summary = '' } = this.props;
        return (
            <div className="item">
                <h2 className="item__title">
                    <time className="item__date">{format(date)}</time>
                    <Link className="item__link" to={link}>{title}</Link>
                </h2>
                <div className="item__description">
                    <section>
                        <p className="item__summary">{summary}</p>
                    </section>
                </div>
            </div>
        );
    }
}
