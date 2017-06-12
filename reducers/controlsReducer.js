import controlsAction from '../actions/controls.action'

const initialState = {
	controls: {
		water_pump: {
			status: false,
			run_for: 0
		},
		foggers: {
			foggerSide1: { status: false },
			foggerSide2: { status: false },
			autoMode: {
				status: false,
				interval: 0,
				intervalUnitIndex: 0,
				runFor: 0,
				runForUnitIndex: 0
			},
			manualMode: {
				status: false,
				runFor: 0,
				runForUnitIndex: 0
			}
		},
		sprinklers: {
			status: false,
			autoMode: false,
			interval: 0,
			run_for: 0
		},
		temp_humidity: {
			autoMode: {
				status: false,
				interval: 0,
				intervalUnitIndex: 0
			}
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
		case 'TOGGLE_TEMP_HUMIDITY': {
			return Object.assign({}, ...state.controls, {
				controls: action.payload
			})
			break;
		}
		case 'TOGGLE_FOGGER_1': {
			return Object.assign({}, ...state.controls, {
				controls: action.payload
			})
			break;
		}
		case 'TOGGLE_FOGGER_2': {
			return Object.assign({}, ...state.controls, {
				controls: action.payload
			})
			break;
		}
		case 'TOGGLE_AUTO_MODE': {
			return Object.assign({}, ...state.controls, {
				controls: action.payload
			})
			break;
		}
		case 'RESET_AUTO_MODE': {
			return Object.assign({}, ...state.controls, {
				controls: Object.assign({}, action.payload, {
					snackbar: {
						status: true,
						message: 'Auto Mode Reset Successful'
					}
				})
			})
			break;
		}
		case 'TOGGLE_MANUAL_MODE': {
			return Object.assign({}, ...state.controls, {
				controls: action.payload
			})
			break;
		}
		case 'START_MANUAL_MODE': {
			return Object.assign({}, ...state.controls, {
				controls: Object.assign({}, action.payload, {
					snackbar: {
						status: true,
						message: 'Manual Mode Started'
					}
				})
			})
			break;
		}
		default:
			return state
	}
}
