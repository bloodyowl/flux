import React, {Component, PropTypes} from "react/addons"
import Dispatcher from "./Dispatcher"


/**
 * StoreReceiver is a component factory that wraps a component
 * and lets it get data from all the stores defined in its statics
 * as props instead of state.
 *
 * enables the wrapped (or composed) component to be stateless and
 * therefore, more easily testable.
 *
 * example:
 *
 * class Post extends Component {
 *   static stores = {
 *     // StoreDisplayName : "propName"
 *     PostStore : "post",
 *   }
 *   render() {
 *     return (
 *       <div>
 *         <h1>{this.props.post.title}</h1>
 *       </div>
 *     )
 *   }
 * }
 *
 * wraps the component
 * export default StoreReceiver(Post)
 */
export default (ComposedComponent) => {

  if(typeof ComposedComponent.stores !== "object") {
    const name = ComposedComponent.name
    throw new TypeError(
      `StoreReceiver Error : ` +
      `missing "stores" parameter in ${name} component class.`
    )
  }

  const stores = ComposedComponent.stores
  const initialState = Object.keys(stores).reduce(
    (acc, key) => {
      acc[stores[key]] = null
      return acc
    },
    {}
  )

  return class StoreReceiver extends Component {

    static contextTypes = {
      dispatcher : PropTypes.instanceOf(Dispatcher),
    }

    state = initialState

    constructor() {
      this.updateStateFromStore = this.updateStateFromStore.bind(this)
    }

    getStore(name) {
      return this.context.dispatcher.getStore(name)
    }

    forEachStore(func) {
      Object.keys(stores)
        .forEach((key) => {
          func(
            this.getStore(key),
            key,
            stores[key]
          )
        })
    }

    // used to get the store's initial state before first render
    componentWillMount() {
      const nextState = {}
      this.forEachStore((store, key, propName) => {
        nextState[propName] = store.state
      })
      this.setState(nextState)
    }

    componentDidMount() {
      this.forEachStore((store) => {
        store.addChangeListener(this.updateStateFromStore)
      })
    }

    componentWillUnmount() {
      this.forEachStore((store) => {
        store.removeChangeListener(this.updateStateFromStore)
      })
    }

    updateStateFromStore(displayName) {
      const name = stores[displayName]
      this.setState({
        [name] : this.getStore(displayName).state,
      })
    }

    render() {
      return (
        <ComposedComponent {...this.props} {...this.state}/>
      )
    }
  }
}
