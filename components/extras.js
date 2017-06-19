import React from 'react'
import ReactDOM from 'react-dom'
import {Router} from 'react-router'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'

import store from '../store/store'
import ExtrasActions from '../actions/extras.action'
import controlsActions from '../actions/controls.action'
import App from './app'
import AutoMode from './subComponents/autoMode'
import ManualMode from './subComponents/manualMode'

import {toggleStyle,
		headerStyle,
		moduleheaderStyle,
		snackbarStyle,
		snackbarBodyStyle,
		refreshIconStyle} from '../public/componentStyles'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import Paper from 'material-ui/Paper'
import Subheader from 'material-ui/Subheader'
import Toggle from 'material-ui/Toggle'
import TextField from 'material-ui/TextField'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
import RaisedButton from 'material-ui/RaisedButton'
import Snackbar from 'material-ui/Snackbar'
import {Card,
		CardHeader,
		CardText} from 'material-ui/Card'


class Extras extends React.Component{
	constructor(props) {
		super(props);
		
		this.toggleModule = this.toggleModule.bind(this);
		this.setSnackbarOff = this.setSnackbarOff.bind(this);
		this.refreshState = this.refreshState.bind(this);
		this.refreshNode = null;
		
		this.state = {
			snackbar: {
				status: false,
				message: ''
			},
			controls: {
				water_pump: { status: false },
				lights_1: { status: false },
				lights_2: { status: false }
			}
		};
	}
	
	componentWillMount(){
		this.props.controlsActions.getControls();
		this.justLoaded = true;
	}
	
	componentWillReceiveProps(newProps){
		let oldControls = this.props.controls;
		let newControls = newProps.controls;
		let updateFlag = false;
		let update = {...this.state.controls};
		
		if(this.justLoaded || oldControls.water_pump.status != newControls.water_pump.status){
			update.water_pump.status = newControls.water_pump.status;
			updateFlag = true;
		}
		if(this.justLoaded || oldControls.lights_1.status != newControls.lights_1.status){
			update.lights_1.status = newControls.lights_1.status;
			updateFlag = true;
		}
		if(this.justLoaded || oldControls.lights_2.status != newControls.lights_2.status){
			update.lights_2.status = newControls.lights_2.status;
			updateFlag = true;
		}
		if(newProps.snackbar){
			this.setState({
				snackbar: {
					status: newProps.snackbar.status,
					message: newProps.snackbar.message
				}
			});
		}
		
		if(updateFlag == true){
			let controls = Object.assign({}, this.state.controls, update);
			this.setState({ controls });
			
			if (this.refreshNode)
				this.refreshNode.classList.remove('fa-spin');
		}
	}
	
	setSnackbarOff(){
		this.setState({
			snackbar: {
				status: false,
				message: ''
			}
		});
	}
	
	toggleModule(module){
		if (module == 'lights_1')
			var status = this.state.controls.lights_1.status;
		else if (module == 'lights_2')
			var status = this.state.controls.lights_2.status;
		else if (module == 'water_pump')
			var status = this.state.controls.water_pump.status;
		console.log(status);
		this.props.ExtrasActions.toggleModule(module, status);
	}
	
	refreshState(){
		this.refreshNode = ReactDOM.findDOMNode(this.refs.refresh);
		this.refreshNode.classList.add('fa-spin');
		this.props.controlsActions.getControls();
	}
	
	render(){
		const { controls } = this.props;
		
		return(
			<App router={Router}>
				<div className='content'>
					<MuiThemeProvider>
						<Subheader style={headerStyle}>
							<i className="fa fa-cubes fa-fw fa-1_5x" aria-hidden="true"></i> Extras
							<div style={refreshIconStyle}>
								<i onClick={this.refreshState} ref="refresh" className="fa fa-refresh fa-fw fa-1_5x" aria-hidden="true"></i>
							</div>
						</Subheader>
					</MuiThemeProvider>
					<br/>
					<div className='pad-hoz-15'>
					<MuiThemeProvider>
					<Card>
						<CardText>
							<MuiThemeProvider>
								<Subheader style={moduleheaderStyle}>
									<i className="fa fa-tint fa-fw fa-1_5x" aria-hidden="true"></i> Water Pump
								</Subheader>
							</MuiThemeProvider>
							<MuiThemeProvider>
								<Toggle
								  label={ controls.water_pump.status == true ? 'ON' : 'OFF' }
								  labelPosition="right"
								  style={toggleStyle}
								  toggled={controls.water_pump.status}
								  onToggle={() => this.toggleModule('water_pump')}
								/>
							</MuiThemeProvider>
						</CardText>
					</Card>
					</MuiThemeProvider>
					</div>
					<div className='pad-hoz-15'>
					<MuiThemeProvider>
					<Card>
						<CardText>
							<MuiThemeProvider>
								<Subheader style={moduleheaderStyle}>
									<i className="fa fa-lightbulb-o fa-fw fa-1_5x" aria-hidden="true"></i> Lights 1
								</Subheader>
							</MuiThemeProvider>
							<MuiThemeProvider>
								<Toggle
								  label={ controls.lights_1.status == true ? 'ON' : 'OFF' }
								  labelPosition="right"
								  style={toggleStyle}
								  toggled={controls.lights_1.status}
								  onToggle={() => this.toggleModule('lights_1')}
								/>
							</MuiThemeProvider>
						</CardText>
					</Card>
					</MuiThemeProvider>
					</div>
					<div className='pad-hoz-15'>
					<MuiThemeProvider>
					<Card>
						<CardText>
							<MuiThemeProvider>
								<Subheader style={moduleheaderStyle}>
									<i className="fa fa-lightbulb-o fa-fw fa-1_5x" aria-hidden="true"></i> Lights 2
								</Subheader>
							</MuiThemeProvider>
							<MuiThemeProvider>
								<Toggle
								  label={ controls.lights_2.status == true ? 'ON' : 'OFF' }
								  labelPosition="right"
								  style={toggleStyle}
								  toggled={controls.lights_2.status}
								  onToggle={() => this.toggleModule('lights_2')}
								/>
							</MuiThemeProvider>
						</CardText>
					</Card>
					</MuiThemeProvider>
					</div>
					<br/>
					<MuiThemeProvider>
					<Snackbar
					  open={this.state.snackbar.status}
					  message={this.state.snackbar.message}
					  autoHideDuration={2000}
					  onRequestClose={this.setSnackbarOff}
					  style={snackbarStyle}
					  bodyStyle={snackbarBodyStyle}
					/>
					</MuiThemeProvider>
				</div>
			</App>
		)
	}
}

const mapStateToProps = (store) => ({
	controls: store.controlsReducer.controls,
	snackbar: store.controlsReducer.controls.snackbar
});

const mapDispatchToProps = (dispatch) => ({
	ExtrasActions: bindActionCreators(ExtrasActions, dispatch),
	controlsActions: bindActionCreators(controlsActions, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(Extras);
