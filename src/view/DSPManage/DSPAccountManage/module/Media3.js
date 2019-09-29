import React from "react";
import {Radio,Checkbox} from "antd";
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;
import {observer} from "mobx-react";
import dspManageStore from "../../../../mobx/dspManage/DSPManageStore/dsp-manage-store";
const plainOptions = [ {label:'Banner',value:'BANNER'},
	{label:'开屏广告',value:'OPENSCREEN'},
	{label:'插屏广告',value:'POPUP'},
	{label:'原生广告',value:'NATIVE'},
	{label:'视频广告',value:'VIDEO'}];
@observer
export default class Media3 extends React.Component {
	constructor(){
		super()
		this.state={
			cycleState:'no',
			modalState:'',
			modalValue:''
		}
	}
	onCycleChange(e){
		dspManageStore.state5=e.target.value
		if(e.target.value=='no'){
			dspManageStore.value5=[]
		}
	}
	onChange(e){
		dspManageStore.value5=e
	}
	render() {
		let {state5,value5}=dspManageStore;
		return (
			<div className="accountListRow" style={{height:30}}>
				<div className="form-left">
					广告位类型定向：
				</div>
				<div className="form-right-multiple" style={{display: 'inherit'}}>
					<RadioGroup onChange={(e)=>this.onCycleChange(e)}
								value={state5}>
						<Radio value='no'>不限</Radio>
						<Radio value='yes'>设置广告位类型</Radio>
					</RadioGroup>
					{state5=='yes'?(<CheckboxGroup options={plainOptions}
												   value={[...value5]}
												   onChange={(e)=>this.onChange(e)}/>):null}
				</div>
			</div>
		)
	}
}
