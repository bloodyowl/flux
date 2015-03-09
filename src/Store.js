const canUseDOM = (
  typeof document !== "undefined" &&
  typeof document.querySelector == "function"
)

function isEqual(left, right) {
  // both null case
  if(left === right) {
    return true
  }
  if(left && !right) {
    return false
  }
  let key
  for(key in left) {
    if(left[key] !== right[key]) {
      return false
    }
  }
  return true
}

export default class Store {

  // used to keep the change listeners
  listeners = new Set()

  constructor() {
    this.reactions = this.getActionHandlers()
    this.dispatcher = null
    this.dispatchToken = null
    this.actionHandler = this.actionHandler.bind(this)
    this._getOriginalState()
  }

  /**
   * gets the original state from the DOM if the page has been pre-rendered
   */
  _getOriginalState() {
    if(canUseDOM) {
      const node = document.querySelector(
        `[data-storename=${ this.constructor.displayName }]`
      )
      if(!node) {
        return
      }
      const initialData = JSON.parse(node.innerHTML)
      this.state = initialData.state
      this.params = initialData.params
      this.query = initialData.query
      // remove the script after we took the data from it
      node.parentNode.removeChild(node)
    }
  }

  /**
   * returns whether the stores is hydrated or not
   *
   * useful to see if there is a necessary request or not for params
   * extracted from react-router
   *
   * @param {Object} params
   * @param {Object} query
   */
  hasInitialData(params, query) {
    if(!this.params) {
      return false
    }
    return (
      isEqual(this.params, params) &&
      isEqual(params, this.params) &&
      isEqual(this.query, query) &&
      isEqual(query, this.query)
    )
  }

  /**
   * binds the store instance to its dispatcher, saves a `dispatchToken`
   * to let the store use the dispatcher `waitFor` if needed.
   *
   * @param {Object} dispatcher
   */
  registerDispatcher(dispatcher) {
    this.dispatcher = dispatcher
    this.dispatchToken = this.dispatcher.register(this.actionHandler)
  }

  /**
   * merges `nextState` with the current `state` and emits a change event
   * if `shouldStoreEmitChange` returns a truthy value
   *
   * @param {Object} nextState
   */
  setState(nextState) {
    const prevState = this.state
    this.state = {
      ...prevState,
      ...nextState,
    }
    this.hasInitialData = () => false
    if(this.shouldStoreEmitChange(prevState, this.state)) {
      this.emitChange()
    }
  }

  /**
   * lets the user define from `prevState` & `nextState` if the store
   * should emit a change event. by default `true` is always returned
   *
   * @param {Object} prevState
   * @param {Object} nextState
   * @returns {Boolean}
   */
  shouldStoreEmitChange(prevState, nextState) {
    return true
  }

  /**
   * direct callback of the dispatcher `dispatch` method. looks for
   * an action matching the same identifier in the registered reactions.
   *
   * @param {Object} action
   */
  actionHandler(action){
    if(!this.reactions.hasOwnProperty(action.type)) {
      return
    }
    this.reactions[action.type].call(this, action)
  }

  /**
   * registers a `func` callback for the change event
   *
   * @param {Function} func
   */
  addChangeListener(func) {
    this.listeners.add(func)
  }

  /**
   * unregisters a `func` callback for the change event
   *
   * @param {Function} func
   */
  removeChangeListener(func) {
    this.listeners.delete(func)
  }

  /**
   * calls all the registered callback for the change event
   */
  emitChange() {
    this.listeners.forEach((value) => {
      value(this.constructor.displayName)
    })
  }

  /**
   * lets the user define what actions he wants to respond to
   *
   * example :
   *
   * class PostStore extends Store {
   *   receivePost(action) {
   *     this.setState({
   *       ...action.response
   *     })
   *   }
   *   getActionHandlers() {
   *     return {
   *       [ActionTypes.RECEIVE_POST] : this.receivePost
   *     }
   *   }
   * }
   *
   * @returns {Object}
   */
  getActionHandlers() {
    return {}
  }
}

