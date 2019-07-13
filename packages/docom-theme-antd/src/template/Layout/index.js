import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { addLocaleData, IntlProvider } from 'react-intl';
import 'moment/locale/zh-cn';
import { LocaleProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import 'antd/dist/antd.css';

import themeConfig from '@theme/theme.config';

import Header from './Header';
import * as utils from '../utils';
import enLocale from '../../en-US';
import cnLocale from '../../zh-CN';
import '../../static/style';
import MainContent from '../Content/MainContent';

export default class BasicLayout extends React.Component {
  constructor(props) {
    super(props);
    const { pathname } = props.location;
    const appLocale = utils.isZhCN(pathname) ? cnLocale : enLocale;
    addLocaleData(appLocale.data);

    this.state = {
      appLocale,
    };
  }

  render() {
    const { appLocale } = this.state;
    const { children, source, ...restProps } = this.props;
    const navs = Object.keys(source).map(module => {
      const { index: { meta: { title } } } = source[module];
      return {
        title,
        // pathname: `${module}/index`,
        pathname: module,
      };
    });
    return (
      <IntlProvider locale={appLocale.locale} messages={appLocale.messages}>
        <LocaleProvider locale={appLocale.locale === 'zh-CN' ? zhCN : null}>
          <div className="page-wrapper">
            <Header navs={navs} {...restProps} />
            <Switch>
              <Route path="/components/:children" render={(props) => {
                console.log(props);
                return <MainContent key={props.match.params.children} themeConfig={themeConfig} {...props} {...this.props} />;
              }} />
            </Switch>
          </div>
        </LocaleProvider>
      </IntlProvider>
    );
  }
}
