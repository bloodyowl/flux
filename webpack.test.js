import assign from "object-assign"

if(typeof Object.assign !== "function") {
  Object.assign = assign
}

var context = require.context("./src", true, /__tests__\/\S+\.js$/)
context.keys().forEach(context)
