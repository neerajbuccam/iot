import tempHumidityAction from '../actions/tempHumidity.action'

const initialState = {
	tempHumidity: [
		{
			sensor: '',
			temperature: 0,
			humidity: 0,
			date: ''
		}
	]
}

export default function tempHumidityReducer(state = initialState, action) {
	switch (action.type) {
		case 'GET_TEMP_HUMIDITY': {
			return Object.assign({}, ...state.tempHumidity, {
				tempHumidity: action.payload
			})
			break;
		}
		case 'FILTER_TEMP_HUMIDITY': {
			return Object.assign({}, ...state.tempHumidity, {
				tempHumidity: action.payload
			})
			break;
		}
		default:
			return state
	}
}
