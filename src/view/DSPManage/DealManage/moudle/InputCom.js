import React from "react";
export default class InputCom extends React.Component {
	constructor(){
		super()
		this.state={
			value:''
		}
	}
	static defaultProps = {
		unit: '',
		tips: '',
		must:true,
	}
	onChange(e){
		this.props.call(e.target.value)
	}
	render() {
		return (
			<div className="accountListRow" style={{height:30}}>
				<div className="form-left">
					{this.props.must?<i className="red">*</i>:null} {this.props.label}：
				</div>
				<div className="form-right-multiple" style={{display:'block'}}>
					<input
						className="border1"
						value={this.props.value}
						onChange={(e)=>this.onChange(e)}
						style={{ width: '300px'}}
					/>
					{this.props.unit}
					<i className="color1">{this.props.tips}</i>
				</div>
			</div>
		)
	}
}
