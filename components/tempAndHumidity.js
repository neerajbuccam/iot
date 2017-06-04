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
			}
		};
		
		//this.getTempHumidity();
		this.getInitialState();
	}
	
	getTempHumidity(){
		return this.props.actions.getTempHumidity();
	}
	
	toggleTempHumiditySensor(){
		return this.props.actions.toggleTempHumidity();
	}
	
	getInitialState(){
		const API_URL = 'http://localhost:3000/api';
		axios.get(`${API_URL}/temp-humidity/get_temp_humidity`)
				.then((response) => { this.setState({
					liveTempHumidity: response.data
				}) });
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
							  //defaultToggled={this.state.status}
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
