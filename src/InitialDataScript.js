import React, {Component, PropTypes} from "react/addons"
import Dispatcher from "./Dispatcher"

class InitialDataScript extends Component {

  static contextTypes = {
    ...Dispatcher.getContextType(),
  }

  static propTypes = {
    storeName : PropTypes.string.isRequired,
  }

  render() {
    return (
      <script
        type="text/json"
        data-storename={this.props.storeName}
        dangerouslySetInnerHTML={{
          __html : JSON.stringify(
            this.context.dispatcher.getStore(this.props.storeName).state
          )
        }} />
    )
  }
}

export default InitialDataScript
