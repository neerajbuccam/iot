import reducers from '../reducers/reducers'
import { createStore, compose, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { logger } from 'redux-logger'

export default createStore(reducers, compose(applyMiddleware(thunk, logger)));
