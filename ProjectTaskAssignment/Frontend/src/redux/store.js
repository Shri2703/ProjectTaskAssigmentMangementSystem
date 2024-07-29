// src/redux/store.js
import { createStore, combineReducers } from 'redux'
import authReducer from '../redux/reducers/authReducer' // Ensure this path is correct

const rootReducer = combineReducers({
  auth: authReducer,
})

const store = createStore(rootReducer)

export default store
