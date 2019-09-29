import React from "react";
import { Select } from "antd";
const Option = Select.Option;
export default class LabelSelect extends React.Component {
	constructor(props) {
		super(props);
		this.state={
			value:this.props.value
		}
	}
	onTypeChange(e){
		this.setState({
			value: e
		})
		this.props.call(e)
	}
	render() {
		return (
			<div className="listROwlet2" style={{minHeight:40,lineHeight: '30px'}}>
				<div className="form-left" style={{ width: '30%' }}>
					{this.props.label}：
				</div>
				<div className="form-right-multiple" style={{ width: '50%' }}>
					<Select
						placeholder="请选择广告类型"
						value={this.state.value}
						maxTagCount={1}
						onChange={this.onTypeChange.bind(this)}
						style={{ width: '100%' ,marginLeft:10}}
						disabled={localStorage.getItem('fallbackId')?true:false}
					>
						{this.props.typeArr.map((i, k) => (
							<Option value={i.value} key={k}>{i.name}</Option>
						))}
					</Select>
				</div>
			</div>
		)
	}
}
