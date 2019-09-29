import React from "react";
import { DatePicker } from 'antd';
const { MonthPicker } = DatePicker;
import moment from 'moment';
function disabledDate(current) {
	return  current&&current > moment().endOf('day')
}
export default class LabelPicker extends React.Component {
	constructor(props) {
		super(props);
		this.state={
			value:moment()
		}
	}
	onChange(e){
		this.setState({
			value:e
		})
		this.props.call(e)
	}
	render() {
		return (
			<div className="accountListRow">
				<div className="form-left">
					<i className="red">*</i>&nbsp; 日期:
				</div>
				<div className="form-right">
					<MonthPicker value={this.props.value} disabledDate={disabledDate} onChange={(e)=>this.onChange(e)} format="YYYY-MM" />
				</div>
			</div>
		)
	}
}
