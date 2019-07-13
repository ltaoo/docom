import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import {
  Select, Menu, Row, Col, Icon, Popover, Input, Button,
} from 'antd';
// import docsearch from 'docsearch.js';

import { antdVersion, logoImg, logoTitle, logoTitleImg } from '../../constants';
import * as utils from '../utils';

const { Option } = Select;

// function initDocSearch(locale) {
//   if (!docsearch) {
//     return;
//   }
//   const lang = locale === 'zh-CN' ? 'cn' : 'en';
//   docsearch({
//     apiKey: '60ac2c1a7d26ab713757e4a081e133d0',
//     indexName: 'ant_design',
//     inputSelector: '#search-box input',
//     algoliaOptions: { facetFilters: [`tags:${lang}`] },
//     transformData(hits) {
//       hits.forEach((hit) => {
//         hit.url = hit.url.replace('ant.design', window.location.host); // eslint-disable-line
//         hit.url = hit.url.replace('https:', window.location.protocol); // eslint-disable-line
//       });
//       return hits;
//     },
//     debug: false, // Set debug to true if you want to inspect the dropdown
//   });
// }

export default class Header extends React.Component {
  static contextTypes = {
    router: PropTypes.object.isRequired,
    intl: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      menuVisible: false,
    };
  }

  componentDidMount() {
    // const { intl, router } = this.context;
    // router.listen(this.handleHideMenu);
    // const { searchInput } = this;
    // document.addEventListener('keyup', (event) => {
    //   if (event.keyCode === 83 && event.target === document.body) {
    //     searchInput.focus();
    //   }
    // });
    // initDocSearch(intl.locale);
  }

  onMenuVisibleChange = (visible)  => {
    this.setState({
      menuVisible: visible,
    });
  }

  handleHideMenu = () => {
    this.setState({
      menuVisible: false,
    });
  }

  handleShowMenu = () => {
    this.setState({
      menuVisible: true,
    });
  }

  /**
   * 切换版本
   */
  handleVersionChange = (url) => {
    const currentUrl = window.location.href;
    const currentPathname = window.location.pathname;
    window.location.href = currentUrl
      .replace(window.location.origin, url)
      .replace(currentPathname, utils.getLocalizedPathname(currentPathname));
  }

  /**
   * 改变语言
   */
  handleLangChange = () => {
    const {
      location: { pathname },
    } = this.props;
    const currentProtocol = `${window.location.protocol}//`;
    const currentHref = window.location.href.substr(currentProtocol.length);

    if (utils.isLocalStorageNameSupported()) {
      localStorage.setItem('locale', utils.isZhCN(pathname) ? 'en-US' : 'zh-CN');
    }

    window.location.href = currentProtocol
      + currentHref.replace(
        window.location.pathname,
        utils.getLocalizedPathname(pathname, !utils.isZhCN(pathname)),
      );
  }

  render() {
    const { menuVisible } = this.state;
    const { location, navs } = this.props;

    const menuMode = 'horizontal';
    const module = location.pathname
      .replace(/(^\/|\/$)/g, '');
      // .split('/')
      // .slice(0, -1)
      // .join('/');
    const activeMenuItem = module;
    const {
      intl: { locale },
    } = this.context;
    const isZhCN = locale === 'zh-CN';

    const headerClassName = classNames({
      clearfix: true,
    });

    const menu = [
      <Menu
        className="menu-site"
        mode={menuMode}
        selectedKeys={[activeMenuItem]}
        id="nav"
        key="nav"
      >
        {
          navs.map(nav => (
            <Menu.Item key={nav.pathname} className="hide-in-home-page">
              <Link to={utils.getLocalizedPathname(nav.pathname, isZhCN)}>
                {nav.title}
              </Link>
            </Menu.Item>
          ))
        }
      </Menu>,
    ];

    // @TODO: 支持多语言
    const searchPlaceholder = locale === 'zh-CN' ? '搜索' : 'Search';
    return (
      <header id="header" className={headerClassName}>
        <Row>
          <Col xxl={4} xl={5} lg={5} md={5} sm={24} xs={24}>
            <Link to={utils.getLocalizedPathname('/', isZhCN)} id="logo">
              <img
                alt="logo"
                src={logoImg}
              />
              <img
                alt={logoTitle}
                src={logoTitleImg}
              />
              {/* <Santa /> */}
            </Link>
          </Col>
          <Col xxl={20} xl={19} lg={19} md={19} sm={0} xs={0}>
            {/* <div id="search-box">
              <Icon type="search" />
              <Input
                ref={(ref) => {
                  this.searchInput = ref;
                }}
                placeholder={searchPlaceholder}
              />
            </div> */}
            {menu}
          </Col>
        </Row>
      </header>
    );
  }
}
