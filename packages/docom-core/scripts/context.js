const context = {};

module.exports.get = key => context[key];

module.exports.set = (key, value) => {
    context[key] = value;
};
