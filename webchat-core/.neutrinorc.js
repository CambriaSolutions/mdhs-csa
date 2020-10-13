const airbnb = require('@neutrinojs/airbnb');
const reactComponents = require('@neutrinojs/react-components');
const jest = require('@neutrinojs/jest');

require('dotenv').config()
const { EnvironmentPlugin } = require('webpack')

module.exports = {
  use: [
    airbnb({
      eslint: {
        rules: {
          semi: 'off',
          'babel/semi': 'off',
          'react/destructuring-assignment': 'off',
          'operator-linebreak': 'off',
          'no-else-return': 'off',
          indent: 'off',
          'comma-dangle': 'off',
          'jsx-quotes': 'off',
          'linebreak-style': 0,
          'import/prefer-default-export': 'off',
          'react/jsx-filename-extension': 'off',
          'react/no-array-index-key': 'off',
          'react/prefer-stateless-function': 'off',
          'no-restricted-syntax': 'off',
          'arrow-body-style': 'off',
          'react/prop-types': 'off',
          'no-shadow': 'off',
          'arrow-parens': 'off',
          'object-curly-newline': 'off',
          'guard-for-in': 'off',
          'class-methods-use-this': 'off',
          'function-paren-newline': 'off',
          'no-console': 'off',
          'no-unused-vars': 'warn',
          'consistent-return': 'warn',
          'max-len': 'warn',
          'no-underscore-dangle': 'off',
          'react/jsx-boolean-value': 'warn'
        },
      },
    }),
    reactComponents({
      html: {
        appMountId: 'cambria-chatframe',
      },
    }),
    jest(),
    // Required to enable the use of an env file in neutrino
    neutrino => {
      neutrino.config.plugin('env').use(EnvironmentPlugin, [
        {
          REACT_APP_GOOGLE_MAPS_KEY: process.env.REACT_APP_GOOGLE_MAPS_KEY,
          REACT_APP_EVENT_URL: process.env.REACT_APP_EVENT_URL,
          REACT_APP_TEXT_URL: process.env.REACT_APP_TEXT_URL,
          REACT_APP_FEEDBACK_URL: process.env.REACT_APP_FEEDBACK_URL
        },
      ])
    },
  ],
}
