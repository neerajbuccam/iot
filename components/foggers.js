import React from 'react'
import ReactDOM from 'react-dom'
import {Router} from 'react-router'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'

import store from '../store/store'
import foggersActions from '../actions/foggers.action'
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


class Foggers extends React.Component{
	constructor(props) {
		super(props);
		
		this.toggleFogger = this.toggleFogger.bind(this);
		this.toggleAutoMode = this.toggleAutoMode.bind(this);
		this.resetAutoMode = this.resetAutoMode.bind(this);
		this.toggleManualMode = this.toggleManualMode.bind(this);
		this.startManualMode = this.startManualMode.bind(this);
		this.setSnackbarOff = this.setSnackbarOff.bind(this);
		this.refreshState = this.refreshState.bind(this);
		this.refreshNode = null;
		
		this.state = {
			snackbar: {
				status: false,
				message: ''
			},
			foggers: {
				foggerSide1: { status: false },
				foggerSide2: { status: false },
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
		let update = {...this.state.foggers};
		
		if(this.justLoaded || oldControls.foggerSide1.status != newControls.foggerSide1.status){
			update.foggerSide1.status = newControls.foggerSide1.status;
			updateFlag = true;
		}
		if(this.justLoaded || oldControls.foggerSide2.status != newControls.foggerSide2.status){
			update.foggerSide2.status = newControls.foggerSide2.status;
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
			let foggers = Object.assign({}, this.state, update);
			this.setState({ foggers });
			
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
	
	toggleFogger(side){
		const {status} = (side == 'side1')
			? this.state.foggers.foggerSide1
			: this.state.foggers.foggerSide2;
		this.props.foggersActions.toggleFogger(status, side);
	}
	
	toggleAutoMode(){
		const {status} = this.state.foggers.autoMode;
		this.props.foggersActions.toggleAutoMode(status);
	}
	
	resetAutoMode(autoMode){
		const {
			interval,
			intervalUnitIndex,
			runFor,
			runForUnitIndex
		} = autoMode;
		
		this.props.foggersActions.resetAutoMode(interval, intervalUnitIndex, runFor, runForUnitIndex);
	}
	
	toggleManualMode(){
		const {status} = this.state.foggers.manualMode;
		this.props.foggersActions.toggleManualMode(status);
	}
	
	startManualMode(manualMode){
		const {
			runFor,
			runForUnitIndex
		} = manualMode;
		
		this.props.foggersActions.startManualMode(runFor, runForUnitIndex);
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
							<i className="fa fa-shower fa-fw fa-1_5x" aria-hidden="true"></i> Foggers
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
						<div className='width50'>
							<MuiThemeProvider>
								<Subheader style={itemSubheaderStyle}>Section 1</Subheader>
							</MuiThemeProvider>
							<br/>
							<MuiThemeProvider>
								<Toggle
								  label={ controls.foggerSide1.status == true ? 'ON' : 'OFF' }
								  labelPosition="right"
								  style={toggleStyle}
								  toggled={controls.foggerSide1.status}
								  onToggle={() => this.toggleFogger('side1')}
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
								  label={ controls.foggerSide2.status == true ? 'ON' : 'OFF' }
								  labelPosition="right"
								  style={toggleStyle}
								  toggled={controls.foggerSide2.status}
								  onToggle={() => this.toggleFogger('side2')}
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
	controls: store.controlsReducer.controls.foggers,
	snackbar: store.controlsReducer.controls.snackbar
});

const mapDispatchToProps = (dispatch) => ({
	foggersActions: bindActionCreators(foggersActions, dispatch),
	controlsActions: bindActionCreators(controlsActions, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(Foggers);
