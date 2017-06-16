import React from 'react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import MenuItem from 'material-ui/MenuItem'
import IconButton from 'material-ui/IconButton'
import IconMenu from 'material-ui/IconMenu'

export default class Footer extends React.Component{
	
	render(){
		return(
			<div className="footerStyle">
				<div>
					Powered by
					<br />
					Neeraj Buccam @ 2017
				</div>
			</div>
		)
	}
}
