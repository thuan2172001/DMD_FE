const { removeModuleScopePlugin } = require('customize-cra');
const webpack = require('webpack');
module.exports = function override(config, env) {
  removeModuleScopePlugin()(config);

  config.module.rules.forEach((rule) => {
    if (rule.oneOf) {
      rule.oneOf.forEach((oneOfRule) => {
        if (oneOfRule?.test?.toString()?.includes('.mjs')) {
          oneOfRule.resolve = {
            ...oneOfRule.resolve,
            fullySpecified: false,
          };
        }
      });
    }
  });
  
  config.resolve.fullySpecified = false;

  config.resolve.fallback = {
    // url: require.resolve('url'),
    // fs: require.resolve('fs'),
    // assert: require.resolve('assert'),
    crypto: require.resolve('crypto-browserify'),
    // http: require.resolve('stream-http'),
    // https: require.resolve('https-browserify'),
    // os: require.resolve('os-browserify/browser'),
    // process: require.resolve('process/browser'),
    process: require.resolve('process/browser.js'), // 
    buffer: require.resolve('buffer'),
    stream: require.resolve('stream-browserify'),
    util: require.resolve("util/"),
    querystring: require.resolve("querystring-es3")
  };
  config.plugins.push(
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
    }),
  );

  return config;
}