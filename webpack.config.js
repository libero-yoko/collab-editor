import path from 'path';

export default {
  entry: '/client/index.js',
  output: {
    path: path.resolve('./', 'build'),
    filename: 'bundle.js',
  },
  mode: process.env.NODE_ENV,
  module: {
    rules: [
      {
        test: /\.jsx?/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader',
        ],
      },
    ],
  },
  devServer: {
    static: {
      directory: path.join('./', 'client'),
    },
    proxy: {
      '/**': {
        target: 'http://localhost:3000',
        secure: false,
      },
    },
    port: 8080,
    hot: true,
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
};