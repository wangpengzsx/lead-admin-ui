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
			value:0
		}
	}
	onChange(e){
		let {value1}=addPutInStrategyStore
		addPutInStrategyStore.value3=e
		if(e.slice(0,1)=='@'){
			putInStrategyStore.getAdTypeList(value1,e.slice(1),'','')
		}else{
			putInStrategyStore.getAdTypeList(value1,'',e.slice(1),'')
		}
	}
	render() {
		let {value3}=addPutInStrategyStore;
		let {mediaArr}=putInStrategyStore;
		return (
			<div className="accountListRow" style={{height:30}}>
				<div className="form-left">
					<i className="red">*</i>投放媒体：
				</div>
				<div className="form-right-multiple" style={{display:'block'}}>
					<Select
						value={value3}
						maxTagCount={1}
						onChange={this.onChange.bind(this)}
						disabled={localStorage.getItem('strategyId')?true:false}
						style={{ width: '120px' ,marginLeft:10}}
					>
						{mediaArr.map((i, k) => (
							k==0?null:
							<Option value={i.value} key={k}>{i.name}</Option>
						))}
					</Select>
				</div>
			</div>
		)
	}
}
