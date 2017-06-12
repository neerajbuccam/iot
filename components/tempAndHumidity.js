import React from 'react'
import {Router} from 'react-router'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'

import store from '../store/store'
import tempHumidityActions from '../actions/tempHumidity.action'
import controlsActions from '../actions/controls.action'
//import _ from 'lodash'
import App from './app'
import AutoMode from './subComponents/autoMode'

import {circleStyle,
		tempFont,
		toggleStyle,
		intervalStyle,
		unitStyle,
		saveButtonStyle,
		headerStyle,
		cardHeaderStyle,
		cardHeaderTextStyle,
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


class TempAndHumidity extends React.Component{
	constructor(props) {
		super(props);
		
		this.toggleAutoMode = this.toggleAutoMode.bind(this);
		this.handleIntervalChange = this.handleIntervalChange.bind(this);
		this.handleIntervalUnitChange = this.handleIntervalUnitChange.bind(this);
		this.resetAutoMode = this.resetAutoMode.bind(this);
		
		this.state = {
			snackbar: {
				status: false,
				message: ''
			},
			temp_humidity: {
				autoMode: {
					status: false
				}
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
		let update = {...this.state.temp_humidity};
		
		if(oldControls.autoMode.status != newControls.autoMode.status){
			update.autoMode.status = newControls.autoMode.status;
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
			let temp_humidity = Object.assign({}, this.state.temp_humidity, update);
			this.setState({ temp_humidity });
		}
	}
	
	toggleAutoMode(){
		const {status} = this.state.temp_humidity.autoMode;
		this.props.tempHumidityActions.toggleAutoMode(status);
	}
	
	handleIntervalChange(e){
		let autoMode = Object.assign({}, this.state.temp_humidity.autoMode, {
				interval: e.target.value
			});
		this.setState({ autoMode });
	}
	
	handleIntervalUnitChange(index){
		let { autoMode } = this.state.temp_humidity;
		let interval = (autoMode.intervalUnitIndex == 1) ? (autoMode.interval * 60) : (autoMode.interval / 60);
			
		autoMode = Object.assign({}, this.state.temp_humidity.autoMode, {
				intervalUnitIndex: index,
				interval: interval
			});
		this.setState({ autoMode });
	}
	
	resetAutoMode(autoMode){
		const {
			interval,
			intervalUnitIndex
		} = autoMode;
		
		this.props.tempHumidityActions.resetAutoMode(interval, intervalUnitIndex);
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
				<div className='content'>
					<MuiThemeProvider>
						<Subheader style={headerStyle}>
							<i className="fa fa-thermometer-half fa-fw fa-1_5x" aria-hidden="true"></i> Temperature & Humidity
						</Subheader>
					</MuiThemeProvider>
					<br/>
					<div className='pad-hoz-15'>
					<MuiThemeProvider>
					<Card>
						<CardText>
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
						</CardText>
					</Card>
					</MuiThemeProvider>
					</div>
					<br/>
					<AutoMode
						controls={controls}
						toggleAutoMode={this.toggleAutoMode}
						resetAutoMode={this.resetAutoMode}
						runForNeeded={false}
					/>
					<MuiThemeProvider>
					<Snackbar
					  open={this.state.snackbar.status}
					  message={this.state.snackbar.message}
					  autoHideDuration={2000}
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
	tempHumidity: store.tempHumidityReducer.tempHumidity,
	controls: store.controlsReducer.controls.temp_humidity,
	snackbar: store.controlsReducer.controls.snackbar
});

const mapDispatchToProps = (dispatch) => ({
	tempHumidityActions: bindActionCreators(tempHumidityActions, dispatch),
	controlsActions: bindActionCreators(controlsActions, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(TempAndHumidity);
