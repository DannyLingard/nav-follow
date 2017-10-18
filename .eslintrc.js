module.exports = {
    "parser": "babel-eslint",
    "extends": "airbnb",
    "rules": {
        // "react/forbid-prop-types": [2, { forbid: ['any', 'array', 'object'] }],
        "react/forbid-prop-types": [0],
        "react/no-unknown-property": [2, { ignore: ["class", "for"] }],
        // "react/no-unused-prop-types": [2, { skipShapeProps: ["PropTypes.dispatch", "match", "PropTypes"] }],
        "react/no-unused-prop-types": [0],
        "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
        "import/no-extraneous-dependencies": [2, { devDependencies: true }],
        "linebreak-style": "off",
        "no-console": 0,
        // "no-confusing-arrow": ["error", {"allowParens": true}],
        "no-confusing-arrow": 0,
        "no-use-before-define": 0,
    },
    "globals": {
        "document": false
    },
    "env": {
        "browser": true
    }
};