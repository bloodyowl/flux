import React, {Component, PropTypes} from "react"

import InitialDataScript from "./InitialDataScript"

class InitialData extends Component {

  static propTypes = {
    stores : PropTypes.arrayOf(PropTypes.string).isRequired,
    params : PropTypes.object,
    query : PropTypes.object,
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
        params={this.props.params}
        query={this.props.query}
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
        {this.props.stores.map(this.renderStoreData, this)}
      </div>
    )
  }
}

export default InitialData
