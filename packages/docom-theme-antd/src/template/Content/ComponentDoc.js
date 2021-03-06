import React from 'react';
import PropTypes from 'prop-types';
import DocumentTitle from 'react-document-title';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import {
    Row, Col, Icon, Affix, Tooltip,
} from 'antd';
import { getChildren } from 'jsonml.js/lib/utils';

import toReactComponent from 'jsonml-to-react-element';

import Demo from './Demo';

const converters = [
    [
        node => typeof node === 'function',
        (node, index) => React.cloneElement(node(), { key: index }),
    ],
];

export default class ComponentDoc extends React.Component {
  static contextTypes = {
      intl: PropTypes.object,
  };

  state = {
      expandAll: false,
      showRiddleButton: false,
  };

  componentWillUnmount() {
      clearTimeout(this.pingTimer);
  }

  handleExpandToggle = () => {
      const { expandAll } = this.state;
      this.setState({
          expandAll: !expandAll,
      });
  };

  render() {
      const { props } = this;
      const { doc, location, demos } = props;
      const { content, meta } = doc;
      const {
          intl: { locale },
      } = this.context;
      const { expandAll, showRiddleButton } = this.state;

      const isSingleCol = meta.cols === 1;
      const leftChildren = [];
      const rightChildren = [];
      const showedDemo = demos;
      showedDemo
          .sort((a, b) => a.meta.order - b.meta.order)
          .forEach((demoData, index) => {
              const demoElem = (
                  <Demo
                      {...demoData}
                      key={demoData.meta.filename}
                      utils={props.utils}
                      expand={expandAll}
                      location={location}
                  />
              );
              if (index % 2 === 0 || isSingleCol) {
                  leftChildren.push(demoElem);
              } else {
                  rightChildren.push(demoElem);
              }
          });
      const expandTriggerClass = classNames({
          'code-box-expand-trigger': true,
          'code-box-expand-trigger-active': expandAll,
      });

      const jumper = showedDemo.map((demo) => {
          const { title } = demo.meta;
          const localizeTitle = title[locale] || title;
          return (
              <li key={demo.meta.id} title={localizeTitle}>
                  <a href={`#${demo.meta.id}`}>{localizeTitle}</a>
              </li>
          );
      });

      const { title, subtitle } = meta;
      const articleClassName = classNames({
          'show-riddle-button': showRiddleButton,
      });
      return (
          <DocumentTitle title={`${subtitle || ''} ${title[locale] || title} - Ant Design`}>
              <article className={articleClassName}>
                  <Affix className="toc-affix" offsetTop={16}>
                      <ul id="demo-toc" className="toc">
                          {jumper}
                      </ul>
                  </Affix>
                  <section className="markdown">
                      <h1>
                          {title[locale] || title}
                          {!subtitle ? null : <span className="subtitle">{subtitle}</span>}
                      </h1>
                      {toReactComponent(
                          ['section', { className: 'markdown' }].concat(getChildren(content)),
                          converters,
                      )}
                      <h2>
                          <FormattedMessage id="app.component.examples" />
                          <Tooltip
                              title={(
                                  <FormattedMessage
                                      id={`app.component.examples.${expandAll ? 'collpse' : 'expand'}`}
                                  />
                              )}
                          >
                              <Icon
                                  type={`${expandAll ? 'appstore' : 'appstore-o'}`}
                                  className={expandTriggerClass}
                                  onClick={this.handleExpandToggle}
                              />
                          </Tooltip>
                      </h2>
                  </section>
                  <Row gutter={16}>
                      <Col
                          span={isSingleCol ? 24 : 12}
                          className={isSingleCol ? 'code-boxes-col-1-1' : 'code-boxes-col-2-1'}
                      >
                          {leftChildren}
                      </Col>
                      {isSingleCol ? null : (
                          <Col className="code-boxes-col-2-1" span={12}>
                              {rightChildren}
                          </Col>
                      )}
                  </Row>
                  {toReactComponent(
                      [
                          'section',
                          {
                              className: 'markdown api-container',
                          },
                      ].concat(getChildren(doc.api || ['placeholder'])),
                      converters,
                  )}
              </article>
          </DocumentTitle>
      );
  }
}
