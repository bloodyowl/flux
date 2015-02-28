var rimraf = require("rimraf")
var path = require("path")

rimraf.sync(path.resolve(__dirname, "../dist"))
rimraf.sync(path.resolve(__dirname, "../.tmp"))

console.log("[clean] done!")
