import React from "react";
import {observer} from "mobx-react";
import addPutInStrategyStore from "../../../../mobx/renderSet/PutInStrategyManage/add-putin-strategy-store"
@observer
export default class Strategy2 extends React.Component {
	constructor(){
		super()
		this.state={
			value:''
		}
	}
	onChange(e){
		addPutInStrategyStore.value2=e.target.value
	}
	render() {
		let {value2}=addPutInStrategyStore;
		return (
			<div className="accountListRow" style={{height:30}}>
				<div className="form-left">
					<i className="red">*</i>投放策略名称：
				</div>
				<div className="form-right-multiple" style={{display:'block'}}>
					<input
						className="border1"
						placeholder="请填写策略名称"
						value={value2}
						onChange={(e)=>this.onChange(e)}
						style={{ width: '300px' ,marginLeft:10}}
					/>
				</div>
			</div>
		)
	}
}
