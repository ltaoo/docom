import React from 'react';
import { Link } from 'react-router-dom';

import './index.css';

/**
 * 
 * @param {number} num 
 * @return {string}
 */
function paddingZero(num) {
    return num < 10 ? `0${num}` : String(num);
}

function format(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = paddingZero(d.getMonth() + 1);
    const day = paddingZero(d.getDate());

    return `${year}/${month}/${day}`;
}

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
