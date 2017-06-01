import tempHumidityAction from '../actions/tempHumidity.action'

const initialState = {
	liveTempHumidity: {
		sensor: '',
		temperature: 0,
		humidity: 0,
		date: ''
	}
}

export default function tempHumidityReducer(state = initialState, action) {
	switch (action.type) {
		case 'GET_TEMP_HUMIDITY':
			return Object.assign({}, ...state.liveTempHumidity, {
				liveTempHumidity: action.payload
			})
		  
		default:
			return state
	}
}
