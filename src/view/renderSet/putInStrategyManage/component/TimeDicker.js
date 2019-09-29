import React from "react";
import addPutInStrategyStore from "../../../../mobx/renderSet/PutInStrategyManage/add-putin-strategy-store"
import { observer } from "mobx-react";
import { DatePicker } from 'antd';
const { RangePicker } = DatePicker;
import locale from 'antd/lib/date-picker/locale/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
function disabledDate(current) {
	return  current < moment().startOf('day')
}
@observer
export default class TimeDicker extends React.Component {
	constructor(){
		super();
		this.state={
			planStart:addPutInStrategyStore.startTime==''?null:moment(addPutInStrategyStore.startTime,'YYYY-MM-DD'),
			planEnd:addPutInStrategyStore.endTime==''?null:moment(addPutInStrategyStore.endTime,'YYYY-MM-DD')
		}
	}
	onRangeChange(e){
		this.setState({
			planStart:e[0],
			planEnd:e[1]
		})
		this.props.callb(e[0],e[1]);
	}
	render() {
		return (
			<RangePicker
				style={{width:300}}
				locale={locale}
				disabledDate={disabledDate}
				value={[this.state.planStart,this.state.planEnd]}
				onChange={(a)=>this.onRangeChange(a)} />
		)
	}
}
