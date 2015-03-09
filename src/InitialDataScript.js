import React, {Component, PropTypes} from "react"
import Dispatcher from "./Dispatcher"

class InitialDataScript extends Component {

  static defaultProps = {
    params : null,
    query : null,
  }

  static contextTypes = {
    ...Dispatcher.getContextType(),
  }

  static propTypes = {
    storeName : PropTypes.string.isRequired,
    params : PropTypes.object,
    query : PropTypes.object,
  }

  render() {
    const state = this.context.dispatcher.getStore(this.props.storeName).state
    const params = this.props.params
    const query = this.props.query
    return (
      <script
        type="text/json"
        data-storename={this.props.storeName}
        dangerouslySetInnerHTML={{
          __html : JSON.stringify({
            state,
            params,
            query,
          })
        }} />
    )
  }
}

export default InitialDataScript
