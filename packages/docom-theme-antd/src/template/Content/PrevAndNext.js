import React from 'react';

export default class PrevAndNext extends React.Component {
    shouldComponentUpdate(nextProps) {
        const { prev, next } = this.props;
        if (nextProps.prev !== prev || nextProps.next !== next) {
            return true;
        }
        return false;
    }

    render() {
        const { prev, next } = this.props;
        return (
            <section className="prev-next-nav">
                {prev
                    ? React.cloneElement(prev.props.children || prev.children[0], {
                        className: 'prev-page',
                    })
                    : null}
                {next
                    ? React.cloneElement(next.props.children || next.children[0], {
                        className: 'next-page',
                    })
                    : null}
            </section>
        );
    }
}
