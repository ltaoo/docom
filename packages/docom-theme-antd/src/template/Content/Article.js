import React, { Children, cloneElement } from 'react';
import PropTypes from 'prop-types';
import DocumentTitle from 'react-document-title';
import { getChildren } from 'jsonml.js/lib/utils';
import { Timeline, Affix } from 'antd';
import toReactComponent from 'jsonml-to-react-element';

import config from '@root/docom.config';

const converters = [
    [
        node => typeof node === 'function',
        (node, index) => React.cloneElement(node(), { key: index }),
    ],
];

export default class Article extends React.Component {
    static contextTypes = {
        intl: PropTypes.object.isRequired,
    };

    getArticle(article) {
        const { meta } = this.props;
        if (!meta.timeline) {
            return article;
        }
        const timelineItems = [];
        let temp = [];
        let i = 1;
        Children.forEach(article.props.children, (child) => {
            if (child.type === 'h2' && temp.length > 0) {
                timelineItems.push(<Timeline.Item key={i}>{temp}</Timeline.Item>);
                temp = [];
                i += 1;
            }
            temp.push(child);
        });
        if (temp.length > 0) {
            timelineItems.push(<Timeline.Item key={i}>{temp}</Timeline.Item>);
        }
        return cloneElement(article, {
            children: <Timeline>{timelineItems}</Timeline>,
        });
    }

    render() {
        const {
            meta,
            content,
            description,
            toc,
        } = this.props;
        const { title, subtitle } = meta;
        const {
            intl: { locale },
        } = this.context;
        return (
            <DocumentTitle title={`${title} - ${config.title}`}>
                <article className="markdown">
                    <h1>
                        {title[locale] || title}
                        {!subtitle || locale === 'en-US' ? null : <span className="subtitle">{subtitle}</span>}
                    </h1>
                    {!description
                        ? null
                        : toReactComponent(
                            ['section', { className: 'markdown' }].concat(getChildren(description)),
                        )}
                    {!toc || toc.length <= 1 ? null : (
                        <Affix className="toc-affix" offsetTop={16}>
                            {toReactComponent(
                                ['ul', { className: 'toc' }].concat(getChildren(toc)),
                            )}
                        </Affix>
                    )}
                    {this.getArticle(
                        toReactComponent(
                            ['section', { className: 'markdown' }].concat(getChildren(content)),
                            converters,
                        ),
                    )}
                    {toReactComponent(
                        [
                            'section',
                            {
                                className: 'markdown api-container',
                            },
                        ].concat(getChildren(content.api || ['placeholder'])),
                    )}
                </article>
            </DocumentTitle>
        );
    }
}
