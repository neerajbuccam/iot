import axios from 'axios';

const API_URL = 'http://' + window.location.hostname + ':' + window.location.port + '/api';

function toggleModule(module, status){
	return function(dispatch){
		axios.post(`${API_URL}/controls/extras_toggleModule`, {module: module, status: !status})
		.then(response => {
			dispatch({
				type: 'TOGGLE_EXTRAS',
				payload: response.data.controls
			});
		});
	}
}

const extrasAction = {
	toggleModule
};

export default extrasAction;
