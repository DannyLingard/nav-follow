module.exports = {
    "parser": "babel-eslint",
    "extends": "airbnb",
    "rules": {
        "import/no-extraneous-dependencies": [2, { devDependencies: true }],
        "linebreak-style": "off",
        "no-console": 0,
        // "no-confusing-arrow": ["error", {"allowParens": true}],
        "no-confusing-arrow": 0,
        "no-use-before-define": 0,
        "no-underscore-dangle": 0,
        "no-mixed-operators": 0,
    },
    "globals": {
        "document": false
    },
    "env": {
        "browser": true
    }
};