import axios from 'axios';

const API_URL = 'http://' + window.location.hostname + ':' + window.location.port + '/api';

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

const controlsAction = {
	getControls
};

export default controlsAction;
