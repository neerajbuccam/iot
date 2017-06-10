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

function toggleTempHumidity(status){
	return function(dispatch){
		axios.post(`${API_URL}/controls/toggle_temp_humidity`, {status: !status})
		.then(response => {
			dispatch({
				type: 'TOGGLE_TEMP_HUMIDITY',
				payload: response.data.controls
			});
		});
	}
}

function updateInterval(interval, unitIndex){
	return function(dispatch){
		interval = (unitIndex == 0) ? (interval * 60 * 1000) : (interval *60 * 60 * 1000);
		
		axios.post(`${API_URL}/controls/update_temp_humidity_interval`, {interval: interval, unitIndex: unitIndex})
		.then(response => {
			dispatch({
				type: 'UPDATE_TEMP_HUMIDITY_INTERVAL',
				payload: response.data.controls
			});
		});
	}
}

const tempHumidityAction = {
	getTempHumidity,
	toggleTempHumidity,
	updateInterval
};

export default tempHumidityAction;
