import path from 'path';
import TSConfigPathsPlugin from 'tsconfig-paths-webpack-plugin';

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
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    modules: [path.resolve(__dirname, 'src'), 'node_modules'],
    plugins: [new TSConfigPathsPlugin()],
    extensions: ['.ts', '.tsx', '.js'],
  },

  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    contentBase: path.join(__dirname, '/public/build'),
    compress: true,
    port: 9001,
    publicPath: '/public/build',
  },
};
