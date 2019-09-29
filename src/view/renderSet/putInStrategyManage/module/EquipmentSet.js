import React from "react";
import {Radio} from "antd";
const RadioGroup = Radio.Group;
export default class EquipmentSet extends React.Component {
	constructor(){
		super()
		this.state={
			cycleState:localStorage.getItem('equipmentState')||'no',
			chooseTimeFrame:[],
			equChoiceArr:localStorage.getItem('equChoiceArr')?JSON.parse(localStorage.getItem('equChoiceArr')):[],
			equExcludeArr:localStorage.getItem('equExcludeArr')?JSON.parse(localStorage.getItem('equExcludeArr')):[]
		}
	}
	onCycleChange(e){
		localStorage.setItem('equipmentState',e.target.value);
		if(e.target.value=='no'){
			localStorage.setItem('equChoiceArr',JSON.stringify([]));
			localStorage.setItem('equExcludeArr',JSON.stringify([]));
			this.setState({
				equChoiceArr:[],
				equExcludeArr:[]
			})
		}
		this.setState({
			cycleState:e.target.value
		})
	}
	skip(){
		this.props.history.push({
			pathname:'/equipmentSetCom'
		})
	}
	render() {
		return (
			<div>
				<div className="accountListRow" >
					<div className="form-left">
						<i className="red">*</i>投放设备：
					</div>
					<div className="form-right-multiple" >
						<RadioGroup onChange={(e)=>this.onCycleChange(e)}
									value={this.state.cycleState}>
							<Radio value='no'>不限</Radio>
							<Radio value='yes'>设置设备</Radio>
						</RadioGroup>
						{this.state.cycleState=='yes'?(<a onClick={()=>{this.skip()}}>设置</a>):null}
					</div>
				</div>
				{this.state.cycleState=='yes'&&this.state.equChoiceArr.length>0?(
					<div style={{width:'100%',height:20}}>
						<div className="form-left" style={{height:20}}>
						</div>
						<div className="form-right-multiple1" style={{height:20}}>
							已选择
						</div>
					</div>
				):null}
				{this.state.cycleState=='yes'?this.state.equChoiceArr.map((i,k)=>(
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
				{this.state.cycleState=='yes'&&this.state.equExcludeArr.length>0?(
					<div style={{width:'100%',height:20}}>
						<div className="form-left" style={{height:20}}>
						</div>
						<div className="form-right-multiple1" style={{height:20}}>
							已排除
						</div>
					</div>
				):null}
				{this.state.cycleState=='yes'?this.state.equExcludeArr.map((i,k)=>(
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
