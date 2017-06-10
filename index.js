import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { Router, Route, browserHistory } from 'react-router'
import store from './store/store'

import App from './components/app'
import About from './components/about'
import Foggers from './components/foggers'
import TempAndHumidity from './components/tempAndHumidity'

import injectTapEventPlugin from 'react-tap-event-plugin'

injectTapEventPlugin();


render((
	<Provider store={store}>
		<Router history={browserHistory}>
			<Route path="/" component={App} />
			<Route path="/about" component={About} />
			<Route path="/foggers" component={Foggers} />
			<Route path="/temp-humidity" component={TempAndHumidity} />
		</Router>
	</Provider>
), document.getElementById('app'))
