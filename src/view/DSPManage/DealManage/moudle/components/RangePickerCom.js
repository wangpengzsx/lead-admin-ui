import React from "react";
import {DatePicker} from "antd";
const { RangePicker } = DatePicker;
import 'moment/locale/zh-cn';
import moment from 'moment';
import locale from 'antd/lib/date-picker/locale/zh_CN';
moment.locale('zh-cn');
function disabledDate(current) {
	return  current < moment().startOf('day')
}
export default class RangePickerCom extends React.Component {
	constructor(props){
		super(props)
		this.state={
			startValue: moment().startOf('day'),
			endValue: moment().endOf('day')
		}
	}
	onRangeChange(a){
		this.props.call(a[0],a[1])
	}
	render() {
		return (
			<RangePicker
				style={{width:300}}
				locale={locale}
				disabledDate={disabledDate}
				value={[this.props.startTime,this.props.endTime]}
				onChange={(a)=>this.onRangeChange(a)} />
		);
	}
}
