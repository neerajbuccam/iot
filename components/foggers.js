import React from 'react'
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
		subheaderStyle
	} from '../public/componentStyles'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import Paper from 'material-ui/Paper'
import Subheader from 'material-ui/Subheader'
import Divider from 'material-ui/Divider'
import Toggle from 'material-ui/Toggle'
import TextField from 'material-ui/TextField'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
import RaisedButton from 'material-ui/RaisedButton'


class Foggers extends React.Component{
	constructor(props) {
		super(props);
		
		this.toggleFoggerSide1 = this.toggleFoggerSide1.bind(this);
		this.toggleFoggerSide2 = this.toggleFoggerSide2.bind(this);
		this.toggleAutoMode = this.toggleAutoMode.bind(this);
		this.resetAutoMode = this.resetAutoMode.bind(this);
		this.startManualMode = this.startManualMode.bind(this);
		
		this.state = {
			foggers: {
				foggerSide1: { status: false },
				foggerSide2: { status: false },
				autoMode: {
					status: false,
					interval: 0,
					intervalUnitIndex: 0,
					runFor: 0,
					runForUnitIndex: 0
				},
				manualMode: {
					runFor: 0,
					runForUnitIndex: 0
				}
			}
		};
	}
	
	componentWillMount(){
		this.props.controlsActions.getControls();
	}
	
	componentWillReceiveProps(newProps){
		let oldControls = this.props.controls;
		let newControls = newProps.controls;
		let updateFlag = false;
		let update = {...this.state.foggers};
		
		if(oldControls.foggerSide1.status != newControls.foggerSide1.status){
			update.foggerSide1.status = newControls.foggerSide1.status;
			updateFlag = true;
		}
		if(oldControls.foggerSide2.status != newControls.foggerSide2.status){
			update.foggerSide2.status = newControls.foggerSide2.status;
			updateFlag = true;
		}
		if(oldControls.autoMode.status != newControls.autoMode.status){
			update.autoMode.status = newControls.autoMode.status;
			updateFlag = true;
		}
		if(oldControls.autoMode.interval != newControls.autoMode.interval){
			update.autoMode.interval = (newControls.autoMode.intervalUnitIndex == 0)
				? (newControls.autoMode.interval / 60 / 1000)
				: (newControls.autoMode.interval / 60 / 60 / 1000);
			updateFlag = true;
		}
		if(oldControls.autoMode.intervalUnitIndex != newControls.autoMode.intervalUnitIndex){
			update.autoMode.intervalUnitIndex = newControls.autoMode.intervalUnitIndex;
			updateFlag = true;
		}
		if(oldControls.autoMode.runFor != newControls.autoMode.runFor){
			update.autoMode.runFor = newControls.autoMode.runFor;
			updateFlag = true;
		}
		if(oldControls.autoMode.runForUnitIndex != newControls.autoMode.runForUnitIndex){
			update.autoMode.runForUnitIndex = newControls.autoMode.runForUnitIndex;
			updateFlag = true;
		}
		if(oldControls.manualMode.runFor != newControls.manualMode.runFor){
			update.manualMode.runFor = newControls.manualMode.runFor;
			updateFlag = true;
		}
		if(oldControls.manualMode.runForUnitIndex != newControls.manualMode.runForUnitIndex){
			update.manualMode.runForUnitIndex = newControls.manualMode.runForUnitIndex;
			updateFlag = true;
		}
		
		if(updateFlag == true){
			let foggers = Object.assign({}, this.state, update);
			this.setState({ foggers });
		}
	}
	
	toggleFoggerSide1(){
		const {status} = this.state.foggers.foggerSide1;
		this.props.foggersActions.toggleFogger(status, 1);
	}
	
	toggleFoggerSide2(){
		const {status} = this.state.foggers.foggerSide2;
		this.props.foggersActions.toggleFogger(status, 2);
	}
	
	toggleAutoMode(){
		const {status} = this.state.foggers.autoMode;
		this.props.foggersActions.toggleAutoMode(status);
	}
	
	resetAutoMode(){
		const {status, interval, intervalUnitIndex, runFor, runForUnitIndex} = this.state.autoMode;	
		this.props.foggersActions.resetAutoMode(status, interval, intervalUnitIndex, runFor, runForUnitIndex);
	}
	
	startManualMode(){
		const {runFor} = this.state.foggers.manualMode;
		this.props.foggersActions.startManualMode(runFor);
	}
	
	render(){
		const { controls } = this.props;
		
		return(
			<App router={Router}>
				<div>
					<div className='content'>
						<div className='width50'>
							<br/>
							<span>Fogger Side 1</span>
							<MuiThemeProvider>
								<Toggle
								  label={ controls.foggerSide1.status == true ? 'ON' : 'OFF' }
								  labelPosition="right"
								  style={toggleStyle}
								  toggled={controls.foggerSide1.status}
								  onToggle={this.toggleFoggerSide1}
								/>
							</MuiThemeProvider>
						</div>
						<div className='width50'>
							<span>Fogger Side 2</span>
							<MuiThemeProvider>
								<Toggle
								  label={ controls.foggerSide2.status == true ? 'ON' : 'OFF' }
								  labelPosition="right"
								  style={toggleStyle}
								  toggled={controls.foggerSide2.status}
								  onToggle={this.toggleFoggerSide2}
								/>
							</MuiThemeProvider>
						</div>
						<AutoMode
							controls={controls}
							toggleAutoMode={this.toggleAutoMode}
						/>
						<ManualMode
							startManualMode={this.startManualMode}
						/>
					</div>
				</div>
			</App>
		)
	}
}

const mapStateToProps = (store) => ({
	controls: store.controlsReducer.controls.foggers
});

const mapDispatchToProps = (dispatch) => ({
	foggersActions: bindActionCreators(foggersActions, dispatch),
	controlsActions: bindActionCreators(controlsActions, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(Foggers);
