import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

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

const tempHumidityAction = {
	getTempHumidity
};

export default tempHumidityAction;
