import axios from 'axios';

const API_URL = 'http://' + window.location.hostname + ':' + window.location.port + '/api';

function getTempHumidity(){
	return function(dispatch){
		axios.get(`${API_URL}/temp-humidity/get_temp_humidity`)
		.then(response => {
			dispatch({
				type: 'GET_TEMP_HUMIDITY',
				payload: response.data
			});
		});
	}
}

function toggleAutoMode(status){
	return function(dispatch){
		axios.post(`${API_URL}/controls/tempHumidity_toggleAutoMode`, {status: !status})
		.then(response => {
			dispatch({
				type: 'TOGGLE_TEMP_HUMIDITY',
				payload: response.data.controls
			});
		});
	}
}

function resetAutoMode(interval, intervalUnitIndex){
	return function(dispatch){
		let args = {
				interval: interval,
				intervalUnitIndex: intervalUnitIndex
			};
		interval = (intervalUnitIndex == 0) ? (interval * 60 * 1000) : (interval *60 * 60 * 1000);

		axios.post(`${API_URL}/controls/temp_humidity_resetAutoMode`, {
			interval: interval,
			intervalUnitIndex: intervalUnitIndex,
			args: args
		})
		.then(response => {
			dispatch({
				type: 'RESET_AUTO_MODE',
				payload: response.data.controls
			});
		});
	}
}

const tempHumidityAction = {
	getTempHumidity,
	toggleAutoMode,
	resetAutoMode
};

export default tempHumidityAction;
