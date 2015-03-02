import {ActionTypes} from "../constants"

const HelloworldActions = {
  changeTitle(value) {
    return {
      type : ActionTypes.CHANGE_TITLE,
      value,
    }
  }
}

export default HelloworldActions
