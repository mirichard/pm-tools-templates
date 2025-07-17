// Shared Babel configuration enforcing automatic JSX runtime across environments
module.exports = function(api) {
  api.cache(true);
  return {
    presets: [
      [
        require('babel-preset-react-app'),
        {
          runtime: 'automatic',
        },
      ],
    ],
  };
};

