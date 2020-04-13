module.exports = {
    root: true,
    env: {
      "browser": true,
      "node": true,
      "commonjs": true,
      "jquery": true,
      "es6": true
    },
    'extends': [
      'eslint:recommended',
    ],
    rules: {
      "arrow-parens": "off",
      "valid-jsdoc": "off",
      "eol-last": "off",
      "array-bracket-spacing": "off",
      "no-unused-vars": "off",
      "no-else-return": "off",
      "no-bitwise": "off",
      "semi": [2, "always"],
      "strict": "off",
      "no-irregular-whitespace": [
        "error",
        {
          "skipComments": true
        }
      ],
      "comma-dangle": [
        "error",
        {
          "arrays": "only-multiline",
          "objects": "only-multiline"
        }
      ],
      "no-new-func": "off",
      'no-console': 'off',
      'no-debugger': 'off',
    },
    parserOptions: {
      "parser": "babel-eslint",
      "sourceType": "module"
    },
    globals: {
      "EASY_ENV_IS_PROD": true,
      "EASY_ENV_IS_NODE": true,
      "EASY_ENV_IS_BROWSER": true,
      "localRequire": true,
      "Raven": true,
      "Monitor": true
    },
  }
  