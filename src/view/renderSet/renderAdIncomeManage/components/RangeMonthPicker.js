import React from "react";
import {DatePicker} from "antd";
import 'moment/locale/zh-cn';
import moment from 'moment';
import locale from 'antd/lib/date-picker/locale/zh_CN';
const { RangePicker } = DatePicker;
moment.locale('zh-cn');
export default class RangeMonthPicker extends React.Component {
	constructor(props) {
		super(props);
		this.state={
			mode: ['month', 'month'],
			value: [moment(moment().subtract(6,'months').format('L')),moment(moment().subtract(1,'months').format('L'))],
		}
	}
	handlePanelChange = (value, mode) => {
		this.setState({
			value,
			mode: [mode[0] === 'date' ? 'month' : mode[0], mode[1] === 'date' ? 'month' : mode[1]],
		});
		this.props.call(value)
	};
	handleChange = value => {
		this.setState({ value });
	};
	render() {
		let {value,mode}=this.state;
		return (
			<div className="listROwlet2" style={{minHeight:40,lineHeight: '30px'}}>
				<div className="form-left" style={{ width: '30%' }}>
					日期：
				</div>
				<div className="form-right-multiple" style={{ width: '50%' }}>
					<RangePicker
						placeholder={['Start month', 'End month']}
						format="YYYY-MM"
						value={value}
						locale={locale}
						mode={mode}
						onChange={this.handleChange}
						onPanelChange={this.handlePanelChange}
					/>
				</div>
			</div>
		)
	}
}
