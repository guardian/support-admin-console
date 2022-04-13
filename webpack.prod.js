// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const TSConfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
  entry: './public/src/main.tsx',
  output: {
    path: path.resolve(__dirname, './public/build'),
    filename: 'app.bundle.js',
  },
  module: {
    rules: [
      {
        test: /^(?!.*\.spec\.tsx?$).*\.tsx?$/,
        use: 'ts-loader',
        exclude: [/node_modules/, /cdk/],
      },
      {
        test: /\.(scss|css)$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
    ],
  },
  resolve: {
    modules: [path.resolve(__dirname, 'src'), 'node_modules'],
    plugins: [new TSConfigPathsPlugin()],
    extensions: ['.ts', '.tsx', '.js'],
  },

  mode: 'production',
  devtool: 'cheap-module-eval-source-map',
};
