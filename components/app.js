import React from 'react'
import Navbar from './navbar'
import {Router} from 'react-router'
import {global} from '../global_config'

export default class App extends React.Component{
	render(){
		return(
			<div>
				<Navbar router={Router} title={global.app_title} />
				{this.props.children}
			</div>
		)
	}
}
