import React from "react";
import {Radio} from "antd";
export default class RadioInputCom extends React.Component {
	constructor(){
		super()
		this.state={
			value:''
		}
	}
	onChange(e){
		this.props.call(e.target.value)
	}
	onInputChange(e){
		this.props.input_call(e.target.value)
	}
	render() {
		return (
			<div className="accountListRow" style={{height:30}}>
				<div className="form-left">
					 {this.props.label}：
				</div>
				<div className="form-right-multiple" style={{display:'block'}}>
					<Radio.Group onChange={(e)=>this.onChange(e)} value={this.props.value}>
						<Radio value="NO" >不限制</Radio>
						<Radio value="YES" >限制</Radio>
					</Radio.Group>
					{this.props.value=='YES'?<input
						className="border1"
						value={this.props.input_value}
						onChange={(e)=>this.onInputChange(e)}
						style={{ width: '300px'}}
					/>:null}
					{this.props.value=='YES'?<i className="color1">请填写PV值</i>:null}
				</div>
			</div>
		)
	}
}
