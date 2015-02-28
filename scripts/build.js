require("babel/register")

var webpack = require("webpack")
var config = require("../webpack.config")

var buildTests = require("./test")

buildTests(function() {
  console.log("[tests] built!")
  webpack(config, function(err, stats) {
    if(err) {
      try {
        throw err
      }
      finally {
        process.exit(1)
      }
    }
    console.log(stats.toString())
  })
})
