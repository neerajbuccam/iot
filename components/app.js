import React from 'react'
import Navbar from './navbar'
import Footer from './footer'
import {Router} from 'react-router'
var global = require('../global_config')

export default class App extends React.Component{
	render(){
		return(
			<div>
				<Navbar router={Router} title={global.app_title} />
				{this.props.children}
				<Footer/>
			</div>
		)
	}
}
