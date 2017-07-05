import React from 'react'
import ReactDOM from 'react-dom'
import {Router} from 'react-router'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'

import store from '../store/store'
import tempHumidityActions from '../actions/tempHumidity.action'
import controlsActions from '../actions/controls.action'
import App from './app'

import HighCharts from 'highcharts'
import moment from 'moment'

import {fullHeaderStyle,
		headerStyle,
		refreshIconStyle,
		desktopModules} from '../public/componentStyles'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import Subheader from 'material-ui/Subheader'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
import DatePicker from 'material-ui/DatePicker'
import {Card,
		CardHeader,
		CardText} from 'material-ui/Card'

const chartStyle = {
	width: '100%',
	height: '300px'
};

const moduleCard = {
	width: '47%',
	display: 'inline-block',
    margin: '5px'
};

const dateFilterStyle = {
	width: '7em'
};

const cardTextStyle = { padding: '5px' };

let tempSeriesData = {};

class Dashboard extends React.Component {
	constructor(props) {
		super(props);
		
		this.initChart = this.initChart.bind(this);
		this.refreshState = this.refreshState.bind(this);
		this.dateFilterChange = this.dateFilterChange.bind(this);
		this.refreshNode = null;
		this.chartBoxNode = null;
		
		this.state = {
			tempHumidity: [],
			controls: {},
			dateFilter: new Date()
		}
	}
	
	componentWillMount() {
		this.props.tempHumidityActions.filterTempHumidity(this.state.dateFilter);
		this.props.controlsActions.getControls();
		this.justLoaded = true;
	}
	
	componentDidMount() {
		this.chartBoxNode = ReactDOM.findDOMNode(this.refs.chartBox);
		this.chartBoxNode.classList.add('hide');
	}
	
	componentWillReceiveProps(newProps) {
		let oldControls = this.props;
		let newControls = newProps;
		let updateFlag = false;
		let update = {};
		
		if(JSON.stringify(oldControls.controls) != JSON.stringify(newControls.controls)){
			update = newControls.controls;
			
			let controls = Object.assign({}, this.state.controls, update);
			this.setState({ controls });
			updateFlag = true;
		}
		
		if(Object.keys(this.state.tempHumidity).length == 0 || JSON.stringify(oldControls.tempHumidity) != JSON.stringify(newControls.tempHumidity)){
			update = newControls.tempHumidity;
			
			let tempHumidity = Object.assign({}, this.state.tempHumidity, update);
			this.setState({ tempHumidity });
			
			if(newControls.tempHumidity[0].date != '') {
				this.setState({
				  dateFilter: new Date(newControls.tempHumidity[0].date)
				});
			}
			updateFlag = true;
		}
		
		if(this.refreshNode)
			this.refreshNode.classList.remove('fa-spin');
	}
	
	componentDidUpdate(prevProps, prevState){
		if (prevProps.tempHumidity.length > 1) {
			tempSeriesData.temperature = [];
			tempSeriesData.humidity = [];
			let tempHumidity = this.state.tempHumidity;
			
			Object.keys(tempHumidity).forEach((key, index) => {
				let tempData = [];
				let humidData = [];
				tempData.push(moment(tempHumidity[key].date).add(5.5, 'hours').valueOf());
				tempData.push(tempHumidity[key].temperature);
				humidData.push(moment(tempHumidity[key].date).add(5.5, 'hours').valueOf());
				humidData.push(tempHumidity[key].humidity);
				
				tempSeriesData.temperature.push(tempData);
				tempSeriesData.humidity.push(humidData);
				
				if(Object.keys(tempSeriesData.temperature).length >= 2 
				&& Object.keys(tempHumidity).length == index+1) {
					this.initChart();
				}
			});
		}
	}
	
	refreshState(){
		this.refreshNode = ReactDOM.findDOMNode(this.refs.refresh);
		this.refreshNode.classList.add('fa-spin');
		this.props.controlsActions.getControls();
	}
	
	dateFilterChange = (event, date) => {
		this.props.tempHumidityActions.filterTempHumidity(date);
	}
	
	initChart() {
		this.chartBoxNode.classList.remove('hide');
		this.chartBoxNode.classList.add('show');
		
		let chart = HighCharts.chart('chart', {
			chart: { type: 'spline' },
			credits: {
				enabled: false
			},
			title: false,
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
		const { controls } = this.props;
		
		return(
			<App router={Router}>
				<div className='content'>
					<div className='pad-hoz-15'>
					<div ref="chartBox">
					<MuiThemeProvider>
						<Card>
							<CardText>
								<div className="center">
									<MuiThemeProvider>
										<Subheader style={headerStyle}>
											<i className="fa fa-thermometer-half fa-fw fa-1_5x" aria-hidden="true"></i> Temperature & Humidity Report
										</Subheader>
									</MuiThemeProvider>
									<MuiThemeProvider>
										<DatePicker
											hintText="Filter by Date"
											value={this.state.dateFilter}
											onChange={this.dateFilterChange}
											formatDate={new global.Intl.DateTimeFormat('en-US', {
												day: 'numeric',
												month: 'long',
												year: 'numeric',
												timeZone: 'Asia/Kolkata'
											}).format}
											textFieldStyle={dateFilterStyle}
											autoOk={true}
										/>
									</MuiThemeProvider>
									<div id="chart" style={chartStyle}></div>
								</div>
							</CardText>
						</Card>
					</MuiThemeProvider>
					</div>
					<br/><br/>
					<MuiThemeProvider>
						<Card>
							<CardText>
							<div>
							<MuiThemeProvider>
								<Subheader style={headerStyle}>
									<i className="fa fa-cogs fa-fw fa-1_5x" aria-hidden="true"></i> Modules Status
									<div style={refreshIconStyle}>
										<i onClick={this.refreshState} ref="refresh" className="fa fa-refresh fa-fw fa-1_5x" aria-hidden="true"></i>
									</div>
								</Subheader>
							</MuiThemeProvider>
							<MuiThemeProvider>
								<Card style={moduleCard}>
									<CardText style={cardTextStyle}>
										<MuiThemeProvider>
											<Subheader style={desktopModules}>
												<i className="fa fa-shower fa-fw dashboardModuleIcon" aria-hidden="true"></i> Fogger 1
											</Subheader>
										</MuiThemeProvider>
										<div className={controls.foggers.foggerSide1.status ? 'moduleStatusLight moduleStatusLightON' : 'moduleStatusLight moduleStatusLightOFF'}></div>
									</CardText>
								</Card>
							</MuiThemeProvider>
							<MuiThemeProvider>
								<Card style={moduleCard}>
									<CardText style={cardTextStyle}>
										<MuiThemeProvider>
											<Subheader style={desktopModules}>
												<i className="fa fa-shower fa-fw dashboardModuleIcon" aria-hidden="true"></i> Fogger 2
											</Subheader>
										</MuiThemeProvider>
										<div className={controls.foggers.foggerSide2.status ? 'moduleStatusLight moduleStatusLightON' : 'moduleStatusLight moduleStatusLightOFF'}></div>
									</CardText>
								</Card>
							</MuiThemeProvider>
							<MuiThemeProvider>
								<Card style={moduleCard}>
									<CardText style={cardTextStyle}>
										<MuiThemeProvider>
											<Subheader style={desktopModules}>
												<i className="fa fa-superpowers fa-fw dashboardModuleIcon" aria-hidden="true"></i> Sprinkler 1
											</Subheader>
										</MuiThemeProvider>
										<div className={controls.sprinklers.sprinklerSide1.status ? 'moduleStatusLight moduleStatusLightON' : 'moduleStatusLight moduleStatusLightOFF'}></div>
									</CardText>
								</Card>
							</MuiThemeProvider>
							<MuiThemeProvider>
								<Card style={moduleCard}>
									<CardText style={cardTextStyle}>
										<MuiThemeProvider>
											<Subheader style={desktopModules}>
												<i className="fa fa-superpowers fa-fw dashboardModuleIcon" aria-hidden="true"></i> Sprinkler 2
											</Subheader>
										</MuiThemeProvider>
										<div className={controls.sprinklers.sprinklerSide2.status ? 'moduleStatusLight moduleStatusLightON' : 'moduleStatusLight moduleStatusLightOFF'}></div>
									</CardText>
								</Card>
							</MuiThemeProvider>
							<MuiThemeProvider>
								<Card style={moduleCard}>
									<CardText style={cardTextStyle}>
										<MuiThemeProvider>
											<Subheader style={desktopModules}>
												<i className="fa fa-lightbulb-o fa-fw dashboardModuleIcon" aria-hidden="true"></i> Lights 1
											</Subheader>
										</MuiThemeProvider>
										<div className={controls.lights_1.status ? 'moduleStatusLight moduleStatusLightON' : 'moduleStatusLight moduleStatusLightOFF'}></div>
									</CardText>
								</Card>
							</MuiThemeProvider>
							<MuiThemeProvider>
								<Card style={moduleCard}>
									<CardText style={cardTextStyle}>
										<MuiThemeProvider>
											<Subheader style={desktopModules}>
												<i className="fa fa-lightbulb-o fa-fw dashboardModuleIcon" aria-hidden="true"></i> Lights 2
											</Subheader>
										</MuiThemeProvider>
										<div className={controls.lights_2.status ? 'moduleStatusLight moduleStatusLightON' : 'moduleStatusLight moduleStatusLightOFF'}></div>
									</CardText>
								</Card>
							</MuiThemeProvider>
							<MuiThemeProvider>
								<Card style={moduleCard}>
									<CardText style={cardTextStyle}>
										<MuiThemeProvider>
											<Subheader style={desktopModules}>
												<i className="fa fa-tint fa-fw dashboardModuleIcon" aria-hidden="true"></i> Water Pump
											</Subheader>
										</MuiThemeProvider>
										<div className={controls.water_pump.status ? 'moduleStatusLight moduleStatusLightON' : 'moduleStatusLight moduleStatusLightOFF'}></div>
									</CardText>
								</Card>
							</MuiThemeProvider>
							</div>
							</CardText>
						</Card>
					</MuiThemeProvider>
					<br/><br/>
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
