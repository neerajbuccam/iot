import React from 'react'
import {Router} from 'react-router'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'

import store from '../store/store'
import tempHumidityActions from '../actions/tempHumidity.action'
import controlsActions from '../actions/controls.action'
import App from './app'

import HighCharts from 'highcharts'
import moment from 'moment'

import {fullHeaderStyle} from '../public/componentStyles'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import Subheader from 'material-ui/Subheader'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
import {Card,
		CardHeader,
		CardText} from 'material-ui/Card'

const chartStyle = {
	width: '100%',
	height: '300px'
};

let tempSeriesData = {};

class Dashboard extends React.Component {
	constructor(props) {
		super(props);
		
		this.initChart = this.initChart.bind(this);
		
		this.state = {
			tempHumidity: [],
			controls: {}
		}
	}
	
	componentWillMount() {
		this.props.tempHumidityActions.filterTempHumidity(new Date());
		this.props.controlsActions.getControls();
		this.justLoaded = true;
	}
	
	componentWillReceiveProps(newProps) {
		let oldControls = this.props;
		let newControls = newProps;
		let update = {};
		
		if(JSON.stringify(oldControls.controls) != JSON.stringify(newControls.controls)){
			update = newControls.controls;
			
			let controls = Object.assign({}, this.state.controls, update);
			this.setState({ controls });
		}
		
		if(Object.keys(this.state.tempHumidity).length == 0 || JSON.stringify(oldControls.tempHumidity) != JSON.stringify(newControls.tempHumidity)){
			update = newControls.tempHumidity;
			
			let tempHumidity = Object.assign({}, this.state.tempHumidity, update);
			this.setState({ tempHumidity });
		}
	}
	
	componentDidUpdate(prevProps, prevState){
		if (prevProps.tempHumidity.length > 1) {
			tempSeriesData.temperature = [];
			tempSeriesData.humidity = [];
			const tempHumidity = this.state.tempHumidity;
			
			Object.keys(tempHumidity).forEach((key, index) => {
				let tempData = [];
				let humidData = [];
				tempData.push(moment(tempHumidity[key].date).add(5.5, 'hours').valueOf());
				tempData.push(tempHumidity[key].temperature);
				humidData.push(moment(tempHumidity[key].date).add(5.5, 'hours').valueOf());
				humidData.push(tempHumidity[key].humidity);
				
				tempSeriesData.temperature.push(tempData);
				tempSeriesData.humidity.push(humidData);
				
				if(Object.keys(tempHumidity).length == index+1) {
					this.initChart();
				}
			});
				console.log(tempSeriesData);
		}
	}
	
	initChart() {
		let chart = HighCharts.chart('chart', {
			chart: { type: 'spline' },
			title: {
				text: 'Temperature & Humidity Report',
				style: {
					color: 'rgba(107, 23, 142, 0.7)',
					fontWeight: '600',
					fontFamily: 'Roboto,sans-serif'
				}
			},
			xAxis: {
				type: 'datetime',
				tickInterval: 24 * 60 * 60 * 30
			},
			yAxis: {
				title: { text: '<b>Temperature ( °C ) , Humidity ( % )</b>' },
				labels: {
					formatter: function() {
						this.axis.defaultLabelFormatter.call(this);
						return '<span style="font-size: 14px;">' + this.value + '</span>'
					}
				},
				tickInterval: 1,
				min:15
			},
			tooltip: {
				formatter: function() {
			document.getElementsByClassName('highcharts-credits')[0].style.display = 'hidden';
					var text = '';
					if(this.series.name == 'Temperature') {
						text = '<b>' + HighCharts.numberFormat(this.y, 1) + '°C</b><br>'
								+ HighCharts.dateFormat('%e %b, %Y %I:%M %p', this.x);
					} else {
						text = '<b>' + HighCharts.numberFormat(this.y, 1) + '%</b><br>'
								+ HighCharts.dateFormat('%e %b, %Y %I:%M %p', this.x);
					}
					return text;
				}
			},
			series: [
				{
					name: 'Temperature',
					data: tempSeriesData.temperature,
					color: HighCharts.getOptions().colors[8],
					dashStyle: 'ShortDashDot'
				},
				{
					name: 'Humidity',
					data: tempSeriesData.humidity,
					color: HighCharts.getOptions().colors[0],
					dashStyle: 'ShortDashDot'
				}
			]
		});

	}
	
	render() {
		return(
			<App router={Router}>
				<div className='content'>
					<div className='pad-hoz-15'>
					<MuiThemeProvider>
						<Card>
							<CardText>
								<div>
									<div id="chart" style={chartStyle}></div>
								</div>
							</CardText>
						</Card>
					</MuiThemeProvider>
					</div>
				</div>
			</App>
		)
	}
}

const mapStateToProps = (store) => ({
	tempHumidity: store.tempHumidityReducer.tempHumidity,
	controls: store.controlsReducer.controls
});

const mapDispatchToProps = (dispatch) => ({
	tempHumidityActions: bindActionCreators(tempHumidityActions, dispatch),
	controlsActions: bindActionCreators(controlsActions, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
