import React, {Component, PropTypes} from "react"

import InitialDataScript from "./InitialDataScript"

class InitialData extends Component {

  static propTypes = {
    stores : PropTypes.arrayOf(PropTypes.string).isRequired,
  }

  state = {
    isMounted : false,
  }

  componentDidMount() {
    this.setState({
      isMounted : true,
    })
  }

  renderStoreData(displayName) {
    return (
      <InitialDataScript
        key={displayName}
        storeName={displayName}
        />
    )
  }

  render() {
    if(this.state.isMounted) {
      return null
    }
    return (
      <div hidden={true}>
        {this.props.stores.map(this.renderStoreData)}
      </div>
    )
  }
}

export default InitialData
