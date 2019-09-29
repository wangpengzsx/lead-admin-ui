import React from "react";
import {Radio} from "antd";
import Model from "../model/Modal"
import {observer} from "mobx-react";
import filterStrategyStore from '../../../../mobx/dspManage/DSPManageStore/filter-strategy-store'
const RadioGroup = Radio.Group;
@observer
export default class IndustrySet extends React.Component {
	constructor(){
		super()
		this.state={
			chooseTimeFrame:[],
		}
	}
	onCycleChange(e){
		if(e.target.value=='no'){
			filterStrategyStore.value6=[];
		}
		filterStrategyStore.state6=e.target.value
	}
	skip(){
		this._modal.openModal()
	}
	render() {
		let {value6,state6} = filterStrategyStore
		return (
			<div>
				<Model ref={e=>this._modal=e}/>
				<div className="accountListRow" >
					<div className="form-left">
						<i className="red">*</i>关键词过滤：
					</div>
					<div className="form-right-multiple" >
						<RadioGroup onChange={(e)=>this.onCycleChange(e)}
									value={state6}>
							<Radio value='no'>不限</Radio>
							<Radio value='yes'>设置过滤关键词</Radio>
						</RadioGroup>
						{state6=='yes'?(<a onClick={()=>{this.skip()}}>设置</a>):null}
					</div>
				</div>
				{
					value6!=''&&state6=='yes'?
						<div className="accountListRow" >
							<div className="form-left">
							</div>
							<div className="form-right-multiple" >
								设置关键词为：{value6}
							</div>
						</div>:null
				}
			</div>
		)
	}
}
