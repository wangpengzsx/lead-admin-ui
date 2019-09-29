import React from "react";
import Layout from "../../../layout/Layout";
import {Checkbox,Pagination,Switch} from "antd";
import planStore from '../../../mobx/generalizeSupport/AdPutInManage/plan-store';
import {observer} from "mobx-react"
import Client from "../../../common/lead-api";
import Clipboard from "clipboard";
const headArr=[
	{name:'广告计划名称',w:'10.55%'},
	{name:'计划状态',w:'10.55%'},
	{name:'广告计划id',w:'10.55%'},
	{name:'广告活动数',w:'10.55%'},
	{name:'花费',w:'10.55%'},
	{name:'总预算',w:'10.55%'},
	{name:'总曝光限制',w:'10.55%'},
	{name:'最后更新时间',w:'10.55%'},
	{name:'操作',w:'10.55%'}
]
@observer
export default class PlanList extends React.Component {
	constructor(){
		super()
		this.state={
			page:1,
			size:10,
			name:'',
			ids:[]
		}
	}
	componentWillMount(){
		localStorage.removeItem('adPlanId');
		localStorage.removeItem('findPlanId');
		planStore.getPlanArr(this.state.size,this.state.page,this.state.name,localStorage.getItem('findAdvertiserId'))
	}
	componentDidMount(){
		var clipboard = new Clipboard('.geziChild');
		clipboard.on('success', function(e) {
			Client.showTank(true,'复制成功')
		});
	}
	onInputChange(e){
		this.setState({
			name:e.target.value
		})
	}
	searchApp(){
		planStore.getPlanArr(this.state.size,this.state.page,this.state.name,localStorage.getItem('findAdvertiserId'))
	}
	onAllChange(e){
		let {planArr}=planStore;
		let arr = [];
		if (e.target.checked) {
			planArr.map(i => arr.push(i.id))
		}
		this.setState({ids: arr})
	}
	openItem(){
		this.updatePlanState(0)
	}
	closeItem(){
		this.updatePlanState(1)
	}
	removeItem(){
		this.updatePlanState(-1)
		this.setState({ids:[]})
	}
	onSwitchChange(state,id){
		planStore.updatePlanState([id],state,this.callback.bind(this))
	}
	updatePlanState(state){
		planStore.updatePlanState(this.state.ids,state,this.callback.bind(this))
	}
	callback(){
		planStore.getPlanArr(this.state.size,this.state.page,this.state.name,localStorage.getItem('findAdvertiserId'))
	}
	onPageChange(page){
		this.setState({page})
		setTimeout(()=>{
			this.callback()
		},300)
	}
	onShowSizeChange(page,size){
		this.setState({size,page})
		setTimeout(()=>{
			this.callback()
		},300)
	}
	onOneChange(i){
		let arr=this.state.ids;
		if(arr.indexOf(i)>-1){
			let index=arr.indexOf(i);
			if (index > -1) {
				arr.splice(index, 1);
			}
		}else{
			arr.push(i);
		}
		this.setState({
			ids:arr
		});
	}
	skip(id){
		localStorage.setItem('findPlanId',id)
		this.props.history.push({pathname:'/activityList'});
	}
	newPlan(){
		this.props.history.push({pathname:'/newPlan'});
	}
	edit(id){
		localStorage.setItem('adPlanId',id);
		this.props.history.push({pathname:'/newPlan'});
	}
	render() {
		let {planArr,total}=planStore;
		return (
			<div>
				<Layout history={this.props.history}/>
				<div className="content">
					<div className="contentBulk1">
						<div className="con-head">
							<div>
								<button className="borderBtn" onClick={()=>this.newPlan()}>创建广告计划</button>
								<button className="borderBtn" onClick={()=>this.openItem()}>开启</button>
								<button className="borderBtn" onClick={()=>this.closeItem()}>关闭</button>
								<button className="borderBtn" onClick={()=>this.removeItem()}>删除</button>
							</div>
							<div className="searchInput">
								<input type="text"
									   placeholder="请输入查询的名称和关键字"
									   onChange={(e)=>this.onInputChange(e)}
									   className='searchInputText'/>
								<div className='searchInputButton' onClick={()=>this.searchApp()}></div>
							</div>
						</div>
						<div className="table-head">
							<div  style={{width:'5%',float:'left',textAlign:'center'}}>
								<Checkbox onChange={this.onAllChange.bind(this)} checked={this.state.ids.length==planArr.length}/>
							</div>
							{
								headArr.map((i,k)=>(
									<div key={k} style={{width:i.w,float:'left',textAlign:'center'}}>
										{i.name}
									</div>
								))
							}
						</div>
						{planArr.map((i,k)=>(
							<div className="table-body" key={k} style={{background:k%2==0?'#fff':'#fafafa'}}>
								<div  style={{width:'5%'}} className='gezi'>
									<Checkbox onChange={this.onOneChange.bind(this,i.id)} checked={this.state.ids.indexOf(i.id)>-1}/>
								</div>
								<div  style={{width:headArr[0].w}} className='gezi'>{/*广告计划名称*/}
									<span className="modification" onClick={()=>{this.skip(i.id)}}>
										{i.name}
									</span>
								</div>
								<div  style={{width:headArr[1].w}} className='gezi'>{/*计划状态*/}
									<Switch checkedChildren="开" unCheckedChildren="关" checked={i.planState==0} onChange={()=>this.onSwitchChange(i.planState==0?1:0,i.id)}/>
								</div>
								<div  style={{width:headArr[2].w}} title={i.id} className='gezi'>{/*广告计划id*/}
									{i.id}
									<button id={i.id}  data-clipboard-text={i.id} className="geziChild">
										复制
									</button>
								</div>
								<div style={{width:headArr[3].w}} className='gezi'>{/*广告活动数*/}
									{i.activeNum}
								</div>
								<div  style={{width:headArr[4].w}} className='gezi'>{/*花费*/}
								</div>
								<div  style={{width:headArr[5].w}} className='gezi'>{/*总预算*/}
									{i.totalBudget==0?'不限制':i.totalBudget}
								</div>
								<div  style={{width:headArr[6].w}} className='gezi'>{/*总曝光限制*/}
									{i.totalPv==0?'不限制':i.totalPv}
								</div>
								<div  style={{width:headArr[7].w}}
									  title={Client.formatDateTime(i.modifyTime)}
									  className='gezi'>{/*最后更新时间*/}
									{Client.formatDateTime(i.modifyTime)}
								</div>
								<div  style={{width:headArr[8].w}} className='gezi'>{/*操作*/}
									<span className="modification" onClick={()=>{this.edit(i.id)}}>编辑</span>
								</div>
							</div>
						))}
						<div className='con-head'>
							<Pagination
								pageSizeOptions={['10','20','50','100']}
								showSizeChanger
								defaultPageSize={this.state.size}
								onChange={this.onPageChange.bind(this)}
								onShowSizeChange={this.onShowSizeChange.bind(this)} defaultCurrent={1} total={total} />
						</div>
					</div>
				</div>
			</div>
		)
	}
}
