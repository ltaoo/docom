import React from 'react';

import './index.css';

export default class Header extends React.Component {
    shouldComponentUpdate() {
        return false;
    }

    render() {
        const { site, title } = this.props;
        return (
            <header className="header">
                <div className="header__container">
                    <div className="header__brand">
                        <a
                            className="header__link"
                            href="/"
                        >{site}</a>
                        {title && (
                            <span>
                                -
                                <span className="header__tagline">{title}</span>
                            </span>
                        )}
                    </div>
                </div>
            </header>
        );
    }
}
