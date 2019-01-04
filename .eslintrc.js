module.exports = {
    root: true,
    extends: ['webpack'],
    globals: {
        document: true
    },
    rules: {
        'class-methods-use-this': 'off',
        'no-undefined': 'off',
    },
};
