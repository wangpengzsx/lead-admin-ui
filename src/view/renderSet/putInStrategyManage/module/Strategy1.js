import React from "react";
import {Select} from "antd";
import {observer} from "mobx-react";
import addPutInStrategyStore from "../../../../mobx/renderSet/PutInStrategyManage/add-putin-strategy-store"
import putInStrategyStore from "../../../../mobx/renderSet/PutInStrategyManage/putIn-strategy-store"
const Option=Select.Option;
@observer
export default class Strategy1 extends React.Component {
	constructor(){
		super()
		this.state={
			value:''
		}
	}
	componentWillMount(){
		if(localStorage.getItem('fallbackId')){
			addPutInStrategyStore.value1=localStorage.getItem('fallbackId')
		}
	}
	onTypeChange(e){
		addPutInStrategyStore.value1=e
	}
	render() {
		let {value1}=addPutInStrategyStore
		let {fallArr}=putInStrategyStore
		return (
			<div className="accountListRow" style={{height:30}}>
				<div className="form-left">
					<i className="red">*</i>广告平台名称：
				</div>
				<div className="form-right-multiple" style={{display:'block'}}>
					<Select
						placeholder="请选择"
						value={localStorage.getItem('fallbackId')?localStorage.getItem('fallbackId'):value1}
						maxTagCount={1}
						onChange={this.onTypeChange.bind(this)}
						disabled={localStorage.getItem('strategyId')?true:(localStorage.getItem('fallbackId')?true:false)}
						style={{ width: '120px' ,marginLeft:10}}
					>
						{fallArr.map((i, k) => (
							k==0?null:
							<Option value={i.value} key={k}>{i.name}</Option>
						))}
					</Select>
				</div>
			</div>
		)
	}
}
