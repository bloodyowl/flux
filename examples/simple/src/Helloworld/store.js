import {Store} from "../../../../dist"
import {ActionTypes} from "../constants"
import HelloworldActions from "./actions"

class HelloworldStore extends Store {

  static displayName = "Helloworld"

  state = {
    title : "helloworld!",
  }

  changeTitle(action) {
    this.setState({
      title : action.value,
    })
  }

  shouldStoreEmitChange(prevState, nextState) {
    if(prevState.title === nextState.title) {
      return false
    }
    return true
  }

  getActionHandlers() {
    return {
      [ActionTypes.CHANGE_TITLE] : this.changeTitle,
    }
  }
}

export default HelloworldStore
