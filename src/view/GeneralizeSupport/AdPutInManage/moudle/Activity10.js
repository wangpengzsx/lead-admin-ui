import React from "react";
import {observer} from "mobx-react";
import newActivityStore from "../../../../mobx/generalizeSupport/AdPutInManage/new-activity-store";
import {Radio,Checkbox} from "antd";
const CheckboxGroup = Checkbox.Group;
const plainOptions = ['移动','联通','电信']

@observer
export default class Activity10 extends React.Component {
	onChange(e){
		newActivityStore.operatorState = e.target.value
	}
	onCheckChange(e){
		console.log(e)
		newActivityStore.operators=e
	}

	render() {
		let {operatorState,operators}=newActivityStore
		return (
			<div className="accountListRow" style={{height:30}}>
				<div className="form-left">
					<i className="red">*</i> 运营商：
				</div>
				<div className="form-right-multiple" style={{display:'block'}}>
					<Radio.Group onChange={(e)=>this.onChange(e)} value={operatorState}>
						<Radio value="NO">不限制</Radio>
						<Radio value="YES">设置运营商</Radio>
					</Radio.Group>
					{operatorState=='YES'?<CheckboxGroup
						options={plainOptions}
						value={[...operators]}
						onChange={(e)=>this.onCheckChange(e)}
					/>:null}
				</div>
			</div>
		)
	}
}
