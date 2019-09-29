import React from "react";
import {Radio} from "antd";
const RadioGroup = Radio.Group;
import Modal1 from "../modal/Modal1"
import {observer} from "mobx-react";
import addPutInStrategyStore from "../../../../mobx/renderSet/PutInStrategyManage/add-putin-strategy-store"
@observer
export default class Strategy5 extends React.Component {
	constructor(){
		super()
		this.state={
			cycleState:'no'
		}
	}
	onCycleChange(e){
		addPutInStrategyStore.state5=e.target.value
		if(e.target.value){
			addPutInStrategyStore.value5=''
			addPutInStrategyStore.modalState5=''
		}
	}
	skip(){
		this._modal1.openModal('0')
	}
	render() {
		let {state5,value5,modalState5}=addPutInStrategyStore;
		return (
			<div>
				<Modal1 ref={e=>this._modal1=e}/>
				<div className="accountListRow" style={{height:30}}>
					<div className="form-left">
						<i className="red">*</i>投放应用版本：
					</div>
					<div className="form-right-multiple" style={{display: 'inherit'}}>
						<RadioGroup onChange={(e)=>this.onCycleChange(e)}
									value={state5}>
							<Radio value='no'>不限</Radio>
							<Radio value='yes'>设置投放应用版本</Radio>
						</RadioGroup>
						{state5=='yes'?(<a onClick={()=>{this.skip()}}>设置</a>):null}
					</div>
				</div>
				{value5==''?null:(
					<div className="accountListRow" style={{height:30}}>
						<div className="form-left">
						</div>
						<div className="form-right-multiple" style={{display: 'inherit'}}>
							已设置投放应用版本号{modalState5=='0'?'白名单':'黑名单'}:{value5}
						</div>
					</div>
				)}
			</div>
		)
	}
}
