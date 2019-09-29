import React from "react";
import {Radio} from "antd";
const RadioGroup = Radio.Group;
import Modal1 from "../modal/Modal1"
import {observer} from "mobx-react";
import dspManageStore from "../../../../mobx/dspManage/DSPManageStore/dsp-manage-store";
@observer
export default class Media2 extends React.Component {
	constructor(){
		super()
		this.state={
			cycleState:'no',
			modalState:'',
			modalValue:''
		}
	}
	onCycleChange(e){
		dspManageStore.state4=e.target.value
		if(e.target.value=='no'){
			dspManageStore.modalState4=''
			dspManageStore.modalValue4=''
		}
	}
	onRadioChange(e){
		this.setState({modalState: e.target.value})
	}
	coInputChange(e){
		this.setState({modalValue: e.target.value})
	}
	submit(s,v){
		dspManageStore.modalState4=s
		dspManageStore.modalValue4=v
	}
	skip(){
		this._modal1.openModal('0')
	}
	render() {
		let {state4,modalState4,modalValue4}=dspManageStore;
		return (
			<div>
				<Modal1 ref={e=>this._modal1=e}
						onRadioChange={(e)=>this.onRadioChange(e)}
						onInputChange={(e)=>this.coInputChange(e)}
						onSubmit={(s,v)=>this.submit(s,v)}
				/>
				<div className="accountListRow" style={{height:30}}>
					<div className="form-left">
						<i className="red">*</i>媒体黑白名单：
					</div>
					<div className="form-right-multiple" style={{display: 'inherit'}}>
						<RadioGroup onChange={(e)=>this.onCycleChange(e)}
									value={state4}>
							<Radio value='no'>不限</Radio>
							<Radio value='yes'>设置媒体黑白名单</Radio>
						</RadioGroup>
						{state4=='yes'?(<a onClick={()=>{this.skip()}}>设置</a>):null}
					</div>
				</div>
				{modalValue4==''?null:(
					<div className="accountListRow" style={{height:30}}>
						<div className="form-left">
						</div>
						<div className="form-right-multiple" style={{display: 'inherit'}}>
							已设置媒体{modalState4=='0'?'白名单':'黑名单'}:{modalValue4}
						</div>
					</div>
				)}
			</div>
		)
	}
}
