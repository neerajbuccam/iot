import React from 'react'

import {circleStyle,
		tempFont,
		toggleStyle,
		intervalStyle,
		unitStyle,
		saveButtonStyle,
		headerStyle,
		cardHeaderStyle,
		cardHeaderTextStyle,
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
	
	componentWillReceiveProps(newProps){
		let oldControls = this.props.controls;
		let newControls = newProps.controls;
		let updateFlag = false;
		let update = {...this.state};
		
		if(oldControls.manualMode.runFor != newControls.manualMode.runFor){
			update.manualMode.runFor = (newControls.manualMode.runForUnitIndex == 0)
				? (newControls.manualMode.runFor / 60 / 1000)
				: (newControls.manualMode.runFor / 60 / 60 / 1000);
			updateFlag = true;
		}
		if(oldControls.manualMode.runForUnitIndex != newControls.manualMode.runForUnitIndex){
			update.manualMode.runForUnitIndex = newControls.manualMode.runForUnitIndex;
			updateFlag = true;
		}
		
		if(updateFlag == true){
			let manualMode = Object.assign({}, this.state.manualMode, update);
			this.setState({ manualMode });
		}
	}
	
	manualMode_runForChange(e){
		let manualMode = Object.assign({}, this.state.manualMode, {
				runFor: e.target.value
			});
		this.setState({ manualMode });
	}
	
	manualMode_runForUnitChange(index){
		let { manualMode } = this.state;
		let runFor = (manualMode.runForUnitIndex == 1)
			? (manualMode.runFor * 60)
			: (manualMode.runFor / 60);
			
		manualMode = Object.assign({}, this.state.manualMode, {
				runForUnitIndex: index,
				runFor: runFor
			});
		this.setState({ manualMode });
	}
	
	render(){
		const {
			controls,
			toggleManualMode,
			startManualMode
		} = this.props;
		
		return(
			<div className='pad-hoz-15'>
			<MuiThemeProvider>
				<Card expanded={controls.manualMode.status} >
					<CardHeader
					  title={
						<div>
							<MuiThemeProvider>
								<Subheader style={subheaderStyle}>Manual Mode</Subheader>
							</MuiThemeProvider>
							<MuiThemeProvider>
								<Toggle
								  label={ controls.manualMode.status == true ? 'ON' : 'OFF' }
								  labelPosition="right"
								  style={toggleStyle}
								  toggled={controls.manualMode.status}
								  onToggle={toggleManualMode}
								/>
							</MuiThemeProvider>
						</div>
					  }
					  actAsExpander={true}
					  showExpandableButton={false}
					  style={cardHeaderStyle}
					  textStyle={cardHeaderTextStyle}
					/>
					<CardText expandable={true} style={cardTextStyle}>
					<div className='text-center'>
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
					</div>
					<div className='text-right'>
						<MuiThemeProvider>
							<RaisedButton
								style={saveButtonStyle}
								primary={true}
								icon={<i className="fa fa-floppy-o fa-1_5x" aria-hidden="true"></i>}
								onTouchTap={() => {startManualMode(this.state.manualMode)}}
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

export default ManualMode;
