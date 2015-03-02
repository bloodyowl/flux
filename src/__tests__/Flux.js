import Flux from ".."
import tape from "tape"

tape("Flux", (test) => {
  test.equal(typeof Flux.version, "string", "embeds version")
  test.equal(
    /^\d+\.\d+\.\d+/.test(Flux.version),
    true,
    "follows semver syntax"
  )
  test.equal(typeof Flux.Dispatcher, "function")
  test.equal(typeof Flux.Store, "function")
  test.equal(typeof Flux.StoreReceiver, "function")
  test.equal(typeof Flux.InitialData, "function")
  test.end()
})
