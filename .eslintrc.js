module.exports = {
    env: {
        browser: false,
        es6: true,
        amd: true,
        node: true,
        mocha: true
    },
    "parserOptions": {
        "ecmaVersion": 2017
    },
    extends: "eslint:recommended",
    rules: {
        indent: ["error", "tab"],
        "linebreak-style": ["error", "unix"],
        quotes: ["error", "double"],
        semi: ["error", "always"],
        "comma-dangle": ["error", "always-multiline"],
        "no-await-in-loop": 2,
        "no-cond-assign": ["error", "always"],
        "no-console": "off"
    }
}
