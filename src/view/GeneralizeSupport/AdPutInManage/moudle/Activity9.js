import React from "react";
import {observer} from "mobx-react";
import newActivityStore from "../../../../mobx/generalizeSupport/AdPutInManage/new-activity-store";
import {Radio,Checkbox} from "antd";
const CheckboxGroup = Checkbox.Group;
const plainOptions = ['WIFI','4G','3G','其他']

@observer
export default class Activity9 extends React.Component {
	onChange(e){
		newActivityStore.networkState = e.target.value
	}
	onCheckChange(e){
		console.log(e)
		newActivityStore.network=e
	}

	render() {
		let {networkState,network}=newActivityStore
		return (
			<div className="accountListRow" style={{height:30}}>
				<div className="form-left">
					<i className="red">*</i> 网络环境：
				</div>
				<div className="form-right-multiple" style={{display:'block'}}>
					<Radio.Group onChange={(e)=>this.onChange(e)} value={networkState}>
						<Radio value="NO">不限制</Radio>
						<Radio value="YES">设置网络环境</Radio>
					</Radio.Group>
					{networkState=='YES'?<CheckboxGroup
						options={plainOptions}
						value={[...network]}
						onChange={(e)=>this.onCheckChange(e)}
					/>:null}
				</div>
			</div>
		)
	}
}
