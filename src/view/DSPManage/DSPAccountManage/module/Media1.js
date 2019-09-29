import React from "react";
import {Checkbox} from "antd";
const CheckboxGroup = Checkbox.Group;
import {observer} from "mobx-react";
import dspManageStore from "../../../../mobx/dspManage/DSPManageStore/dsp-manage-store";
const plainOptions = ['App', 'PC'];
@observer
export default class Media1 extends React.Component {
	constructor(){
		super()
		this.state={
			value:0
		}
	}
	onTypeChange(e){
		dspManageStore.value3=e
	}
	render() {
		let {value3}=dspManageStore;
		return (
			<div className="accountListRow" style={{height:30}}>
				<div className="form-left">
					终端定向：
				</div>
				<div className="form-right-multiple" style={{display:'block'}}>
					<CheckboxGroup options={plainOptions} value={[...value3]} onChange={(e)=>this.onTypeChange(e)} />
				</div>
			</div>
		)
	}
}
