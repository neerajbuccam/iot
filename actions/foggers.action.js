import axios from 'axios';

const API_URL = 'http://' + window.location.hostname + ':' + window.location.port + '/api';

function toggleFogger(status, side){
	return function(dispatch){
		axios.post(`${API_URL}/controls/toggle_fogger`, {status: !status, side: side})
		.then(response => {
			if(side == 'side1'){
				dispatch({
					type: 'TOGGLE_FOGGER_1',
					payload: response.data.controls
				});
			}
			else if(side == 'side2'){
				dispatch({
					type: 'TOGGLE_FOGGER_2',
					payload: response.data.controls
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

function resetAutoMode(interval, intervalUnitIndex, runFor, runForUnitIndex){
	return function(dispatch){
		let args = {
				interval: interval,
				intervalUnitIndex: intervalUnitIndex,
				runFor: runFor,
				runForUnitIndex: runForUnitIndex
			};
		interval = (intervalUnitIndex == 0) ? (interval * 60 * 1000) : (interval *60 * 60 * 1000);
		runFor = (runForUnitIndex == 0) ? (runFor * 60 * 1000) : (runFor *60 * 60 * 1000);
		
		axios.post(`${API_URL}/controls/fogger_resetAutoMode`, {
			interval: interval,
			intervalUnitIndex: intervalUnitIndex,
			runFor: runFor,
			runForUnitIndex: runForUnitIndex,
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

function toggleManualMode(status){
	return function(dispatch){
		axios.post(`${API_URL}/controls/fogger_toggleManualMode`, { status: !status })
		.then(response => {
			dispatch({
				type: 'TOGGLE_MANUAL_MODE',
				payload: response.data.controls
			});
		});
	}
}

function startManualMode(runFor, runForUnitIndex){
	return function(dispatch){
		runFor = (runForUnitIndex == 0) ? (runFor * 60 * 1000) : (runFor *60 * 60 * 1000);
		
		axios.post(`${API_URL}/controls/fogger_startManualMode`, {
			runFor: runFor,
			runForUnitIndex: runForUnitIndex
		})
		.then(response => {
			dispatch({
				type: 'START_MANUAL_MODE',
				payload: response.data.controls
			});
		});
	}
}

const foggersAction = {
	toggleFogger,
	toggleAutoMode,
	resetAutoMode,
	toggleManualMode,
	startManualMode
};

export default foggersAction;
