/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import webpackPreprocessor from '@cypress/webpack-preprocessor';
const webpackOptions = require('find-webpack').getWebpackOptions();


export default (on, config) => {
  
  on(
    'file:preprocessor',
    webpackPreprocessor({ webpackOptions })
  );

  require('@cypress/code-coverage/task')(on, config);

  return Object.assign({}, config, {
    fixturesFolder: 'test/cypress/fixtures',
    integrationFolder: 'test/cypress/integration',
    screenshotsFolder: 'test/cypress/screenshots',
    videosFolder: 'test/cypress/videos',
    supportFile: 'test/cypress/support/index.js'
  });
};