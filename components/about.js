import React from 'react'
import {Router} from 'react-router'
import App from './app'

export default class About extends React.Component{
  render() {
    return(
		<App router={Router}>
			<div>
				About
			</div>
		</App>
	)
  }
}
