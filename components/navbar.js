import React from 'react'
import Router, {Link} from 'react-router'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import AppBar from 'material-ui/AppBar'
import Drawer from 'material-ui/Drawer'
import MenuItem from 'material-ui/MenuItem'
import IconButton from 'material-ui/IconButton'
import IconMenu from 'material-ui/IconMenu'

const NavItemStyle = {
	borderTop: '1px lightgray solid'
};

const logoTitleStyle = {
	fontVariant: 'small-caps',
	fontWeight: '600'
}

export default class Navbar extends React.Component{
	constructor(props) {
		super(props);
		this.state = {navDrawerOpen: false};
		this.handleClose = this.handleClose.bind(this);
		this.handleToggle = this.handleToggle.bind(this);
	}

	handleToggle(){
		this.setState({navDrawerOpen: !this.state.navDrawerOpen});
	}

	handleClose(){
		this.setState({navDrawerOpen: false});
	}
	
	render(){
		return(
			<div>
				<MuiThemeProvider>
					<AppBar title={this.props.title}
					 titleStyle={logoTitleStyle}
					 onLeftIconButtonTouchTap={this.handleToggle}
					 iconElementRight={
						<div>
							<Link to="/dashboard"><IconButton iconClassName="muidocs-icon-action-home" tooltip="Dashboard" /></Link>
							<IconMenu
								iconButtonElement={<IconButton iconClassName="muidocs-icon-navigation-expand-more" />}
								targetOrigin={{horizontal: 'right', vertical: 'top'}}
								anchorOrigin={{horizontal: 'right', vertical: 'top'}}
							>
								<Link to="/about"><MenuItem primaryText="About" /></Link>
							</IconMenu>
						</div>
					 } />
				</MuiThemeProvider>
				<MuiThemeProvider>
					<Drawer
					  docked={false}
					  width={200}
					  open={this.state.navDrawerOpen}
					  onRequestChange={(open) => this.setState({navDrawerOpen: open})}
					>
						<div className="drawer-title">Controls</div>
						<Link to="/foggers"><MenuItem style={NavItemStyle} onTouchTap={this.handleClose}>
							<i className="fa fa-shower fa-fw fa-1_5x" aria-hidden="true"></i> Foggers
						</MenuItem></Link>
						<Link to="/sprinklers"><MenuItem style={NavItemStyle} onTouchTap={this.handleClose}>
							<i className="fa fa-superpowers fa-fw fa-1_5x" aria-hidden="true"></i> Sprinklers
						</MenuItem></Link>
						<Link to="/temp-humidity"><MenuItem style={NavItemStyle} onTouchTap={this.handleClose}>
							<i className="fa fa-thermometer-half fa-fw fa-1_5x" aria-hidden="true"></i> Temp / Humdity
						</MenuItem></Link>
						<Link to="/extras"><MenuItem style={NavItemStyle} onTouchTap={this.handleClose}>
							<i className="fa fa-cubes fa-fw fa-1_5x" aria-hidden="true"></i> Extras
						</MenuItem></Link>
					</Drawer>
				</MuiThemeProvider>
				
			</div>
		)
	}
}
