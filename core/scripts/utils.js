const path = require('path');

const R = require('ramda');
const glob = require('glob');
const _ = require('lodash');

function format(conf) {
  const { modules } = conf;
  return {
    ...conf,
    modules: Object.keys(modules).map(key => {
      const module = modules[key];
      return {
        ...module,
        key,
        // path: path.resolve(module.path),
      };
    }),
  };
}

function getFileTree(modules, files) {
  const allFile = modules
    .map(module => {
      const { key, path: modulePath } = module;
      const removedPrefixModulePath = path.join(modulePath);
      const searchPath = path.resolve(module.path);
      const searchedFiles = glob.sync(files, { ...globConfig, cwd: searchPath });
      const prefixedFiles = searchedFiles
        .map(file => path.join(removedPrefixModulePath, file));
      const fileTree = filesToTreeStructure(prefixedFiles, [removedPrefixModulePath]);
      const modulePaths = removedPrefixModulePath.split(path.sep).join('.');
      return {
        [key]: _.get(fileTree, modulePaths),
      };
    })
    .reduce((files, module) => {
      return { ...files, ...module };
    }, {});
  return allFile;
}

function toMatch(conf) {
  const { modules } = conf;
  const patterns = modules.map(module => {
    const modulePath = module.path;
    return modulePath;
  });
  return patterns;
}

const globConfig = {
  ignore: ['**/node_modules/**'],
  onlyFiles: true,
  unique: true,
  nocase: true,
  matchBase: true,
};
function getPropPath(filename, sources) {
  return sources.reduce(
      (f, source) => {
        return f;
      },
      // (f, source) => f.replace(source.path, source.key),
      filename.replace(new RegExp(`${path.extname(filename)}$`), ''),
  ).replace(/^\.?(?:\\|\/)+/, '').split('/');
}

/**
 * 
 * @param {Array<Filename>} filenames 
 * @param {*} sources 
 * @return {FileTree}
 */
function filesToTreeStructure(filenames, sources) {
  const cleanedSources = sources.map(source => {
    return source.replace(/^\.?(?:\\|\/)/, '');
  });
  const filesTree = filenames.reduce((subFilesTree, filename) => {
      const params = getPropPath(filename, cleanedSources);
      const propLens = R.lensPath(params);
      const lastFilename = `{${path.resolve(filename).replace(process.cwd(), '@root')}}`;
      // 第一个参数是 a.b.c 第二个参数是 value，第三个参数是要写的对象
      return R.set(propLens, lastFilename, subFilesTree);
  }, {});
  return filesTree;
}


module.exports = {
  format,
  toMatch,
  filesToTreeStructure,
  getFileTree,
};
