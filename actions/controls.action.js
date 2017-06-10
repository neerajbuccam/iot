import axios from 'axios';

const API_URL = 'http://' + window.location.hostname + ':' + window.location.port + '/api';
//const API_URL = 'http://localhost:3000/api';

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
