import React from 'react'
import {Router} from 'react-router'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux';
import tempHumidityActions from '../actions/tempHumidity.action'
import axios from 'axios'
import App from './app'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import Paper from 'material-ui/Paper'
import Toggle from 'material-ui/Toggle'

const circleStyle = {
	height: 70,
	width: 70,
	margin: 10,
	textAlign: 'center',
	display: 'inline-block',
	backgroundColor: 'rgb(223, 255, 171)'
};

const tempFont = {
	fontSize: '25px',
	position: 'relative',
	top: '20px'
};

const toggleStyle = {
	width: '100px'
};

class TempAndHumidity extends React.Component{
	constructor(props) {
		super(props);
		this.getTempHumidity = this.getTempHumidity.bind(this);
		this.toggleTempHumiditySensor = this.toggleTempHumiditySensor.bind(this);
		
		this.state = {
			liveTempHumidity: {
				sensor: '',
				temperature: 0,
				humidity: 0,
				date: ''
			},
			climateCaptureStatus: false
		};
		
		this.API_URL = 'http://192.168.1.100:3000';
		
		//this.getTempHumidity();
		this.getInitialState();
	}
	
	getTempHumidity(){
		return this.props.actions.getTempHumidity();
	}
	
	toggleTempHumiditySensor(){
		axios.post(`${this.API_URL}/api/temp-humidity/toggle_temp_humidity`, {status: !this.state.climateCaptureStatus})
			.then((res) => {
				if(res.data.status.nModified == 1)
					this.setState({
						climateCaptureStatus: !this.state.climateCaptureStatus
					})
			});
		//return this.props.actions.toggleTempHumidity();
	}
	
	getInitialState(){
		axios.get(`${this.API_URL}/api/temp-humidity/get_temp_humidity`)
			.then((response) => { this.setState({
					liveTempHumidity: response.data
				})
			});
				
		axios.get(`${this.API_URL}/api/get_controls`)
			.then((response) => { this.setState({
					climateCaptureStatus: response.data.temp_humidity.status
				})
			});		
	}
	
	render(){
		return(
			<App router={Router}>
				<div>
					<div className='tempHumidStatus'>
						<MuiThemeProvider>
							<Toggle
							  label="status"
							  labelPosition="right"
							  style={toggleStyle}
							  toggled={this.state.climateCaptureStatus}
							  onToggle={this.toggleTempHumiditySensor}
							/>
						</MuiThemeProvider>
					</div>
					<div className='tempHumidTitle'>
						<MuiThemeProvider>
							<Paper style={circleStyle} zDepth={3} circle={true}>
								<span style={tempFont}>{this.state.liveTempHumidity.temperature}°c</span>
							</Paper>
						</MuiThemeProvider>
						<div>Temperature</div>
					</div>
					<div className='tempHumidTitle'>
						<MuiThemeProvider>
							<Paper style={circleStyle} zDepth={3} circle={true}>
								<span style={tempFont}>{this.state.liveTempHumidity.humidity}%</span>
							</Paper>
						</MuiThemeProvider>
						<div>Humidity</div>
					</div>
				</div>
			</App>
		)
	}
}

const mapStateToProps = (state) => ({
	liveTempHumidity: state.liveTempHumidity
});

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(tempHumidityActions, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(TempAndHumidity);
