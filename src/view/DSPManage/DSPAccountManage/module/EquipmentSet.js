import React from "react";
import {Radio} from "antd";
import dspManageStore from "../../../../mobx/dspManage/DSPManageStore/dsp-manage-store";
import {observer} from "mobx-react";
const RadioGroup = Radio.Group;
@observer
export default class EquipmentSet extends React.Component {
	constructor(){
		super()
	}
	onCycleChange(e){
		dspManageStore.state7=e.target.value;
		if(e.target.value=='no'){
			dspManageStore.equChoiceArr=[];
			dspManageStore.equExcludeArr=[];
		}
	}
	skip(){
		this.props.history.push({
			pathname:'/equipmentSetCom1'
		})
	}
	render() {
		let {state7,equChoiceArr,equExcludeArr}=dspManageStore
		return (
			<div>
				<div className="accountListRow" >
					<div className="form-left">
						<i className="red">*</i>投放设备：
					</div>
					<div className="form-right-multiple" >
						<RadioGroup onChange={(e)=>this.onCycleChange(e)}
									value={state7}>
							<Radio value='no'>不限</Radio>
							<Radio value='yes'>设置设备</Radio>
						</RadioGroup>
						{state7=='yes'?(<a onClick={()=>{this.skip()}}>设置</a>):null}
					</div>
				</div>
				{
					state7=='yes'&&equChoiceArr.length>0?(
						<div style={{width:'100%',height:20}}>
							<div className="form-left" style={{height:20}}>
							</div>
							<div className="form-right-multiple1" style={{height:20}}>
								已选择
							</div>
						</div>
					):null
				}
				{state7=='yes'?equChoiceArr.map((i,k)=>(
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
				{
					state7=='yes'&&equExcludeArr.length>0?(
						<div style={{width:'100%',height:20}}>
							<div className="form-left" style={{height:20}}>
							</div>
							<div className="form-right-multiple1" style={{height:20}}>
								已排除
							</div>
						</div>
					):null
				}
				{state7=='yes'?equExcludeArr.map((i,k)=>(
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
