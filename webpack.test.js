var context = require.context("./src", true, /__tests__\/\w+\.js$/)
context.keys().forEach(context)

