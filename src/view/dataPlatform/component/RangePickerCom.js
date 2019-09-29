import React from "react";
import {DatePicker} from "antd";
const { RangePicker } = DatePicker;
import 'moment/locale/zh-cn';
import moment from 'moment';
import locale from 'antd/lib/date-picker/locale/zh_CN';
import Client from "../../../common/lead-api";
moment.locale('zh-cn');
function disabledDate(current) {
	return  current&&current > moment().endOf('day')
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
		let start=new Date(a[0].format('YYYY-MM-DD')).getTime()
		let end=new Date(a[1].format('YYYY-MM-DD')).getTime()
		if(end-start>86400000*30){
			Client.showTank(false,'时间范围不要大于31天')
			this.setState({
				startValue: moment().subtract(31, 'days'),
				endValue: moment().subtract(1, 'days')
			})
			this.props.call(moment().subtract(31, 'days'),moment().subtract(1, 'days'))
		}else{
			this.setState({
				startValue: a[0],
				endValue: a[1]
			})
			this.props.call(a[0],a[1])
		}
	}
	render() {
		return (
			<RangePicker
				style={{width:300}}
				ranges={{
					'昨天': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
					'过去七天':[moment().subtract(7, 'days'),moment().subtract(1, 'days')],
					'过去三十天':[moment().subtract(30, 'days'),moment().subtract(1, 'days')],
					'本月': [moment().startOf('month'), moment()],
					'上个月': [moment().month(moment().month() - 1).startOf('month'), moment().month(moment().month() - 1).endOf('month')],
				}}
				locale={locale}
				disabledDate={disabledDate}
				value={[this.state.startValue,this.state.endValue]}
				onChange={(a)=>this.onRangeChange(a)} />
		);
	}
}


