import Store from "./Store"
import Dispatcher from "./Dispatcher"
import StoreReceiver from "./StoreReceiver"
import InitialData from "./InitialData"

export default {
  Store,
  Dispatcher,
  StoreReceiver,
  // for linters
  storeReceiver: StoreReceiver,
  InitialData,
  version : __VERSION__,
}
