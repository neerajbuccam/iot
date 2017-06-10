import axios from 'axios';

const API_URL = 'http://' + window.location.hostname + ':' + window.location.port + '/api';

function toggleFogger(status, side){
	return function(dispatch){
		axios.post(`${API_URL}/controls/toggle_fogger`, {status: !status, side: side})
		.then(response => {
			if(side == 1){
				dispatch({
					type: 'TOGGLE_FOGGER_1',
					payload: response.data.controls.foggers.foggerSide1.status
				});
			}
			else if(side == 2){
				dispatch({
					type: 'TOGGLE_FOGGER_2',
					payload: response.data.controls.foggers.foggerSide2.status
				});
			}
		});
	}
}

function toggleAutoMode(status){
	return function(dispatch){
		axios.post(`${API_URL}/controls/fogger_toggleAutoMode`, { status: !status })
		.then(response => {
			dispatch({
				type: 'TOGGLE_AUTO_MODE',
				payload: response.data.controls
			});
		});
	}
}

function resetAutoMode(status, interval, intervalUnitIndex, runFor, runForUnitIndex){
	return function(dispatch){
		interval = (intervalUnitIndex == 0) ? (interval * 60 * 1000) : (interval *60 * 60 * 1000);
		runFor = (runForUnitIndex == 0) ? (runFor * 60 * 1000) : (runFor *60 * 60 * 1000);
		
		axios.post(`${API_URL}/controls/fogger_toggleAutoMode`, {
			status: !status,
			interval: interval,
			runFor: runFor
			})
		.then(response => {
			dispatch({
				type: 'RESET_AUTO_MODE',
				payload: true
			});
		});
	}
}

const foggersAction = {
	toggleFogger,
	toggleAutoMode,
	resetAutoMode
};

export default foggersAction;
