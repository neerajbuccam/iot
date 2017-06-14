import React from 'react'

import {circleStyle,
		tempFont,
		toggleStyle,
		intervalStyle,
		unitStyle,
		saveButtonStyle,
		headerStyle,
		cardTextStyle,
		itemSubheaderStyle,
		subheaderStyle} from '../../public/componentStyles'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import Subheader from 'material-ui/Subheader'
import Toggle from 'material-ui/Toggle'
import TextField from 'material-ui/TextField'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
import RaisedButton from 'material-ui/RaisedButton'
import {Card,
		CardHeader,
		CardText} from 'material-ui/Card'


class AutoMode extends React.Component{
	constructor(props) {
		super(props);
		
		this.autoMode_intervalChange = this.autoMode_intervalChange.bind(this);
		this.autoMode_intervalUnitChange = this.autoMode_intervalUnitChange.bind(this);
		this.autoMode_runForChange = this.autoMode_runForChange.bind(this);
		this.autoMode_runForUnitChange = this.autoMode_runForUnitChange.bind(this);
		
		this.state = {
			autoMode: {
				interval: 0,
				intervalUnitIndex: 0,
				runFor: 0,
				runForUnitIndex: 0
			}
		};
	}
	
	componentWillMount(){
		this.justLoaded = true;
	}
	
	componentWillReceiveProps(newProps){
		let oldControls = this.props.controls;
		let newControls = newProps.controls;
		let updateFlag = false;
		let update = {...this.state};
		
		if(this.justLoaded || oldControls.autoMode.interval != newControls.autoMode.interval){
			update.autoMode.interval = (newControls.autoMode.intervalUnitIndex == 0)
				? (newControls.autoMode.interval / 60 / 1000)
				: (newControls.autoMode.interval / 60 / 60 / 1000);
			updateFlag = true;
		}
		if(this.justLoaded || oldControls.autoMode.intervalUnitIndex != newControls.autoMode.intervalUnitIndex){
			update.autoMode.intervalUnitIndex = newControls.autoMode.intervalUnitIndex;
			updateFlag = true;
		}
		if(this.justLoaded || oldControls.autoMode.runFor != newControls.autoMode.runFor){
			update.autoMode.runFor = (newControls.autoMode.runForUnitIndex == 0)
				? (newControls.autoMode.runFor / 60 / 1000)
				: (newControls.autoMode.runFor / 60 / 60 / 1000);
			updateFlag = true;
		}
		if(this.justLoaded || oldControls.autoMode.runForUnitIndex != newControls.autoMode.runForUnitIndex){
			update.autoMode.runForUnitIndex = newControls.autoMode.runForUnitIndex;
			updateFlag = true;
		}
		
		if(updateFlag == true){
			let autoMode = Object.assign({}, this.state.autoMode, update);
			this.setState({ autoMode });
		}
	}
	
	autoMode_intervalChange(e){
		let autoMode = Object.assign({}, this.state.autoMode, {
				interval: e.target.value
			});
		this.setState({ autoMode });
	}
	
	autoMode_intervalUnitChange(index){
		let { autoMode } = this.state;
		let interval = (autoMode.intervalUnitIndex == 1)
			? (autoMode.interval * 60)
			: (autoMode.interval / 60);

		autoMode = Object.assign({}, this.state.autoMode, {
				intervalUnitIndex: index,
				interval: interval
			});
		this.setState({ autoMode });
	}
	
	autoMode_runForChange(e){
		let autoMode = Object.assign({}, this.state.autoMode, {
				runFor: e.target.value
			});
		this.setState({ autoMode });
	}
	
	autoMode_runForUnitChange(index){
		let { autoMode } = this.state;
		let runFor = (autoMode.runForUnitIndex == 1)
			? (autoMode.runFor * 60)
			: (autoMode.runFor / 60);
			
		autoMode = Object.assign({}, this.state.autoMode, {
				runForUnitIndex: index,
				runFor: runFor
			});
		this.setState({ autoMode });
	}
	
	render(){
		const {
			controls,
			toggleAutoMode,
			resetAutoMode,
			runForNeeded
		} = this.props;
		
		return(
			<div className='pad-hoz-15'>
			<MuiThemeProvider>
				<Card expanded={controls.autoMode.status} >
					<CardText>
						  <div>
							<MuiThemeProvider>
								<Subheader style={subheaderStyle}>Auto Mode</Subheader>
							</MuiThemeProvider>
							<MuiThemeProvider>
								<Toggle
								  label={ controls.autoMode.status == true ? 'ON' : 'OFF' }
								  labelPosition="right"
								  style={toggleStyle}
								  toggled={controls.autoMode.status}
								  onToggle={toggleAutoMode}
								/>
							</MuiThemeProvider>
						</div>
					</CardText>
					<CardText expandable={true} style={cardTextStyle}>
						<div className='text-center'>
							<MuiThemeProvider>
								<TextField
								  style={intervalStyle}
								  value={this.state.autoMode.interval}
								  onChange={(e) => {this.autoMode_intervalChange(e)}}
								  floatingLabelText="Interval"
								/>
							</MuiThemeProvider>
							<MuiThemeProvider>
								<SelectField
								  floatingLabelText="Unit"
								  style={unitStyle}
								  value={this.state.autoMode.intervalUnitIndex}
								  onChange={(e, newIndex) => {this.autoMode_intervalUnitChange(newIndex)}}
								  autoWidth={true}
								>
								  <MenuItem value={0} primaryText="Minutes" />
								  <MenuItem value={1} primaryText="Hours" />
								</SelectField>
							</MuiThemeProvider>
						</div>
						{ runForNeeded &&
							<div className='text-center'>
								<MuiThemeProvider>
									<TextField
									  style={intervalStyle}
									  value={this.state.autoMode.runFor}
									  onChange={(e) => {this.autoMode_runForChange(e)}}
									  floatingLabelText="Run For"
									/>
								</MuiThemeProvider>
								<MuiThemeProvider>
									<SelectField
									  floatingLabelText="Unit"
									  style={unitStyle}
									  value={this.state.autoMode.runForUnitIndex}
									  onChange={(e, newIndex) => {this.autoMode_runForUnitChange(newIndex)}}
									  autoWidth={true}
									>
									  <MenuItem value={0} primaryText="Minutes" />
									  <MenuItem value={1} primaryText="Hours" />
									</SelectField>
								</MuiThemeProvider>
							</div>
						}
						<div className='text-right'>
							<MuiThemeProvider>
								<RaisedButton
									style={saveButtonStyle}
									primary={true}
									icon={<i className="fa fa-floppy-o fa-1_5x" aria-hidden="true"></i>}
									onTouchTap={() => {resetAutoMode(this.state.autoMode)}}
								/>
							</MuiThemeProvider>
						</div>
					</CardText>
				</Card>
			</MuiThemeProvider>
			</div>
		)
	}
}

export default AutoMode;
