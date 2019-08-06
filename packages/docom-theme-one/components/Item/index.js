import React from 'react';
import { Link } from 'react-router-dom';

import { format } from '../../utils';
import './index.css';


export default class Item extends React.Component {
    render() {
        const { title, date, link } = this.props;

        return (
            <div className="item">
                <h2 className="item__title">
                    <time className="item__date">{format(date)}</time>
                    <Link className="item__link" to={link}>{title}</Link>
                </h2>
            </div>
        );
    }
}
