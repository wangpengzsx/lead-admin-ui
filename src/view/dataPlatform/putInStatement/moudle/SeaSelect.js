import React from "react";
import { Select ,Checkbox} from "antd";
const Option = Select.Option;
export default class SeaSelect extends React.Component {
	constructor(){
		super()
		this.state={
			appArr:[]
		}
	}
	onAppAllChange(e){
		if (e.target.value) {
			this.setState({
				appArr: []
			})
			this.props.call([])
		} else {
			let arr = [];
			for (let i = 0; i < this.props.option.length; i++) {
				arr.push(this.props.option[i].value)
			}
			this.setState({
				appArr: arr
			})
			this.props.call(arr)
		}
	}
	onAppChange(e){
		this.setState({appArr:e})
		this.props.call(e)
	}
	render() {
		return (
			<div className="listROwlet2" style={{ minHeight: 60, lineHeight: '30px' }}>
				<div className="form-left" style={{ width: '30%' }}>
					{this.props.label}：
				</div>
				<div className="form-right-multiple" style={{ width: '50%' }}>
					<Checkbox onChange={this.onAppAllChange.bind(this)}
							  indeterminate={this.state.appArr.length!=0&&this.state.appArr.length<this.props.option.length}
							  checked={this.state.appArr.length==this.props.option.length} value={this.state.appArr.length==this.props.option.length} />
					<Select
						mode="multiple"
						placeholder="请选择应用"
						value={this.state.appArr}
						maxTagCount={1}
						onChange={this.onAppChange.bind(this)}
						style={{ width: '100%', marginLeft: 10 }}
					>
						{this.props.option.map((i, k) => (
							<Option key={k} value={i.value}>{i.name}</Option>
						))}
					</Select>
				</div>
			</div>
		);
	}
}


