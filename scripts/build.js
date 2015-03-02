require("babel/register")

var webpack = require("webpack")
var config = require("../webpack.config")
var testConfig = require("../webpack.test.config")

webpack(testConfig, function(err, stats) {
  if(err) {
    throw err
  }
  console.log("[tests] build!")
})

webpack(config, function(err, stats) {
  if(err) {
    throw err
  }
  console.log("[lib] built!")
  console.log(stats.toString())
})
