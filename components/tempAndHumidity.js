import React from 'react'
import {Router} from 'react-router'
import tempHumidityStore from '../stores/tempHumidity.store';
import tempHumidityAction from '../actions/tempHumidity.action'
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

export default class TempAndHumidity extends React.Component{
	constructor(props) {
		super(props);
		toggleTempHumiditySensor = toggleTempHumiditySensor.bind(this);
		
		this.state = tempHumidityStore.getState();
	}
	
	getTempHumidity(){
		return tempHumidityAction.getTempHumidity();
	}
	
	toggleTempHumiditySensor(){
		return tempHumidityAction.toggleTempHumidity();
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
							  defaultToggled={this.state.status}
							  onToggle={toggleTempHumiditySensor}
							/>
						</MuiThemeProvider>
					</div>
					<div className='tempHumidTitle'>
						<MuiThemeProvider>
							<Paper style={circleStyle} zDepth={3} circle={true}>
								<span style={tempFont}>35°c</span>
							</Paper>
						</MuiThemeProvider>
						<div>Temperature</div>
					</div>
					<div className='tempHumidTitle'>
						<MuiThemeProvider>
							<Paper style={circleStyle} zDepth={3} circle={true}>
								<span style={tempFont}>65%</span>
							</Paper>
						</MuiThemeProvider>
						<div>Humidity</div>
					</div>
				</div>
			</App>
		)
	}
}
