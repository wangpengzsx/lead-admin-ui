import React from "react";
import {Radio} from "antd";
export default class RadioCom extends React.Component {
	constructor(){
		super()
		this.state={
			value:''
		}
	}
	onChange(e){
		this.props.call(e.target.value)
	}
	render() {
		return (
			<div className="accountListRow" style={{height:30}}>
				<div className="form-left">
					<i className="red">*</i> {this.props.label}：
				</div>
				<div className="form-right-multiple" style={{display:'block'}}>
					<Radio.Group onChange={(e)=>this.onChange(e)} value={this.props.value} disabled={this.props.disabled}>
						{this.props.arr.map((i,k)=>(<Radio value={i} key={k}>{i}</Radio>))}
					</Radio.Group>
				</div>
			</div>
		)
	}
}
