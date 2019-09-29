import React from "react";
export default class IdCom extends React.Component {
	constructor(props){
		super(props)
	}
	render() {
		return (
			<div className="accountListRow" style={{height:30}}>
				<div className="form-left">
					<i className="red">*</i> {this.props.label}：
				</div>
				<div className="form-right-multiple" style={{display:'block'}}>
					{this.props.id}
				</div>
			</div>
		)
	}
}
