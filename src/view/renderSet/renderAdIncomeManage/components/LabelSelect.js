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
			<div className="accountListRow">
				<div className="form-left">
					<i className="red">*</i>&nbsp; {this.props.label}:
				</div>
				<div className="form-right">
					<Select
						placeholder="请选择广告类型"
						value={this.state.value}
						maxTagCount={1}
						onChange={this.onTypeChange.bind(this)}
						style={{ width: 200 }}
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
