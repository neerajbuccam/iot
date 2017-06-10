import React from 'react'

import {toggleStyle,
		intervalStyle,
		unitStyle,
		saveButtonStyle,
		subheaderStyle
	} from '../../public/componentStyles'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import Subheader from 'material-ui/Subheader'
import Divider from 'material-ui/Divider'
import Toggle from 'material-ui/Toggle'
import TextField from 'material-ui/TextField'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
import RaisedButton from 'material-ui/RaisedButton'


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
	
	autoMode_intervalChange(e){
		let autoMode = Object.assign({}, this.state.autoMode, {
				interval: e.target.value
			});
		this.setState({ autoMode });
	}
	
	autoMode_intervalUnitChange(index){
		let { autoMode } = this.state;
		let interval = (autoMode.intervalUnitIndex == 1) ? (autoMode.interval * 60) : (autoMode.interval / 60);

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
		let runFor = (autoMode.runForUnitIndex == 1) ? 
						(autoMode.runFor * 60) : 
						(autoMode.runFor / 60);
			
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
			resetAutoMode
		} = this.props;
		
		return(
			<div>
				<div className='pad-top-15'>
					<MuiThemeProvider>
						<Divider />
					</MuiThemeProvider>
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
				<div>
					<MuiThemeProvider>
						<TextField
						  style={intervalStyle}
						  value={this.state.autoMode.interval}
						  onChange={(e) => {this.autoMode_intervalChange(e)}}
						  floatingLabelText="Capture Interval"
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
				<div>
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
			</div>
		)
	}
}

export default AutoMode;
