import React, {Component, PropTypes} from "react"
import {Dispatcher} from "../../../../dist"

class App extends Component {

  static childContextTypes = {
    ...Dispatcher.getContextType()
  }

  static propTypes = {
    ...Dispatcher.getContextType(),
    component : PropTypes.func.isRequired,
  }

  getChildContext() {
    return {
      dispatcher : this.props.dispatcher,
    }
  }

  render() {
    return (
      <this.props.component {...this.props}/>
    )
  }
}

export default App
