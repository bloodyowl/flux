# bloody-flux

> a server & client-side friendly implementation of flux

**bloody-flux** is a server & client-friendly implementation of the
[flux architecture](https://facebook.github.io/flux).

## design choices

in order to be able to render components on the server, the singleton pattern
for the stores & the dispatcher simply makes concurrency impossible.
therefore in this flux implementation, stores & dispatchers are only used as
singletons for the client-side.

using instances for the dispatcher also means you can't just `require` them
to access them. to make their use possible, the dispatcher keeps its stores
in a map, and components only need to get this dispatcher. in this
implementation this is done through the react components' `context`.

here, actions creators are just simple functions without the dispatcher as
dependency, they just return the action object, and you need to explicitely
use `dispatcher.dispatcher(actionCreator(params))`. this enables us to easily
test them, and to avoid an extra dependency that makes it difficult to work
with both the server and the client.

as mixins aren't available in ES6 classes, and the react team chose not to
keep that feature before the language itself brings a good solution to compose
classes, the way that is used to attach a store to a component is a higher-
order component getting the stores data in its state, and passes it as props
to the component needing it. to do that, a factory is used to "wrap" the
user's components. a good consequence of this is that the user's component
doesn't have to be stateful anymore, as its data comes in its props.

## API

### Dispatcher

#### const dispatcher = new Dispatcher()

creates a new dispatcher instance. `Dispatcher` is a subclass of facebook's
[flux dispatcher](http://facebook.github.io/flux/docs/dispatcher.html#content).
you have its features in bloody-flux's dispatcher too.

#### dispatcher.registerStore(store)

registers a store, and makes it listen to dispatched actions.

> the store **must** have a `registerDispatcher` method and a static
> `displayName` string property

#### dispatcher.getStore(displayName)

returns the registered store matching `displayName`

#### dispatcher.dispatch(action)

dispatches an action to the stores.

> this action **must** be an object, and **must** contain a non-null
> `type` property in order to identify this action.

#### Dispatcher.getContextType()

shorthand to get a valid react `PropType` for a dispatcher instance.

```javascript
import React, {Component} from "react"
import {Dispatcher} from "bloody-flux"

class MyComponent extends Component {
  static contextTypes = {
    ...Dispatcher.getContextType()
  }
}
```

### store

#### class MyStore extends Store { … }

to create a store, you first need to extend it.

#### static displayName

you **must** define a unique `displayName` string as a static property in
order to identify your store.

> the dispatcher will throw an error if you attempt to register two objects
> with the same static displayName

#### state

you can define an original state by setting a `state` object in your class
spec.

```javascript
// with ES7 property initializer
class MyStore extends Store {
  state = {
    property1 : value1
    // …
  }
}

// with ES6
class MyStore extends Store {
  constructor() {
    this.state = {
      property1 : value1
      // …
    }
    super()
  }
}
```

#### setState(nextState)

like react's `setState`, this method merges `nextState` with `this.state` in a
new object, and emits a change event.

#### shouldEmitChange(prevState, nextState)

a method you can optionally define for a better performance if you send too
much unnecessary change events. the change event is only sent if
`shouldEmitChange` returns a truthy value.

> by default, `shouldEmitChange` always returns `true`

```javascript
class MyStore extends Store {
  // …
  shouldEmitChange(prevState, nextState) {
    if(prevState.id === nextState.id) {
      // don't send a change event if id didn't change
      return false
    }
    return true
  }
}
```

#### getActionHandlers()

a method where you return what method(s) should be executed for a given action.
you must return an object with functions as values and action types as keys.

> for a nicer syntax, you can take advantage of ES6's computed property names

> methods are ran with the store as `thisValue`

```javascript
import {ActionTypes} from "../constants"

class MyStore extends Store {
  updatePost(post) {
    this.setState({
      ...post.response
    })
  }
  getActionHandlers() {
    return {
      [ActionTypes.RECEIVE_POST] : this.updatePost,
      // you can even execute mutiple methods for a given action
      [ActionTypes.SOME_ACTION] : (action) => {
        this.someOtherMethod()
        this.updatePost(action)
      }
    }
  }
}
```

#### dispatcher

the store's dispatcher is set as the `dispatcher` once the store has been
registered. this is useful to emit actions from the store API calls and
to fetch other stores (for such features as `waitFor`)

#### dispatchToken

the store identifier in `dispatcher`.

#### store.addChangeListener(func)

registers `func` as a change listener. `func` will be executed each time
a change event is emitted.

> `func` will be passed the store's `displayName` as parameter

#### store.removeChangeListener(func)

unregisters `func` from the change listeners.

#### store.emitChange()

emits a change event.

### StoreReceiver

#### StoreReceiver(ReactComponentClass)

factory to get store's data in `ReactComponentClass` props.

#### static stores

in the `ReactComponentClass` you wrap with `StoreReceiver`, you define which
stores you want to receive data from in an object with displayNames as keys,
and the props names you want them in as values.

```javascript
import React, {Component} from "react"

class ReactComponentClass extends Component {
  // ReactComponentClass will receive PostStore's state in its "post" prop
  // and OtherStores's data in its "foo" prop
  statics stores = {
    PostStore : "post",
    OtherStore : "foo",
  }

  render() {
    return (
      <div>
        {this.props.post.title}
        {this.props.foo.someProp}
      </div>
    )
  }
}
```

## adding the dispatcher in a react component's context

you need a parent component to add the dispatcher to your react components :

```javascript
import React, {Component} from "react"
import Dispatcher from "./Dispatcher"

// create your app's dispatcher
// and register some stores
const dispatcher = new Dispatcher()

class App extends Component {
  static childContextTypes = {
    ...Dispatcher.getContextType()
  }
  getChildContext() {
    return {
      dispatcher
    }
  }
  render() {
    // return your component here
  }
}

React.render(<App />, mountNode)
```

## [license](LICENSE)
