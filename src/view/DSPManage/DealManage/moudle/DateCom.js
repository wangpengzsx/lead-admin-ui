import React from "react";
import {Radio} from "antd";
import RangePickerCom from './components/RangePickerCom';
export default class DateCom extends React.Component {
	constructor(){
		super()
		this.state={
			value:''
		}
	}
	onChange(e){
		this.props.call(e.target.value)
	}
	rangeChange(start,end){
		this.props.date_call(start,end)
	}
	render() {
		return (
			<div className="accountListRow" style={{height:30}}>
				<div className="form-left">
					<i className="red">*</i> {this.props.label}：
				</div>
				<div className="form-right-multiple" style={{display:'block'}}>
					<Radio.Group onChange={(e)=>this.onChange(e)} value={this.props.value}>
						<Radio value="NO" >不限制</Radio>
						<Radio value="YES" >设置开始结束时间</Radio>
					</Radio.Group>
					{this.props.value=='YES'?<RangePickerCom
						startTime={this.props.startTime}
						endTime={this.props.endTime}
						call={(startValue,endValue)=>this.rangeChange(startValue,endValue)}/>:null}
				</div>
			</div>
		)
	}
}
