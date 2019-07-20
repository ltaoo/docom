import React from 'react';
import { Spin } from 'antd';

export default class Loading extends React.Component {
    shouldComponentUpdate() {
        return false;
    }

    render() {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 200 }}>
                <Spin size="large" spinning />
            </div>
        );
    }
}
