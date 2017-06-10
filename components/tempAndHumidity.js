import React from 'react'
import {Router} from 'react-router'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'

import store from '../store/store'
import tempHumidityActions from '../actions/tempHumidity.action'
import controlsActions from '../actions/controls.action'
//import _ from 'lodash'
import App from './app'

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


class TempAndHumidity extends React.Component{
	constructor(props) {
		super(props);
		
		this.toggleTempHumidity = this.toggleTempHumidity.bind(this);
		this.handleIntervalChange = this.handleIntervalChange.bind(this);
		this.handleIntervalUnitChange = this.handleIntervalUnitChange.bind(this);
		this.updateInterval = this.updateInterval.bind(this);
		
		this.state = {
			controls: {
				status: false,
				interval: 0,
				unitIndex: 0
			}
		};
	}
	
	componentWillMount(){
		this.props.tempHumidityActions.getTempHumidity();
		this.props.controlsActions.getControls();
	}
	
	componentWillReceiveProps(newProps){
		let oldControls = this.props.controls;
		let newControls = newProps.controls;
		let updateFlag = false;
		let update = {};
		
		if(oldControls.status != newControls.status){
			update.status = newControls.status;
			updateFlag = true;
		}
		
		if(oldControls.interval != newControls.interval){
			if(newControls.unitIndex == 0)
				update.interval = (newControls.interval / 60 / 1000);
			else if(newControls.unitIndex == 1)
				update.interval = (newControls.interval / 60 / 60 / 1000);
			updateFlag = true;
		}
		
		if(oldControls.unitIndex != newControls.unitIndex){
			update.unitIndex = newControls.unitIndex;
			updateFlag = true;
		}
		
		if(updateFlag == true){
			let controls = Object.assign({}, this.state.controls, update);
			this.setState({ controls });
		}
	}
	
	toggleTempHumidity(){
		const {status} = this.state.controls;
		this.props.tempHumidityActions.toggleTempHumidity(status);
	}
	
	handleIntervalChange(e){
		let controls = Object.assign({}, this.state.controls, {
				interval: e.target.value
			});
		this.setState({ controls });
	}
	
	handleIntervalUnitChange(index){
		let { controls } = this.state;
		let interval = (controls.unitIndex == 1) ? (controls.interval * 60) : (controls.interval / 60);
			
		controls = Object.assign({}, this.state.controls, {
				unitIndex: index,
				interval: interval
			});
		this.setState({ controls });
	}
	
	updateInterval(){
		const {interval, unitIndex} = this.state.controls;
		this.props.tempHumidityActions.updateInterval(interval, unitIndex);
	}
	
	render(){
		const {
			tempHumidity,
			controls,
			tempHumidityActions,
			controlsActions
		} = this.props;
		
		return(
			<App router={Router}>
				<div>
					<div className='tempHumidTitle'>
						<MuiThemeProvider>
							<Paper style={circleStyle} zDepth={3} circle={true}>
								<span style={tempFont}>{tempHumidity[0].temperature}°c</span>
							</Paper>
						</MuiThemeProvider>
						<div>Temperature</div>
					</div>
					<div className='tempHumidTitle'>
						<MuiThemeProvider>
							<Paper style={circleStyle} zDepth={3} circle={true}>
								<span style={tempFont}>{tempHumidity[0].humidity}%</span>
							</Paper>
						</MuiThemeProvider>
						<div>Humidity</div>
					</div>
					<div className='content'>
						<div className='pad-top-15'>
							<MuiThemeProvider>
								<Divider />
							</MuiThemeProvider>
							<MuiThemeProvider>
								<Subheader style={subheaderStyle}>Auto Mode</Subheader>
							</MuiThemeProvider>
							<br/>
							<MuiThemeProvider>
								<Toggle
								  label={ controls.status == true ? 'ON' : 'OFF' }
								  labelPosition="right"
								  style={toggleStyle}
								  toggled={controls.status}
								  onToggle={this.toggleTempHumidity}
								/>
							</MuiThemeProvider>
						</div>
						<div className='pad-top-15'>
							<MuiThemeProvider>
								<TextField
								  style={intervalStyle}
								  value={this.state.controls.interval}
								  onChange={(e) => {this.handleIntervalChange(e)}}
								  floatingLabelText="Capture Interval"
								/>
							</MuiThemeProvider>
							<MuiThemeProvider>								
								<SelectField
								  floatingLabelText="Unit"
								  style={unitStyle}
								  value={this.state.controls.unitIndex}
								  onChange={(e, newIndex) => {this.handleIntervalUnitChange(newIndex)}}
								  autoWidth={true}
								>
								  <MenuItem value={0} primaryText="Minutes" />
								  <MenuItem value={1} primaryText="Hours" />
								</SelectField>
							</MuiThemeProvider>
							<br/><br/>
							<MuiThemeProvider>
								<RaisedButton
									style={saveButtonStyle}
									primary={true}
									icon={<i className="fa fa-floppy-o fa-1_5x" aria-hidden="true"></i>}
									onTouchTap={this.updateInterval}
								/>
							</MuiThemeProvider>
						</div>
					</div>
				</div>
			</App>
		)
	}
}

const mapStateToProps = (store) => ({
	tempHumidity: store.tempHumidityReducer.tempHumidity,
	controls: store.controlsReducer.controls.temp_humidity
});

const mapDispatchToProps = (dispatch) => ({
	tempHumidityActions: bindActionCreators(tempHumidityActions, dispatch),
	controlsActions: bindActionCreators(controlsActions, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(TempAndHumidity);
