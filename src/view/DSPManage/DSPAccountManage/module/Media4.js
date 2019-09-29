import React from "react";
import {Radio} from "antd";
const RadioGroup = Radio.Group;
import Modal1 from "../modal/Modal1"
import {observer} from "mobx-react";
import dspManageStore from "../../../../mobx/dspManage/DSPManageStore/dsp-manage-store";
@observer
export default class Media4 extends React.Component {
	constructor(){
		super()
		this.state={
			cycleState:'no',
			modalState:'',
			modalValue:''
		}
	}
	onCycleChange(e){
		dspManageStore.state6=e.target.value
	}
	onRadioChange(e){
		this.setState({modalState: e.target.value})
	}
	coInputChange(e){
		this.setState({modalValue: e.target.value})
	}
	submit(){
		dspManageStore.modalState6=this.state.modalState
		dspManageStore.modalValue6=this.state.modalValue
	}
	skip(){
		this._modal1.openModal('1')
	}
	render() {
		let {state6,modalState6,modalValue6}=dspManageStore;
		return (
			<div>
				<Modal1 ref={e=>this._modal1=e}
						onRadioChange={(e)=>this.onRadioChange(e)}
						onInputChange={(e)=>this.coInputChange(e)}
						onSubmit={()=>this.submit()}
				/>
				<div className="accountListRow" style={{height:30}}>
					<div className="form-left">
						<i className="red">*</i>应用版本定向：
					</div>
					<div className="form-right-multiple" style={{display: 'inherit'}}>
						<RadioGroup onChange={(e)=>this.onCycleChange(e)}
									value={state6}>
							<Radio value='no'>不限</Radio>
							<Radio value='yes'>设置应用版本</Radio>
						</RadioGroup>
						{state6=='yes'?(<a onClick={()=>{this.skip()}}>设置</a>):null}
					</div>
				</div>
				{modalValue6==''?null:(
					<div className="accountListRow" style={{height:30}}>
						<div className="form-left">
						</div>
						<div className="form-right-multiple" style={{display: 'inherit'}}>
							已设置投放应用版本号{modalState6=='0'?'白名单':'黑名单'}:{modalValue6}
						</div>
					</div>
				)}
			</div>
		)
	}
}
