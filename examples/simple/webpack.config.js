import path from "path"
import webpack from "webpack"

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
    filename : "[name].js",
  },

  resolve : {
    extensions : [
      "",
      ".js",
    ],
    alias : {
      "react" : path.resolve(__dirname, "../../node_modules/react"),
    },
  },

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
}

module.exports = config
