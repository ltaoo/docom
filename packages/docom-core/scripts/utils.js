const fs = require('fs');
const path = require('path');

const marktwain = require('mark-twain');
const R = require('ramda');
const glob = require('glob');
const _ = require('lodash');

/**
 * 处理配置项
 * @param {Config} conf 
 */
function format(conf) {
  const { modules } = conf;
  return {
    ...conf,
    modules: Object.keys(modules).map(key => {
      const module = modules[key];
      return {
        ...module,
        key,
        absolutePath: path.resolve(module.path),
      };
    }),
  };
}

const globConfig = {
  ignore: ['**/node_modules/**'],
  onlyFiles: true,
  unique: true,
  nocase: true,
  matchBase: true,
};

function collectFiles(module, files = ['**/*.md']) {
  const { path: modulePath } = module;
  const searchPath = path.resolve(modulePath);
  return glob.sync(files, { ...globConfig, cwd: searchPath });
}

/**
 * @param {ModuleConfig} module
 * @param {Array<FileName>} files - glob 查找到的文件名
 * @return {Modules}
 */
function getLastFileTree(module, files) {
  const { key, path: modulePath } = module;
  const removedPrefixModulePath = path.join(modulePath);
  const prefixedFiles = files
    .map(file => path.join(removedPrefixModulePath, file));

  const fileTree = filesToTreeStructure(prefixedFiles, [removedPrefixModulePath]);
  const modulePaths = removedPrefixModulePath.split(path.sep).join('.');
  return {
    [key]: _.get(fileTree, modulePaths),
  };
}

/**
 * 根据配置项中的 modules 遍历出 md 文件
 * interface Modules {
 *   [key: string]: Module;
 * }
 * interface Module {
 *   title: string;
 *   path: string;
 * }
 * interface FileTree {
 *   [moduleName: string]: Files;
 * }
 * interface Files {
 *   [fileName: string]: RelativePath;
 * }
 * @param {Modules} modules - 配置项中的 modules
 * @param {Array<string>} files - 配置项中的 files
 * @return {FileTree}
 */
function getFileTree(modules, files) {
  return modules
    .map(module => {
      const searchedFiles = collectFiles(module, files);
      return getLastFileTree(module, searchedFiles);
    })
    .reduce((files, module) => {
      return { ...files, ...module };
    }, {});
}

function toMatch(conf) {
  const { modules } = conf;
  const patterns = modules.map(module => {
    const modulePath = module.path;
    return modulePath;
  });
  return patterns;
}

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
  return filenames.reduce((subFilesTree, filename) => {
      const params = getPropPath(filename, cleanedSources);
      const propLens = R.lensPath(params);
      // const lastFilename = `{{path.resolve(filename).replace(process.cwd(), '@root')}}`;
      // 第一个参数是 a.b.c 第二个参数是 value，第三个参数是要写的对象
      return R.set(propLens, filename, subFilesTree);
  }, {});
}

/**
 * 递归处理 md 文件路径
 * @param {FileTree} fileTree
 */
function processRelativePath(fileTree) {
  function foo(tree, callback, file) {
    if (typeof tree === 'string') {
      return callback(tree, file);
    }
    return Object.keys(tree)
      .map(key => {
        const module = tree[key];
        return {
          [key]: foo(module, callback, key),
        };
      })
      .reduce((files, pathname) => {
        return {
          ...files,
          ...pathname,
        };
      }, {});
  }
  return (action) => {
    return foo(fileTree, action);
  };
}

/**
 * 给路径增加前缀
 * @param {FileTree} fileTree 
 * @param {string} prefix 
 * @return {FileTree}
 */
function addRootAlias(fileTree, prefix) {
  return processRelativePath(fileTree)((relativePath) => {
    return prefix + relativePath;
  });
}

function addPlaceholder(fileTree) {
  return processRelativePath(fileTree)((relativePath) => {
    return `{{${relativePath}}}`;
  });
}

const touch = (file, raw) => new Promise(async (resolve, reject) => {
  const content = raw;
  const stream = fs.createWriteStream(file);
  stream.write(content, 'utf-8');
  stream.on('finish', () => resolve());
  stream.on('error', err => reject(err));
  stream.end();
});

function createImportsContent(fileTree) {
  const text = JSON.stringify(fileTree, null, '  ')
    // .replace(/"/g, '')
    .replace(/\{\{(.*)\}\}/g, function(match, p) {
      return `() => import('${p}')`;
    })
    .replace(/"(\(.*\))"/g, function(match, p) {
      return p;
    })
  return `module.exports = ${text}`;
}

function createImportsFile(fileTree) {
  const source = addPlaceholder(addRootAlias(fileTree, '@root/'));
  fs.mkdir(path.resolve(process.cwd(), '.docom'), (err) => {
    const content = createImportsContent(source);
    touch(path.resolve(process.cwd(), '.docom/imports.js'), content);
  });
}

function removePrefixPath(pathname) {
  return pathname.replace(/^\.\//g, '');
}

/**
 * 
 * @param {string} filepath 
 * @param {Array<string>} sources 
 */
function normalizeFilePath(filepath, sources) {
  const source = sources.find(source => {
    // @TODO 可能有平台差异
    const pathname = removePrefixPath(source.path);
    return filepath.indexOf(pathname) > -1;
  });
  if (source === undefined) {
    return filepath;
  }
  return filepath.replace(removePrefixPath(source.path), source.key);
}

function createSourceFile(fileTree, config) {
  const content = processRelativePath(fileTree)((relativePath, fileName) => {
    const absolutePath = path.resolve(process.cwd(), relativePath);
    // 在这里解析完返回？
    const mdContent = marktwain(fs.readFileSync(absolutePath, 'utf-8'));
    mdContent.meta.realpath = relativePath;
    mdContent.meta.filename = normalizeFilePath(relativePath, config.modules);
    return mdContent;
  });
  fs.mkdir(path.resolve(process.cwd(), '.docom'), (err) => {
    touch(path.resolve(process.cwd(), '.docom/source.json'), JSON.stringify(content));
  });
}

module.exports = {
  format,
  toMatch,
  filesToTreeStructure,
  getFileTree,
  getLastFileTree,
  createImportsFile,
  addRootAlias,
  addPlaceholder,
  createImportsContent,
  createSourceFile,
  normalizeFilePath,
};
