const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const config = {
  mode: 'production',
  entry: './transducers.js',
  output: {
    filename: './dist/transducers.js',
    library: 'transducers',
  },
  plugins: [],
};

if (process.env.NODE_ENV === 'production') {
  Object.assign(config, {
    optimization: {
      minimizer: [
        new UglifyJsPlugin({
          uglifyOptions: {
            output: {
              comments: false,
              ascii_only: true,
            },
            compress: {
              comparisons: false,
            },
          },
        }),
      ],
    },
  });
}

module.exports = config;
