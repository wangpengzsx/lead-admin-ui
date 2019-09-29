import React from "react";
import {Radio} from "antd";
const RadioGroup = Radio.Group;
import Modal1 from "../modal/Modal1"
import {observer} from "mobx-react";
import addPutInStrategyStore from "../../../../mobx/renderSet/PutInStrategyManage/add-putin-strategy-store"
@observer
export default class Strategy6 extends React.Component {
	constructor(){
		super()
		this.state={
			cycleState:'no'
		}
	}
	onCycleChange(e){
		addPutInStrategyStore.state6=e.target.value;
		if(e.target.value=='no'){
			addPutInStrategyStore.value6='';
			addPutInStrategyStore.modalState6='';
		}
	}
	skip(){
		this._modal1.openModal('1')
	}
	render() {
		let {state6,modalState6,value6}= addPutInStrategyStore
		return (
			<div>
				<Modal1 ref={e=>this._modal1=e}/>
				<div className="accountListRow" style={{height:30}}>
					<div className="form-left">
						<i className="red">*</i>投放imei：
					</div>
					<div className="form-right-multiple" style={{display: 'inherit'}}>
						<RadioGroup onChange={(e)=>this.onCycleChange(e)}
									value={state6}>
							<Radio value='no'>不限</Radio>
							<Radio value='yes'>设置投放imei</Radio>
						</RadioGroup>
						{state6=='yes'?(<a onClick={()=>{this.skip()}}>设置</a>):null}
					</div>
				</div>
				{value6==''?null:(
					<div className="accountListRow" style={{height:30}}>
						<div className="form-left">
						</div>
						<div className="form-right-multiple" style={{display: 'inherit'}}>
							已设置投放IMEI{modalState6=='0'?'白名单':'黑名单'}:{value6}
						</div>
					</div>
				)}
			</div>
		)
	}
}
