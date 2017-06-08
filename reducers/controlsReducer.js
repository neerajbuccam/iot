import controlsAction from '../actions/controls.action'

const initialState = {
	controls: {
		water_pump: {
			status: false,
			run_for: 0
		},
		foggers: {
			status: false,
			autoMode: false,
			interval: 0,
			run_for: 0
		},
		sprinklers: {
			status: false,
			autoMode: false,
			interval: 0,
			run_for: 0
		},
		temp_humidity: {
			status: false,
			interval: 0,
			unitIndex: 0
		},
		light_1: {
			status: false
		}
	}
}

export default function controlsReducer(state = initialState, action) {
	switch (action.type) {
		case 'GET_CONTROLS': {
			return Object.assign({}, ...state.controls, {
						controls: action.payload
					})
			break;
		}
		case 'TOGGLE_CONTROL': {
			return Object.assign({}, ...state.controls, {
						controls: action.payload
					})
			break;
		}
		case 'UPDATE_INTERVAL': {
			return Object.assign({}, ...state.controls, {
						controls: action.payload
					})
			break;
		}
		default:
			return state
	}
}
