const path = require('path');

const config = require('../docom.config');
const {
  format,
  getFileTree,
} = require('../scripts/utils');

const formattedConfig = format(config);
// 
const allFile = getFileTree(formattedConfig.modules, formattedConfig.files);
console.log(allFile);
