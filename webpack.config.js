

module.exports = {
  mode: "development",
  entry: '../src/index.tsx',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/dist/'
  },
  module: {
    loaders: [
      {
        test: /\.(ts|tsx)?$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  }
}