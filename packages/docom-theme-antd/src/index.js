const path = require('path');

const homeTmpl = './template/Home/index';
const contentTmpl = './template/Content/index';

module.exports = {
  plugins: [
    'bisheng-plugin-description',
    'bisheng-plugin-toc?maxDepth=2&keepElem',
    'bisheng-plugin-antd?injectProvider',
  ],
};
