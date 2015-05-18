import path from "path"

import webpack from "webpack"
// import WebpackDevServer from "webpack-dev-server"
// import eslintFormatter from "eslint-friendly-formatter"

import variables, {defineGlobalVariables} from "./variables"
defineGlobalVariables()

const production = process.argv.includes("--production")

const index = `index.${__VERSION__}`
var config = {
  entry: {
    tests: [
      "./src/tests.js",
    ],
    [index]: [
      "./src/index.js",
    ],
  },

  output: {
    path: path.join(__dirname, "dist"),
    filename: `[name]${production ? ".min" : ""}.js`,
    publicPath: "/",
  },

  resolve: {
    extensions: [
      "",
      ".js",
      ".es",
      ".jsx",
      ".css",
    ],
  },

  module: {
    // ! \\ note that loaders are executed from bottom to top !
    loaders: [
      {
        test: /\.(jsx?|es)$/,
        loaders: [
          "babel?" + JSON.stringify({
            stage: 0,
          }),
          "eslint",
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.json$/,
        loaders: [
          "json",
        ],
      },
      {
        test: /\.html$/,
        loaders: [
          "file?name=[path][name].[ext]&context=./src",
        ],
      },
    ],
  },

  plugins: [
    new webpack.DefinePlugin(variables),
    ...(production ?
        [
          new webpack.optimize.UglifyJsPlugin({
            compress: {
              warnings: false,
            },
          }),
        ] :
        []
    ),
  ],

  node: {
    // https://github.com/webpack/webpack/issues/451
    // run tape test with webpack
    fs: "empty",
  },

  eslint: {
    // https://github.com/royriojas/eslint-friendly-formatter/issues/3
    //reporter: eslintFormatter,
  },
}

export default config
