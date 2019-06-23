import React, { Component } from 'react'

class Academy extends Component {
	render() {
		return (
			<div>
				<div>
					{this.props.academy.name} ({this.props.academy.country})
				</div>
			</div>
		)
	}
}

export default Academy