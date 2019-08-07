const fs = require('fs');
/**
 * 生成文件
 * @param {string} file - 要创建的文件名
 * @param {string} raw - 写入的文件内容
 */
const touch = (file, raw) => new Promise(async (resolve, reject) => {
    const content = raw;
    const stream = fs.createWriteStream(file);
    stream.write(content, 'utf-8');
    stream.on('finish', () => resolve());
    stream.on('error', err => reject(err));
    stream.end();
});

module.exports = touch;
