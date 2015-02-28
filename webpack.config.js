import path from "path"

const config = {

  colors : true,
  progress : true,

  entry : {
    index : [
      "./src/index",
    ],
    test : [
      "./.tmp/test",
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

  node : {
    // tape …
    fs : "empty",
  },
}

module.exports = config
