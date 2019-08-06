import React from 'react';
import { Link } from 'react-router-dom';

/* eslint-disable react/no-danger */

export default class NotFound extends React.Component {
    shouldComponentUpdate() {
        return false;
    }

    render() {
        return (
            <div id="page-404">
                <section>
                    <h1>404</h1>
                    <p>
                        你要找的页面不存在
                        <Link to="/">返回首页</Link>
                    </p>
                </section>
                <style
                    dangerouslySetInnerHTML={{
                        __html: '#react-content { height: 100%; background-color: #fff }',
                    }}
                />
            </div>
        );
    }
}
