import React, {Component} from "react"
import {Dispatcher, StoreReceiver} from "../../../../dist"

import HelloworldActions from "./actions"

class Helloworld extends Component {

  static stores = {
    Helloworld : "helloworld",
  }

  static contextTypes = {
    ...Dispatcher.getContextType(),
  }

  state = {
    pressed : false,
  }

  changeTitle(event) {
    event.preventDefault()
    this.context.dispatcher.dispatch(
      HelloworldActions.changeTitle(
        React.findDOMNode(this.field).value
      )
    )
  }

  press() {
    this.setState({
      pressed : true,
    })
  }

  unpress() {
    this.setState({
      pressed : false,
    })
  }

  render() {
    return (
      <div style={styles.helloworld}>
        <h1 style={styles.title}>{this.props.helloworld.title}</h1>
        <form onSubmit={(event) => this.changeTitle(event)}>
          <input
            style={styles.field}
            placeholder="your new title here"
            defaultValue=""
            ref={(node) => this.field = node}
            />
          <button
            type="submit"
            onMouseDown={() => this.press()}
            onMouseUp={() => this.unpress()}
            style={{
              ...styles.button.default,
              ...this.state.pressed && styles.button.pressed,
            }}>
            change the title
          </button>
        </form>
      </div>
    )
  }

}

const styles = {
  helloworld : {
    width : "50%",
    margin : "0 auto",
    fontFamily : `"Helvetica Neue", Helvetica, Arial, sans-serif`,
    textAlign : "center",
  },
  title : {
    fontWeight : 300,
  },
  field : {
    fontSize : "1rem",
    fontFamily : "inherit",
  },
  button : {
    default : {
      border : "none",
      background : "#369",
      color : "#fff",
      cursor : "pointer",
      fontSize : "1rem",
    },
    pressed : {
      background : "#036",
    },
  },
}

export default StoreReceiver(Helloworld)
