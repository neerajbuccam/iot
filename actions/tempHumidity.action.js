import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export function getTempHumidity(){
	return function(){
		axios.get(`${API_URL}/temp-humidity/get_temp_humidity`)
		.then(response => response.json())
		.then(json => {
			dispatch({
				type: 'GET_TEMP_HUMIDITY',
				payload: json.data
			});
		})
	}
}

export function toggleTempHumidity(){
	return function(){
		axios.post(`${API_URL}/temp-humidity/toggle_temp_humidity`)
		.then(response => response.json())
		.then(json => {
			dispatch({
				type: 'TOGGLE_TEMP_HUMIDITY',
				payload: json.data
			});
		})
	}
}
