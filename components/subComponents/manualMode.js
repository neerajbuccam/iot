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


class ManualMode extends React.Component{
	constructor(props) {
		super(props);
		
		this.manualMode_runForChange = this.manualMode_runForChange.bind(this);
		this.manualMode_runForUnitChange = this.manualMode_runForUnitChange.bind(this);
		
		this.state = {
			manualMode: {
				runFor: 0,
				runForUnitIndex: 0
			}
		};
	}
	
	manualMode_runForChange(e){
		let manualMode = Object.assign({}, this.state.manualMode, {
				runFor: e.target.value
			});
		this.setState({ manualMode });
	}
	
	manualMode_runForUnitChange(index){
		let { manualMode } = this.state;
		let runFor = (manualMode.runForUnitIndex == 1) ? 
						(manualMode.runFor * 60) : 
						(manualMode.runFor / 60);
			
		manualMode = Object.assign({}, this.state.manualMode, {
				runForUnitIndex: index,
				runFor: runFor
			});
		this.setState({ manualMode });
	}
	
	render(){
		const {
			startManualMode
		} = this.props;
		
		return(
			<div>
				<div className='pad-top-15'>
					<MuiThemeProvider>
						<Divider />
					</MuiThemeProvider>
					<MuiThemeProvider>
						<Subheader style={subheaderStyle}>Manual Mode</Subheader>
					</MuiThemeProvider>
					<MuiThemeProvider>
						<TextField
						  style={intervalStyle}
						  value={this.state.manualMode.runFor}
						  onChange={(e) => {this.manualMode_runForChange(e)}}
						  floatingLabelText="Run For"
						/>
					</MuiThemeProvider>
					<MuiThemeProvider>
						<SelectField
						  floatingLabelText="Unit"
						  style={unitStyle}
						  value={this.state.manualMode.runForUnitIndex}
						  onChange={(e, newIndex) => {this.manualMode_runForUnitChange(newIndex)}}
						  autoWidth={true}
						>
						  <MenuItem value={0} primaryText="Minutes" />
						  <MenuItem value={1} primaryText="Hours" />
						</SelectField>
					</MuiThemeProvider>
					<br/><br/>
					<MuiThemeProvider>
						<RaisedButton
							style={saveButtonStyle}
							primary={true}
							icon={<i className="fa fa-floppy-o fa-1_5x" aria-hidden="true"></i>}
							onTouchTap={startManualMode}
						/>
					</MuiThemeProvider>
				</div>
			</div>
		)
	}
}

export default ManualMode;
