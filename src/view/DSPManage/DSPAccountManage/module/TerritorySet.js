import React from "react";
import {Radio} from "antd";
import dspManageStore from "../../../../mobx/dspManage/DSPManageStore/dsp-manage-store";
import {observer} from "mobx-react";
const RadioGroup = Radio.Group;
@observer
export default class TerritorySet extends React.Component {
	constructor(){
		super()
	}
	onCycleChange(e){
		dspManageStore.state2=e.target.value;
		if(e.target.value=='no'){
			dspManageStore.choiceArr=[];
			dspManageStore.excludeArr=[];
		}
	}
	skip(){
		this.props.history.push({
			pathname:'/territorySetCom1'
		})
	}
	render() {
		let {state2,choiceArr,excludeArr}=dspManageStore
		return (
			<div>
				<div className="accountListRow" >
					<div className="form-left">
						<i className="red">*</i>投放地域：
					</div>
					<div className="form-right-multiple" >
						<RadioGroup onChange={(e)=>this.onCycleChange(e)}
									value={state2}>
							<Radio value='no'>不限</Radio>
							<Radio value='yes'>设置地域</Radio>
						</RadioGroup>
						{state2=='yes'?(<a onClick={()=>{this.skip()}}>设置</a>):null}
					</div>
				</div>
				{state2=='yes'&&choiceArr.length>0?(
					<div style={{width:'100%',height:20}}>
						<div className="form-left" style={{height:20}}>
						</div>
						<div className="form-right-multiple1" style={{height:20}}>
							已选择
						</div>
					</div>
				):null}
				{state2=='yes'?choiceArr.map((i,k)=>(
					<div className="accountListRow" key={k}>
						<div className="form-left">
						</div>
						<div className="form-right-multiple" >
							<div className="chooseItem" key={k} style={{background:'#f4f4f4'}}>
								<div>
									{i}
								</div>
							</div>
						</div>
					</div>
				)):null}
				{state2=='yes'&&excludeArr.length>0?(
					<div style={{width:'100%',height:20}}>
						<div className="form-left" style={{height:20}}>
						</div>
						<div className="form-right-multiple1" style={{height:20}}>
							已排除
						</div>
					</div>
				):null}
				{state2=='yes'?excludeArr.map((i,k)=>(
					<div className="accountListRow" key={k}>
						<div className="form-left">

						</div>
						<div className="form-right-multiple" >
							<div className="chooseItem" key={k} style={{background:'#edeaed'}}>
								<div>
									{i}
								</div>
							</div>
						</div>
					</div>
				)):null}
			</div>
		)
	}
}
