import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { Router, Route, Redirect, browserHistory } from 'react-router'
import store from './store/store'

import App from './components/app'
import About from './components/about'
import Dashboard from './components/dashboard'
import Foggers from './components/foggers'
import Sprinklers from './components/sprinklers'
import TempAndHumidity from './components/tempAndHumidity'
import Extras from './components/extras'

import injectTapEventPlugin from 'react-tap-event-plugin'

injectTapEventPlugin();


render((
	<Provider store={store}>
		<Router history={browserHistory}>
			<Route path="/" component={Dashboard} />
			<Route path="/about" component={About} />
			<Route path="/dashboard" component={Dashboard} />
			<Route path="/foggers" component={Foggers} />
			<Route path="/sprinklers" component={Sprinklers} />
			<Route path="/temp-humidity" component={TempAndHumidity} />
			<Route path="/extras" component={Extras} />
			
			<Route exact path="/" render={() => (
				<Redirect to="/dashboard"/>
			)}/>
		</Router>
	</Provider>
), document.getElementById('app'))
