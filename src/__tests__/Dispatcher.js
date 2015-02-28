import Dispatcher from "../Dispatcher"
import tape from "tape"

tape("Dispatcher.getContextType", (test) => {
  const contextType = Dispatcher.getContextType()
  test.equal(
    typeof contextType.dispatcher,
    "function",
    "exports `dispatcher` propType"
  )
  test.deepEqual(
    Object.keys(contextType),
    ["dispatcher"],
    "exports only one propType"
  )
  test.end()
})

tape("Dispatcher.registerStore", (test) => {
  const dispatcher = new Dispatcher()
  test.throws(
    () => {
      dispatcher.registerStore({})
    },
    /Dispatcher Error : store \[object Object\] doesn't have a "displayName"/
  )
  test.throws(
    () => {
      dispatcher.registerStore({
        constructor : {
          displayName : "TestStore",
        },
      })
    },
    RegExp(
      `Dispatcher Error : \\[object Object\\]  doesn't have a valid ` +
      `"registerDispatcher" method, expected a function, got undefined`
    )
  )
  const STORE_NAME = "TestStore"
  const storeMock = {
    constructor : {
      displayName : STORE_NAME,
    },
    registerDispatcher(object) {
      test.equal(object, dispatcher, "calls store.registerDispatcher")
    },
  }
  dispatcher.registerStore(storeMock)
  test.equal(dispatcher.stores.get(STORE_NAME), storeMock)
  test.throws(
    () => {
      dispatcher.registerStore(storeMock)
    },
    /Dispatcher Error : a TestStore store is already registered/
  )
  test.end()
})

tape("Dispatcher.dispatch", (test) => {
  const dispatcher = new Dispatcher()
  test.throws(
    () => dispatcher.dispatch(null),
    /Dispatcher\.dispatch Error : missing action/,
    "throws if action is missing"
  )
  test.throws(
    () => dispatcher.dispatch({
      type : null,
      toString() {
        return "ACTION"
      },
    }),
    /Dispatcher\.dispatch Error : invalid `type` parameter for action ACTION/,
    "throws if action is missing"
  )
  const mockStore = {
    constructor : {
      displayName : "MockStore"
    },
    registerDispatcher() {
      dispatcher.register(this.actionHandler)
    },
    actionHandler(action) {
      test.equal(action.type, "ACTION")
      test.equal(action.data, "foo")
    },
  }
  dispatcher.registerStore(mockStore)
  dispatcher.dispatch({
    type : "ACTION",
    data : "foo",
  })
  test.end()
})
