import React from "react";
export default class LabelInput extends React.Component {
	constructor(props) {
		super(props);
		this.state={
			value:this.props.value
		}
	}
	onTypeChange(e){
		this.setState({
			value: e.target.value
		})
		this.props.call(e.target.value)
	}
	render() {
		return (
			<div className="accountListRow">
				<div className="form-left">
					<i className="red">*</i>&nbsp; {this.props.label}:
				</div>
				<div className="form-right">
					<input
						placeholder={this.props.placeholder}
						value={this.state.value}
						className="border1"
						onChange={(e)=>this.onTypeChange(e)}
						style={{width: 360, height: 30}}
					/>
				</div>
			</div>
		)
	}
}
