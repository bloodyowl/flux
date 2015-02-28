import InitialData from "../InitialData"
import Dispatcher from "../Dispatcher"
import Store from "../Store"

import tape from "tape"
import React, {Component} from "react/addons"

tape("InitialData", (test) => {

  class TestStore extends Store {
    static displayName = "TestStore"

    state = {
      foo : "bar",
      bar : "baz",
      baz : "foo",
    }
  }

  const dispatcher = new Dispatcher()
  dispatcher.registerStore(new TestStore())

  class App extends Component {
    static childContextTypes = {
      ...Dispatcher.getContextType(),
    }

    getChildContext() {
      return {
        dispatcher
      }
    }

    render() {
      return (
        <this.props.component {...this.props} />
      )
    }
  }

  const stores = ["TestStore"]
  const rendered = React.renderToStaticMarkup(
    <App component={InitialData} stores={stores}/>
  )
  test.equal(
    rendered,
    `<div hidden>` +
      `<script type="text/json" data-storename="TestStore">` +
        JSON.stringify(dispatcher.getStore("TestStore").state) +
      `</script>` +
    `</div>`
  )
  test.end()

})
