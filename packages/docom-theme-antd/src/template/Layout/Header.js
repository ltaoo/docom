import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import {
    Menu, Row, Col,
} from 'antd';

import config from '@root/docom.config';

import * as utils from '../utils';

const { logo, title, subtitle } = config;

export default class Header extends React.Component {
    static contextTypes = {
        router: PropTypes.object.isRequired,
        intl: PropTypes.object.isRequired,
    };

    constructor(props) {
        super(props);

        const { source } = props;
        this.navs = Object.keys(source).map((module) => {
            const { index: { meta: { title: pageTitle } } } = source[module];
            return {
                title: pageTitle,
                pathname: module,
            };
        });
    }

    render() {
        const { location } = this.props;

        const menuMode = 'horizontal';
        const module = location.pathname
            .replace(/(^\/|\/$)/g, '')
            .split('/')[0];
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
                    this.navs.map(nav => (
                        <Menu.Item key={nav.pathname} className="hide-in-home-page">
                            <Link to={`/${nav.pathname}/index`}>
                                {nav.title}
                            </Link>
                        </Menu.Item>
                    ))
                }
            </Menu>,
        ];

        return (
            <header id="header" className={headerClassName}>
                <Row>
                    <Col xxl={4} xl={5} lg={5} md={5} sm={24} xs={24}>
                        <Link to={utils.getLocalizedPathname('/', isZhCN)} id="logo">
                            <img
                                alt="logo"
                                src={logo}
                            />
                            <img
                                alt={title}
                                src={subtitle}
                            />
                        </Link>
                    </Col>
                    <Col xxl={20} xl={19} lg={19} md={19} sm={0} xs={0}>
                        {menu}
                    </Col>
                </Row>
            </header>
        );
    }
}
