import React from "react";
import {observer} from "mobx-react";
import newActivityStore from "../../../../mobx/generalizeSupport/AdPutInManage/new-activity-store";
import {Radio} from "antd";

@observer
export default class Activity7 extends React.Component {
	onChange(e){
		newActivityStore.dayBudgetState=e.target.value;
	}
	onInputChange(e){
		newActivityStore.dayBudget=e.target.value;
	}

	render() {
		let {dayBudgetState,dayBudget}=newActivityStore
		return (
			<div className="accountListRow" style={{height:30}}>
				<div className="form-left">
					<i className="red">*</i> 日预算：
				</div>
				<div className="form-right-multiple" >
					<Radio.Group onChange={(e)=>this.onChange(e)} value={dayBudgetState}>
						<Radio value="NO">不限制</Radio>
						<Radio value="YES">设置日预算</Radio>
					</Radio.Group>
					{dayBudgetState=='YES'?<input
						className="border1"
						value={dayBudget}
						onChange={(e)=>this.onInputChange(e)}
						style={{ width: '100px'}}
					/>:null}
					{dayBudgetState=='YES'?'元':null}
					{dayBudgetState=='YES'?<i className="color1">
						预算需填写大于0的整数
					</i>:null}
				</div>
			</div>
		)
	}
}
