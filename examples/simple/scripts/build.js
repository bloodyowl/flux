require("babel/register")({
  experimental : true,
  playground : true,
})

var webpack = require("webpack")
var config = require("../webpack.config")

webpack(config, function(err, stats) {
  if(err) {
    throw err
  }
  console.log(stats.toString())
})
