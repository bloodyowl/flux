import path from "path"
import webpack from "webpack"
import { version as __VERSION__ } from "./package.json"

const config = {

  colors : true,
  progress : true,

  entry : {
    index : [
      "./src/index",
    ],
  },
  output : {
    path : path.resolve(__dirname, "dist"),
    library : "Flux",
    libraryTarget : "umd",
    filename : "[name].js",
  },

  resolve : {
    extensions : [
      "",
      ".js",
    ],
  },

  plugins : [
    new webpack.DefinePlugin({
      __VERSION__ : `"${__VERSION__}"`,
    })
  ],

  module : {
    loaders : [
      {
        test : /\.js$/,
        loaders : [
          // the `playground` option is used for ES7 class property
          // initializers
          "babel?experimental&playground",
        ],
        exclude : /node_modules/,
      },
    ],
  },

  externals: [
    {
      "react": {
        root: "React",
        commonjs2: "react",
        commonjs: "react",
        amd: "react"
      }
    }
  ],
}

module.exports = config
