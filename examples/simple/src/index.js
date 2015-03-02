import React from "react"
import {Dispatcher} from "../../../dist"

import App from "./App"

import Helloworld from "./Helloworld"
import HelloworldStore from "./Helloworld/store"

import domReady from "bloody-domready"

domReady(() => {

  const dispatcher = new Dispatcher()
  dispatcher.registerStore(new HelloworldStore())

  React.render(
    <div>
      <App component={Helloworld} dispatcher={dispatcher}/>
    </div>,
    document.getElementById("app")
  )
})
