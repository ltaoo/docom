/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint jsx-a11y/no-noninteractive-element-interactions: 0 */
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import CopyToClipboard from 'react-copy-to-clipboard';
import classNames from 'classnames';
import { Icon, Tooltip } from 'antd';

import toReactComponent from 'jsonml-to-react-element';

const converters = [
    [
        node => typeof node === 'function',
        (node, index) => React.cloneElement(node(), { key: index }),
    ],
];

export default class Demo extends React.Component {
  static contextTypes = {
      intl: PropTypes.object,
  };

  state = {
      codeExpand: false,
      copied: false,
      copyTooltipVisible: false,
  };

  componentDidMount() {
      const { meta, location } = this.props;
      if (meta.id === location.hash.slice(1)) {
          this.anchor.click();
      }
  }

  shouldComponentUpdate(nextProps, nextState) {
      const { codeExpand, copied, copyTooltipVisible } = this.state;
      const { expand } = this.props;
      return (
          (codeExpand || expand) !== (nextState.codeExpand || nextProps.expand)
      || copied !== nextState.copied
      || copyTooltipVisible !== nextState.copyTooltipVisible
      );
  }

  getSourceCode() {
      const { highlightedCode } = this.props;
      if (typeof document !== 'undefined') {
          //   const div = document.createElement('div');
          //   console.log(highlightedCode);
          //   div.innerHTML = highlightedCode[2][1];
          //   return div.textContent;
          return highlightedCode[2][1];
      }
      return '';
  }

  handleCodeExpand = () => {
      const { codeExpand } = this.state;
      this.setState({ codeExpand: !codeExpand });
  };

  saveAnchor = (anchor) => {
      this.anchor = anchor;
  };

  handleCodeCopied = () => {
      this.setState({ copied: true });
  };

  onCopyTooltipVisibleChange = (visible) => {
      if (visible) {
          this.setState({
              copyTooltipVisible: visible,
              copied: false,
          });
          return;
      }
      this.setState({
          copyTooltipVisible: visible,
      });
  };

  render() {
      const { state } = this;
      const { props } = this;
      console.log(props);
      const {
          meta, preview, content, highlightedCode, style, highlightedStyle, expand,
      } = props;
      if (!this.liveDemo) {
          this.liveDemo = preview(React, ReactDOM);
      }
      const { copied } = state;
      const codeExpand = state.codeExpand || expand;
      const codeBoxClass = classNames('code-box', {
          expand: codeExpand,
          'code-box-debug': meta.debug,
      });
      const {
          intl: { locale },
      } = this.context;
      const localizedTitle = meta.title[locale] || meta.title;
      const localizeIntro = content[locale] || content;
      const introChildren = toReactComponent(['div'].concat(localizeIntro), converters);

      const highlightClass = classNames({
          'highlight-wrapper': true,
          'highlight-wrapper-expand': codeExpand,
      });

      const sourceCode = this.getSourceCode();
      console.log(sourceCode);

      return (
          <section className={codeBoxClass} id={meta.id}>
              <section className="code-box-demo">
                  {this.liveDemo}
                  {style ? (
                    <style dangerouslySetInnerHTML={{ __html: style }} /> // eslint-disable-line
                  ) : null}
              </section>
              <section className="code-box-meta markdown">
                  <div className="code-box-title">
                      <Tooltip title={meta.debug ? <FormattedMessage id="app.demo.debug" /> : ''}>
                          <a href={`#${meta.id}`} ref={this.saveAnchor}>
                              {localizedTitle}
                          </a>
                      </Tooltip>
                  </div>
                  <div className="code-box-description">{introChildren}</div>
                  <div className="code-box-actions">
                      <CopyToClipboard text={sourceCode} onCopy={() => this.handleCodeCopied(meta.id)}>
                          <Tooltip
                              visible={state.copyTooltipVisible}
                              onVisibleChange={this.onCopyTooltipVisibleChange}
                              title={<FormattedMessage id={`app.demo.${copied ? 'copied' : 'copy'}`} />}
                          >
                              <Icon
                                  type={state.copied && state.copyTooltipVisible ? 'check' : 'snippets'}
                                  className="code-box-code-copy"
                              />
                          </Tooltip>
                      </CopyToClipboard>
                      <Tooltip
                          title={<FormattedMessage id={`app.demo.code.${codeExpand ? 'hide' : 'show'}`} />}
                      >
                          <span className="code-expand-icon">
                              <img
                                  alt="expand code"
                                  src="https://gw.alipayobjects.com/zos/rmsportal/wSAkBuJFbdxsosKKpqyq.svg"
                                  className={codeExpand ? 'code-expand-icon-hide' : 'code-expand-icon-show'}
                                  onClick={() => this.handleCodeExpand(meta.id)}
                              />
                              <img
                                  alt="expand code"
                                  src="https://gw.alipayobjects.com/zos/rmsportal/OpROPHYqWmrMDBFMZtKF.svg"
                                  className={codeExpand ? 'code-expand-icon-show' : 'code-expand-icon-hide'}
                                  onClick={() => this.handleCodeExpand(meta.id)}
                              />
                          </span>
                      </Tooltip>
                  </div>
              </section>
              <section className={highlightClass} key="code">
                  <div className="highlight">{toReactComponent(highlightedCode, converters)}</div>
                  {highlightedStyle ? (
                      <div key="style" className="highlight">
                          <pre>
                              <code className="css" dangerouslySetInnerHTML={{ __html: highlightedStyle }} />
                          </pre>
                      </div>
                  ) : null}
              </section>
          </section>
      );
  }
}
