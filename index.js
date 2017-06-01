import React from 'react'
import { render } from 'react-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import { Router, Route, browserHistory } from 'react-router'
import reducers from './reducers/reducers'

import App from './components/app'
import About from './components/about'
import TempAndHumidity from './components/tempAndHumidity'

import injectTapEventPlugin from 'react-tap-event-plugin'

injectTapEventPlugin();

let store = createStore(reducers);

render((
	<Provider store={store}>
		<Router history={browserHistory}>
			<Route path="/" component={App} />
			<Route path="/about" component={About} />
			<Route path="/temp-humidity" component={TempAndHumidity} />
		</Router>
	</Provider>
), document.getElementById('app'))
