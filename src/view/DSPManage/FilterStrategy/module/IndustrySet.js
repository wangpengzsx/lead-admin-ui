import React from "react";
import {Radio} from "antd";
import {observer} from "mobx-react";
import filterStrategyStore from '../../../../mobx/dspManage/DSPManageStore/filter-strategy-store'
import Client from '../../../../common/lead-api'
const RadioGroup = Radio.Group;
@observer
export default class IndustrySet extends React.Component {
	constructor(){
		super()
		this.state={
			cycleState:filterStrategyStore.text5.length>0?'yes':'no',
			chooseTimeFrame:[],
		}
	}
	onCycleChange(e){
		if(e.target.value=='no'){
			filterStrategyStore.text5=[]
		}
		filterStrategyStore.state5=e.target.value
	}
	skip(){
		this.props.history.push({
			pathname:'/industryCom'
		})
	}
	render() {
		let {text5,state5}=filterStrategyStore
		return (
			<div>
				<div className="accountListRow" >
					<div className="form-left">
						<i className="red">*</i>广告主行业过滤：
					</div>
					<div className="form-right-multiple" >
						<RadioGroup onChange={(e)=>this.onCycleChange(e)}
									value={state5}>
							<Radio value='no'>不限</Radio>
							<Radio value='yes'>设置过滤广告主行业</Radio>
						</RadioGroup>
						{state5=='yes'?(<a onClick={()=>{this.skip()}}>设置</a>):null}
					</div>
				</div>
				{text5.length>0&&state5=='yes'?
				<div className="accountListRow" >
					<div className="form-left">
					</div>
					<div className="form-right-multiple" >
						已选择行业:{Client.arrStr(text5)}
					</div>
				</div>:null}
			</div>
		)
	}
}
