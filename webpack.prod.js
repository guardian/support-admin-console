// eslint-disable-next-line @typescript-eslint/no-require-imports
const path = require('path');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const TSConfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
  entry: './public/src/main.tsx',
  output: {
    path: path.resolve(__dirname, './public/build'),
    filename: 'app.bundle.js',
    chunkFilename: '[name].chunk.js',
    publicPath: '/assets/build/',
  },
  module: {
    rules: [
      {
        test: /\.m?js/,
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /^(?!.*\.spec\.tsx?$).*\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(css)$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: {
    modules: [path.resolve(__dirname, 'src'), 'node_modules'],
    plugins: [new TSConfigPathsPlugin()],
    extensions: ['.ts', '.tsx', '.js'],
  },

  mode: 'production',
  devtool: false,
};
