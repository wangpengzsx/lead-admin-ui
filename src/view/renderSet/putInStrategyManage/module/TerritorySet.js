import React from "react";
import {Radio} from "antd";
const RadioGroup = Radio.Group;
export default class TerritorySet extends React.Component {
	constructor(){
		super()
		this.state={
			cycleState:localStorage.getItem('territoryState')||'no',
			chooseTimeFrame:[],
			choiceArr:localStorage.getItem('choiceArr')?JSON.parse(localStorage.getItem('choiceArr')):[],
			excludeArr:localStorage.getItem('excludeArr')?JSON.parse(localStorage.getItem('excludeArr')):[]
		}
	}
	onCycleChange(e){
		localStorage.setItem('territoryState',e.target.value);
		if(e.target.value=='no'){
			localStorage.setItem('choiceArr',JSON.stringify([]));
			localStorage.setItem('excludeArr',JSON.stringify([]));
			this.setState({
				choiceArr:[],
				excludeArr:[]
			})
		}
		this.setState({
			cycleState:e.target.value
		})
	}
	skip(){
		this.props.history.push({
			pathname:'/territorySetCom'
		})
	}
	render() {
		return (
			<div>
				<div className="accountListRow" >
					<div className="form-left">
						<i className="red">*</i>投放地域：
					</div>
					<div className="form-right-multiple" >
						<RadioGroup onChange={(e)=>this.onCycleChange(e)}
									value={this.state.cycleState}>
							<Radio value='no'>不限</Radio>
							<Radio value='yes'>设置地域</Radio>
						</RadioGroup>
						{this.state.cycleState=='yes'?(<a onClick={()=>{this.skip()}}>设置</a>):null}
					</div>
				</div>
				{this.state.cycleState=='yes'&&this.state.choiceArr.length>0?(
					<div style={{width:'100%',height:20}}>
						<div className="form-left" style={{height:20}}>
						</div>
						<div className="form-right-multiple1" style={{height:20}}>
							已选择
						</div>
					</div>
				):null}
				{this.state.cycleState=='yes'?this.state.choiceArr.map((i,k)=>(
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
				{this.state.cycleState=='yes'&&this.state.excludeArr.length>0?(
					<div style={{width:'100%',height:20}}>
						<div className="form-left" style={{height:20}}>
						</div>
						<div className="form-right-multiple1" style={{height:20}}>
							已排除
						</div>
					</div>
				):null}
				{this.state.cycleState=='yes'?this.state.excludeArr.map((i,k)=>(
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
