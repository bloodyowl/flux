import React, {Component} from "react/addons"
import tape from "tape"

import StoreReceiver from "../StoreReceiver"
import Dispatcher from "../Dispatcher"
import Store from "../Store"

tape("StoreReceiver", (test) => {

  const TestComponent = StoreReceiver(class extends Component {

    static stores = {
      Store1 : "store_1",
      Store2 : "store_2",
    }

    componentDidMount() {
      test.deepEqual(this.props.store_1, store1.state)
      test.deepEqual(this.props.store_2, store2.state)
      setTimeout(() => {
        store2.setState({
          bar : "test!",
        })
      }, 30)
    }

    componentWillReceiveProps(nextProps) {
      test.deepEqual(nextProps.store_1, store1.state)
      test.deepEqual(nextProps.store_2, store2.state)
      test.equal(nextProps.store_2.bar, "test!", "receives changes")
      setTimeout(() => {
        React.unmountComponentAtNode(testNode)
      }, 30)
      test.end()
    }

    render() {
      return (
        <div>
          {this.props.store_1.foo}
          {this.props.store_2.bar}
        </div>
      )
    }
  })

  class Store1 extends Store {
    static displayName = "Store1"
    state = {
      foo : "hello",
    }
  }

  class Store2 extends Store {
    static displayName = "Store2"
    state = {
      bar : "world",
    }
  }

  const dispatcher = new Dispatcher()
  const store1 = new Store1()
  const store2 = new Store2()

  class App extends Component {
    static childContextTypes = {
      ...Dispatcher.getContextType()
    }

    getChildContext() {
      return {
        dispatcher : dispatcher,
      }
    }

    render() {
      return (
        <this.props.component {...this.props}/>
      )
    }
  }


  dispatcher.registerStore(store1)
  dispatcher.registerStore(store2)

  const testNode = document.createElement("div")
  document.body.appendChild(testNode)
  React.render(<App component={TestComponent}/>, testNode)
})
