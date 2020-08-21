module.exports = {
  'env': {
    'browser': true,
    'commonjs': true,
    'es2020': true,
    'node': true
  },
  'extends': 'eslint:recommended',
  'parserOptions': {
    'ecmaVersion': 11
  },
  'ignorePatterns': ['*.test.js'],
  'rules': {
    'indent': [
      'error',
      2
    ],
    'quotes': [
      'error',
      'single'
    ],
    'semi': [
      'error',
      'never'
    ],
    'no-undefined': 'off',
    'no-unused-expressions': 'off',
    'no-unused-vars': 'warn'
  }
}
