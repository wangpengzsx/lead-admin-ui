import React from "react";
import Layout from "../../../layout/Layout";
import {Radio} from "antd";
import Client from "../../../common/lead-api"
export default class NewPlan extends React.Component {
	constructor(){
		super()
		this.state={
			name:'',
			name1:'',
			name2:'',
			value1:1,
			value2:1
		}
	}
	componentWillMount(){
		if(localStorage.getItem('adPlanId')){
			Client.getNullArgument('adv/getPlanInfo?id='+localStorage.getItem('adPlanId')).then(res=>{
				this.setState({
					name:res.name,
					value2:res.totalPv==0?1:2,
					name2:res.totalPv==0?'':res.totalPv,
					value1:res.totalBudget==0?1:2,
					name1:res.totalBudget==0?'':res.totalBudget,
				})
			})
		}
	}
	nameChange(e){
		this.setState({
			name:e.target.value
		})
	}
	onRadioChange(e,value){
		this.setState({
			[value]:e.target.value
		})
	}
	submit(){
		let {name,name1,name2,value1,value2}=this.state;
		if(name!=''){
			let obj={
				name:name,
				totalPv:value2==1?'':name2,
				totalBudget:value1==1?'':name1,
				ourAdvertiser:{id:localStorage.getItem('findAdvertiserId')},
				planState:0
			}
			if(obj.totalPv==''&&obj.totalBudget==''){
				this.savePlan(obj);
			}else if(obj.totalPv!=''&&obj.totalBudget==''){
				if(Client.isInt(obj.totalPv)){
					this.savePlan(obj);
				}else{
					Client.showTank(false,'总曝光上限必须是正整数')
				}
			}else if(obj.totalPv==''&&obj.totalBudget!=''){
				if(Client.isNumber(obj.totalBudget)){
					this.savePlan(obj);
				}else{
					Client.showTank(false,'总预算必须是数字')
				}
			}else{
				if(Client.isNumber(obj.totalBudget)&&Client.isInt(obj.totalPv)){
					this.savePlan(obj);
				}else if(!Client.isNumber(obj.totalBudget)&&Client.isInt(obj.totalPv)){
					Client.showTank(false,'总预算必须是数字')
				}else if(Client.isNumber(obj.totalBudget)&&!Client.isInt(obj.totalPv)){
					Client.showTank(false,'总曝光上限必须是正整数')
				}else{
					Client.showTank(false,'请按要求填写')
				}
			}
		}else{
			Client.showTank(false,'请填写必填项')
		}
	}
	savePlan(obj){
		if(localStorage.getItem('adPlanId'))obj.id=localStorage.getItem('adPlanId');
		Client.createObject('adv/savePlan',obj).then(res=>{
			if(res.status==200){
				this.props.history.push({pathname:'/planList'})
			}else{
				Client.showTank(false,res.message)
			}
		})
	}
	render() {
		return (
			<div>
				<Layout history={this.props.history}/>
				<div className="content">
					<div className="list-haed">
						<span className="dah1">
							基础信息
						</span>
					</div>
					<div className="contentBulk">
						<div className="accountListRow">
							<div className="form-left">
								<i className="red">*</i>&nbsp; 广告计划名称:
							</div>
							<div className="form-right">
								<input style={{width:360,height:30}}
									   type="text" className='border1'
									   value={this.state.name}
									   onChange={e=>this.nameChange(e)}/>
							</div>
						</div>
						{localStorage.getItem('adPlanId')?
							<div className="accountListRow">
								<div className="form-left">
									广告计划id:
								</div>
								<div className="form-right">
									{localStorage.getItem('adPlanId')}
								</div>
							</div>:null}
						<div className="accountListRow">
							<div className="form-left">
								<i className="red">*</i>&nbsp; 总预算:
							</div>
							<div className="form-right">
								<Radio.Group onChange={(e)=>this.onRadioChange(e,'value1')} value={this.state.value1}>
									<Radio value={1}>不限制</Radio>
									<Radio value={2}>预算上限</Radio>
								</Radio.Group>
								{this.state.value1==2?<input style={{width:100,height:30}}
									   type="text" className='border1'
									   value={this.state.name1}
									   onChange={e=>this.onRadioChange(e,'name1')}/>:null}
								{this.state.value1==2?'元':null}
							</div>
						</div>
						<div className="accountListRow">
							<div className="form-left">
								<i className="red">*</i>&nbsp; 总曝光上限:
							</div>
							<div className="form-right">
								<Radio.Group onChange={(e)=>this.onRadioChange(e,'value2')} value={this.state.value2}>
									<Radio value={1}>不限制</Radio>
									<Radio value={2}>曝光上限</Radio>
								</Radio.Group>
								{this.state.value2==2?<input style={{width:100,height:30}}
															 type="text" className='border1'
															 value={this.state.name2}
															 onChange={e=>this.onRadioChange(e,'name2')}/>:null}
								{this.state.value2==2?'说明：此处填写PV值':null}
							</div>
						</div>
					</div>
					<div className="submit-content">
						<button className="cancelBtn" onClick={()=>this.props.history.push({pathname:'/planList'})}>取消</button>
						<button className="confirmBtn" onClick={()=>this.submit()}>确定</button>
					</div>
				</div>
			</div>
		)
	}
}
