import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

function getControls(){
	return function(dispatch){
		axios.get(`${API_URL}/controls/get_controls`)
		.then(response => {
			dispatch({
				type: 'GET_CONTROLS',
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
				type: 'TOGGLE_CONTROL',
				payload: response.data.controls
			});
		});
	}
}

function updateInterval(interval, unitIndex){
	return function(dispatch){
		axios.post(`${API_URL}/controls/update_temp_humidity_interval`, {interval: interval, unitIndex: unitIndex})
		.then(response => {
			dispatch({
				type: 'UPDATE_INTERVAL',
				payload: response.data.controls
			});
		});
	}
}

const controlsAction = {
	getControls,
	toggleTempHumidity,
	updateInterval
};

export default controlsAction;
