import React from "react";
import {observer} from "mobx-react";
import filterStrategyStore from '../../../../mobx/dspManage/DSPManageStore/filter-strategy-store'
@observer
export default class StrategyName extends React.Component {
	constructor(){
		super()
		this.state={
			value:''
		}
	}
	onChange(e){
		filterStrategyStore.value1=e.target.value
	}
	render() {
		let {value1}=filterStrategyStore
		return (
			<div className="accountListRow" style={{height:30}}>
				<div className="form-left">
					<i className="red">*</i>过滤策略名称：
				</div>
				<div className="form-right-multiple" style={{display:'block'}}>
					<input
						className="border1"
						placeholder="请填写策略名称"
						value={value1}
						onChange={(e)=>this.onChange(e)}
						style={{ width: '300px' ,marginLeft:10}}
					/>
				</div>
			</div>
		)
	}
}
