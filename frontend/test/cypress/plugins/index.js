const webpackPreprocessor = require("@cypress/webpack-preprocessor");
const webpackOptions = require("find-webpack").getWebpackOptions();


module.exports = (on, config) => {
  
  on(
    "file:preprocessor",
    webpackPreprocessor({ webpackOptions })
  );

  require("@cypress/code-coverage/task")(on, config);

  return Object.assign({}, config, {
    fixturesFolder: "test/cypress/fixtures",
    integrationFolder: "test/cypress/integration",
    screenshotsFolder: "test/cypress/screenshots",
    videosFolder: "test/cypress/videos",
    supportFile: "test/cypress/support/index.js"
  });
};