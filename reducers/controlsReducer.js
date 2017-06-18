import controlsAction from '../actions/controls.action'

const initialState = {
	controls: {
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
			sprinklerSide1: { status: false },
			sprinklerSide2: { status: false },
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
		temp_humidity: {
			autoMode: {
				status: false,
				interval: 0,
				intervalUnitIndex: 0
			}
		},
		water_pump: {
			status: false
		},
		lights_1: {
			status: false
		},
		lights_2: {
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
		case 'TOGGLE_SPRINKLER_1': {
			return Object.assign({}, ...state.controls, {
				controls: action.payload
			})
			break;
		}
		case 'TOGGLE_SPRINKLER_2': {
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
		case 'TOGGLE_EXTRAS': {
			return Object.assign({}, ...state.controls, {
				controls: action.payload
			})
			break;
		}
		default:
			return state
	}
}
