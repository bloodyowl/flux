var glob = require("glob")
var path = require("path")
var os = require("os")
var fs = require("fs")
var mkdirp = require("mkdirp")

function buildTests(cb) {
  glob(
    path.resolve(__dirname, "../src/") + "/**/__tests__/**.js",
    function(err, files) {
      mkdirp.sync(path.resolve(__dirname, "../.tmp"))
      var temp = fs.createWriteStream(
        path.resolve(__dirname, "../.tmp/test.js")
      )
      var entry = files.forEach(function(file) {
        temp.write("require(\"" + file + "\")" + os.EOL)
      })
      temp.end()
      cb()
    }
  )
}

module.exports = buildTests
