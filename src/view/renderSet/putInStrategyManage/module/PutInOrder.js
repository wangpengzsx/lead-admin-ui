import React from "react";
import {Radio} from "antd";
import {observer} from "mobx-react";
import addPutInStrategyStore from "../../../../mobx/renderSet/PutInStrategyManage/add-putin-strategy-store"
const RadioGroup = Radio.Group;
@observer
export default class PutInOrder extends React.Component {
	constructor(props){
		super(props)
		this.state={
			cycleState:'no',
			inputValue:''
		}
	}
	onCycleChange(e){
		addPutInStrategyStore.state1=e.target.value
		if(e.target.value=='no'){
			addPutInStrategyStore.inputValue=''
		}
	}
	skip(){
		this.props.history.push({
			pathname:'/timeFrameCom'
		})
	}
	duan(arr){
		let str='';
		for(let i=0;i<arr.length;i++){
			if(i==arr.length-1){
				str+=arr[i]
			}else{
				str+=arr[i]+','
			}
		}
		return str;
	}
	render() {
		let {state1,inputValue}=addPutInStrategyStore
		return (
			<div>
				<div className="accountListRow" >
					<div className="form-left">
						<i className="red">*</i>投放量级：
					</div>
					<div className="form-right-multiple" >
						<RadioGroup onChange={(e)=>this.onCycleChange(e)}
									value={state1}>
							<Radio value='no'>不限</Radio>
							<Radio value='yes'>设置投放量级</Radio>
						</RadioGroup>
						{state1=='yes'?(
							<div>
								<input className="border1"
									   value={inputValue}
									   style={{width:100}}
									   onChange={(e)=>{addPutInStrategyStore.inputValue=e.target.value}}/>
								<span>CPM/天</span>
							</div>
						):null}
					</div>
				</div>
			</div>
		)
	}
}
