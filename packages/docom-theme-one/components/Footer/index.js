import React from 'react';

import './index.css';

export default class Footer extends React.Component {
    shouldComponentUpdate() {
        return false;
    }

    render() {
        return (
            <div className="footer">
                <p className="footer__copyright">
                    powered by 
                    <a className="footer__link" href="https://github.com/ltaoo/fake-bisheng">fake-bisheng</a>
                </p>
            </div>
        );
    }
}
