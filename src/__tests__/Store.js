import Store from "../Store"
import tape from "tape"

tape("Store", (test) => {
  const store = new Store()
  const changeListener = () => {
    test.deepEqual(
      store.state,
      {
        foo : "bar"
      },
      "calls change listeners on change"
    )
  }
  store.addChangeListener(changeListener)
  store.setState({
    foo : "bar"
  })
  store.removeChangeListener(changeListener)
  store.setState({
    bar : "baz"
  })
  test.end()
})

tape("Store.shouldEmitChange", (test) => {
  let ranShouldEmitChange = 0
  class TestStore extends Store {

    state = {
      foo : "bar",
    }

    shouldStoreEmitChange(prevState, nextState) {
      ++ranShouldEmitChange
      if(prevState.foo === nextState.foo) {
        return false
      }
      return true
    }
  }
  const testStore = new TestStore()
  let ranChangeListener = 0
  const changeListener = () => {
    ++ranChangeListener
    test.equal(testStore.state.foo, "baz")
  }
  testStore.addChangeListener(changeListener)
  testStore.setState({
    foo : "bar"
  })
  testStore.setState({
    foo : "baz"
  })
  test.equal(ranShouldEmitChange, 2)
  test.equal(ranChangeListener, 1)
  test.end()
})

tape("Store.getActionHandlers", (test) => {
  const ACTION_NAME = "ACTION"
  class TestStore extends Store {
    handleMyAction(action) {
      test.equal(action.type, ACTION_NAME)
      test.equal(action.data, "foo")
      test.equal(this, testStore, "has store as thisValue")
    }
    getActionHandlers() {
      return {
        [ACTION_NAME] : this.handleMyAction,
      }
    }
  }
  const testStore = new TestStore()
  testStore.actionHandler({
    type : ACTION_NAME,
    data : "foo",
  })
  test.end()
})

tape("Store initialData", (test) => {
  const script = document.createElement("script")
  script.type = "text/json"
  script.setAttribute("data-storename", "TestStore")
  script.innerHTML = JSON.stringify({
    state : {
      foo : "bar",
    },
    params : null,
    query : null,
  })
  document.body.appendChild(script)
  class TestStore extends Store {
    static displayName = "TestStore"
  }
  const testStore = new TestStore()
  test.deepEqual(testStore.state, {foo : "bar"}, "gets initial data")
  test.equal(script.parentNode, null, "script is removed")
  test.end()
})

tape("Store initialData params", (test) => {
  const script = document.createElement("script")
  script.type = "text/json"
  script.setAttribute("data-storename", "TestStore")
  script.innerHTML = JSON.stringify({
    state : {
      foo : "bar",
    },
    params : {
      param1 : true,
    },
    query : {
      query1 : true,
    }
  })
  document.body.appendChild(script)
  class TestStore extends Store {
    static displayName = "TestStore"
  }
  const testStore = new TestStore()
  test.deepEqual(testStore.state, {foo : "bar"}, "gets initial data")
  test.equal(testStore.hasInitialData({param1 : true}, {query1: true}), true)
  testStore.setState({
    bar : "baz"
  })
  test.equal(testStore.hasInitialData({param1 : true}, {query1 : true}), false)
  test.end()
})
