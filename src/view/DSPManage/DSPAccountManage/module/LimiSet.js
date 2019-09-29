import React from "react";
import {Radio} from "antd";
const RadioGroup = Radio.Group;
import Modal1 from "../modal/Modal1"
import {observer} from "mobx-react";
import dspManageStore from "../../../../mobx/dspManage/DSPManageStore/dsp-manage-store";
@observer
export default class LimiSet extends React.Component {
	constructor(){
		super()
		this.state={
			cycleState:'no',
			modalState:dspManageStore.modalState8,
			modalValue:dspManageStore.modalValue8
		}
	}
	onCycleChange(e){
		dspManageStore.state8=e.target.value;
		if(e.target.value=='no'){
			dspManageStore.modalState8='';
			dspManageStore.modalValue8='';
		}
	}
	onRadioChange(e){
		this.setState({modalState: e.target.value})
	}
	coInputChange(e){
		this.setState({modalValue: e.target.value})
	}
	submit(state,value){
		dspManageStore.modalState8=state
		dspManageStore.modalValue8=value
	}
	skip(){
		this._modal1.openModal('2')
	}
	render() {
		let {state8,modalState8,modalValue8}=dspManageStore;
		return (
			<div>
				<Modal1 ref={e=>this._modal1=e}
						onRadioChange={(e)=>this.onRadioChange(e)}
						onInputChange={(e)=>this.coInputChange(e)}
						onSubmit={(s,v)=>this.submit(s,v)}
				/>
				<div className="accountListRow" style={{height:30}}>
					<div className="form-left">
						<i className="red">*</i>imei号定向：
					</div>
					<div className="form-right-multiple" style={{display: 'inherit'}}>
						<RadioGroup onChange={(e)=>this.onCycleChange(e)}
									value={state8}>
							<Radio value='no'>不限</Radio>
							<Radio value='yes'>设置imei号</Radio>
						</RadioGroup>
						{state8=='yes'?(<a onClick={()=>{this.skip()}}>设置</a>):null}
					</div>
				</div>
				{modalValue8==''?null:(
					<div className="accountListRow" style={{height:30}}>
						<div className="form-left">
						</div>
						<div className="form-right-multiple" style={{display: 'inherit'}}>
							已设置imei号{modalState8=='0'?'白名单':'黑名单'}:{modalValue8}
						</div>
					</div>
				)}
			</div>
		)
	}
}
