import {Dispatcher as FluxDispatcher} from "flux"
import React, {PropTypes} from "react/addons"

class Dispatcher extends FluxDispatcher {

  /**
   * returns the right contextType for dispatcher so that
   * you can emit actions from a react component.
   *
   * example :
   *
   * import {Dispatcher} from "bloody-flux"
   *
   * const MyComponent extends Component {
   *   static contextTypes = {
   *     ...Dispatcher.getContextType(),
   *     router : PropTypes.func,
   *   }
   * }
   *
   * @returns {Object}
   */
  static getContextType() {
    return {
      dispatcher : PropTypes.instanceOf(Dispatcher)
    }
  }

  // used to keep track of the registered stores as the dispatcher
  // is used to get them from a react component's context
  stores = new Map()

  /**
   * registers a store in the dispatcher
   *
   * @param {Object} store
   */
  registerStore(store) {
    if(typeof store.constructor.displayName != "string") {
      throw new TypeError(
        `Dispatcher Error : store ${store} doesn't have a "displayName"`
      )
    }
    if(typeof store.registerDispatcher != "function") {
      throw new TypeError(
        `Dispatcher Error : ${store}  doesn't have a valid ` +
        `"registerDispatcher" method, expected a function, got ` +
        `${store.registerDispatcher}`
      )
    }
    if(this.stores.has(store.constructor.displayName)) {
      throw new Error(
        `Dispatcher Error : a ${store.constructor.displayName} store is ` +
        `already registered`
      )
    }
    this.stores.set(store.constructor.displayName, store)
    store.registerDispatcher(this)
  }

  /**
   * returns the registered store instance matching the `displayName`
   *
   * @param {String} displayName
   * @returns {Object} store
   */
  getStore(displayName) {
    return this.stores.get(displayName)
  }

  /**
   * tests the action `type` presence an dispatches it
   *
   * @param {Object} action
   */
  dispatch(action) {
    if(action == null) {
      throw new TypeError("Dispatcher.dispatch Error : missing action")
    }
    if(action.type == null) {
      throw new TypeError(
        `Dispatcher.dispatch Error : ` +
        `invalid \`type\` parameter for action ${action}`
      )
    }
    super.dispatch(action)
  }

}

export default Dispatcher
