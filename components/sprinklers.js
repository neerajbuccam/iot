import React from 'react'
import {Router} from 'react-router'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'

import store from '../store/store'
import sprinklersActions from '../actions/sprinklers.action'
import controlsActions from '../actions/controls.action'
import App from './app'
import AutoMode from './subComponents/autoMode'
import ManualMode from './subComponents/manualMode'

import {circleStyle,
		tempFont,
		toggleStyle,
		intervalStyle,
		unitStyle,
		saveButtonStyle,
		headerStyle,
		cardTextStyle,
		itemSubheaderStyle,
		subheaderStyle,
		snackbarStyle,
		snackbarBodyStyle} from '../public/componentStyles'
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


class Sprinklers extends React.Component{
	constructor(props) {
		super(props);
		
		this.toggleSprinkler = this.toggleSprinkler.bind(this);
		this.toggleAutoMode = this.toggleAutoMode.bind(this);
		this.resetAutoMode = this.resetAutoMode.bind(this);
		this.toggleManualMode = this.toggleManualMode.bind(this);
		this.startManualMode = this.startManualMode.bind(this);
		this.setSnackbarOff = this.setSnackbarOff.bind(this);
		
		this.state = {
			snackbar: {
				status: false,
				message: ''
			},
			sprinklers: {
				sprinklerSide1: { status: false },
				sprinklerSide2: { status: false },
				autoMode: {
					status: false
				},
				manualMode: {
					status: false
				}
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
		let update = {...this.state.sprinklers};
		
		if(this.justLoaded || oldControls.sprinklerSide1.status != newControls.sprinklerSide1.status){
			update.sprinklerSide1.status = newControls.sprinklerSide1.status;
			updateFlag = true;
		}
		if(this.justLoaded || oldControls.sprinklerSide2.status != newControls.sprinklerSide2.status){
			update.sprinklerSide2.status = newControls.sprinklerSide2.status;
			updateFlag = true;
		}
		if(this.justLoaded || oldControls.autoMode.status != newControls.autoMode.status){
			update.autoMode.status = newControls.autoMode.status;
			updateFlag = true;
		}
		if(this.justLoaded || oldControls.manualMode.status != newControls.manualMode.status){
			update.manualMode.status = newControls.manualMode.status;
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
			let sprinklers = Object.assign({}, this.state, update);
			this.setState({ sprinklers });
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
	
	toggleSprinkler(side){
		const {status} = (side == 'side1')
			? this.state.sprinklers.sprinklerSide1
			: this.state.sprinklers.sprinklerSide2;
		this.props.sprinklersActions.toggleSprinkler(status, side);
	}
	
	toggleAutoMode(){
		const {status} = this.state.sprinklers.autoMode;
		this.props.sprinklersActions.toggleAutoMode(status);
	}
	
	resetAutoMode(autoMode){
		const {
			interval,
			intervalUnitIndex,
			runFor,
			runForUnitIndex
		} = autoMode;
		
		this.props.sprinklersActions.resetAutoMode(interval, intervalUnitIndex, runFor, runForUnitIndex);
	}
	
	toggleManualMode(){
		const {status} = this.state.sprinklers.manualMode;
		this.props.sprinklersActions.toggleManualMode(status);
	}
	
	startManualMode(manualMode){
		const {
			runFor,
			runForUnitIndex
		} = manualMode;
		
		this.props.sprinklersActions.startManualMode(runFor, runForUnitIndex);
	}
	
	render(){
		const { controls } = this.props;
		
		return(
			<App router={Router}>
				<div className='content'>
					<MuiThemeProvider>
						<Subheader style={headerStyle}>
							<i className="fa fa-superpowers fa-fw fa-1_5x" aria-hidden="true"></i> Sprinklers
						</Subheader>
					</MuiThemeProvider>
					<br/>
					<div className='pad-hoz-15'>
					<MuiThemeProvider>
					<Card>
						<CardText>
						<div className='width50'>
							<MuiThemeProvider>
								<Subheader style={itemSubheaderStyle}>Section 1</Subheader>
							</MuiThemeProvider>
							<br/>
							<MuiThemeProvider>
								<Toggle
								  label={ controls.sprinklerSide1.status == true ? 'ON' : 'OFF' }
								  labelPosition="right"
								  style={toggleStyle}
								  toggled={controls.sprinklerSide1.status}
								  onToggle={() => this.toggleSprinkler('side1')}
								/>
							</MuiThemeProvider>
						</div>
						<div className='width50'>
							<MuiThemeProvider>
								<Subheader style={itemSubheaderStyle}>Section 2</Subheader>
							</MuiThemeProvider>
							<br/>
							<MuiThemeProvider>
								<Toggle
								  label={ controls.sprinklerSide2.status == true ? 'ON' : 'OFF' }
								  labelPosition="right"
								  style={toggleStyle}
								  toggled={controls.sprinklerSide2.status}
								  onToggle={() => this.toggleSprinkler('side2')}
								/>
							</MuiThemeProvider>
						</div>
						</CardText>
					</Card>
					</MuiThemeProvider>
					</div>
					<AutoMode
						controls={controls}
						toggleAutoMode={this.toggleAutoMode}
						resetAutoMode={this.resetAutoMode}
						runForNeeded={true}
					/>
					<ManualMode
						controls={controls}
						startManualMode={this.startManualMode}
						toggleManualMode={this.toggleManualMode}
					/>
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
	controls: store.controlsReducer.controls.sprinklers,
	snackbar: store.controlsReducer.controls.snackbar
});

const mapDispatchToProps = (dispatch) => ({
	sprinklersActions: bindActionCreators(sprinklersActions, dispatch),
	controlsActions: bindActionCreators(controlsActions, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(Sprinklers);
