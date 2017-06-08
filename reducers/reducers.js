import { combineReducers } from 'redux'
import tempHumidityReducer from './tempHumidityReducer'
import controlsReducer from './controlsReducer'

const reducers = combineReducers({
  tempHumidityReducer,
  controlsReducer
})

export default reducers
