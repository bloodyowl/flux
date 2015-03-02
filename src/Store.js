const canUseDOM = (
  typeof document !== "undefined" &&
  typeof document.querySelector == "function"
)

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
      this.state = JSON.parse(node.innerHTML)
      // remove the script after we took the data from it
      node.parentNode.removeChild(node)
    }
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

