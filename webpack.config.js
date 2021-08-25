import path from 'path';

export default {
  entry: path.resolve('./', '/client/index.js',),
  output: {
    path: path.resolve('./', 'build'),
    filename: 'bundle.js',
  },
  // mode: process.env.NODE_ENV,
  mode: 'development',
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
        test: /\.css$/,
        use: [
          {loader: 'style-loader'},
          {loader: 'css-loader'},
          {loader: 'sass-loader'},
        ],
      },
    ],
  },

  devServer: {
    allowedHosts:[
      'avahq.github.io',
      'app.ava.me',
      'localhost'
    ],
    static: {
      directory:  path.resolve('./', '/client',),
    },
    proxy: {
      '/*': {
        target: 'http://localhost:3000',
        secure: false,
        changeOrigin: true,
      },
      '/conversations': {
        target: 'http://localhost:3000/',
        secure: false,
      },
      '/info': {
        target: 'http://localhost:3000/',
        secure: false,
      },
      '/mutations': {
        target: 'http://localhost:3000/',
        secure: false,
      }
    },
    port: 8080,
    hot: true,
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
};