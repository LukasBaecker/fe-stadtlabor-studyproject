import { applyMiddleware, compose, createStore } from "redux";
import thunk from "redux-thunk";
import rootReducer from "./reducers/index.js";
import { composeWithDevTools } from "redux-devtools-extension";
import { persistStore } from "redux-persist";

const initialState = {};
const middleware = [thunk];
let store;
const isClient = typeof window !== "undefined";

if (isClient) {
  const { persistReducer } = require("redux-persist");
  const expireReducer = require("redux-persist-expire");
  const storage = require("redux-persist/lib/storage").default;

  const persistConfig = {
    key: "root",
    storage,
    blacklist: ["location_position", "location_active", "currentPoint"],
    transforms: [
      // You can add more `expireReducer` calls here for different reducers
      // that you may want to expire
    ],
  };

  store = createStore(
    persistReducer(persistConfig, rootReducer),
    initialState,
    composeWithDevTools(applyMiddleware(...middleware))
  );

  store.__PERSISTOR = persistStore(store);
} else {
  store = createStore(
    rootReducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middleware))
  );
}

export default store;
