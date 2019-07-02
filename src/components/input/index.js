import React from 'react';
import PropTypes from 'prop-types';

export default class Input extends React.Component {
    render() {
        const { value } = this.props;
        return (
            <input value={value} />
        );
    }
}

Input.propTypes = {
    // 值
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
};
Input.defaultProps = {
    placeholder: '请输入文本',
};

