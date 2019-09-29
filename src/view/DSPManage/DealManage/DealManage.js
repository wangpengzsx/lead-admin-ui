import React from "react";
import Layout from "../../../layout/Layout";
import {Checkbox,Switch,Pagination} from "antd";
import {observer} from "mobx-react";
import dealManageStore from "../../../mobx/dspManage/dealManage/deal-manage-store";
import Client from "../../../common/lead-api";
const headArr=[
	{name:'Deal名称',w:'7.91%'},
	{name:'Deal状态',w:'7.91%'},
	{name:'订单类型',w:'7.91%'},
	{name:'Dealid',w:'7.91%'},
	{name:'投放媒体终端',w:'7.91%'},
	{name:'投放Dsp平台',w:'7.91%'},
	{name:'计费单位',w:'7.91%'},
	{name:'总曝光上限',w:'7.91%'},
	{name:'日曝光上限',w:'7.91%'},
	{name:'订单有效期',w:'7.91%'},
	{name:'策略创建时间',w:'7.91%'},
	{name:'操作',w:'7.91%'}
];
@observer
export default class DealManage extends React.Component {
	constructor(){
		super()
		this.state={
			page:1,
			size:10,
			chooseArr:[],
			name:''
		}
	}
	componentWillMount(){
		dealManageStore.getDealList(this.state.page,this.state.size,this.state.name)
	}
	onAllChange(e) {
		console.log(e);
		let {tableList} = dealManageStore;
		let arr = [];
		if (e.target.checked) {
			tableList.map(i => arr.push(i.id))
		}
		this.setState({chooseArr: arr})
	}
	onChange(i){
		let arr=this.state.chooseArr;
		if(arr.indexOf(i)>-1){
			let index=arr.indexOf(i);
			if (index > -1) {
				arr.splice(index, 1);
			}
		}else{
			arr.push(i);
		}
		this.setState({
			chooseArr:arr
		});
	}
	onPageChange(page){
		this.setState({page});
		setTimeout(()=>{
			dealManageStore.getDealList(this.state.page,this.state.size,this.state.name)
		},300)
	}
	onShowSizeChange(page,size){
		this.setState({size,page})
		setTimeout(()=>{
			dealManageStore.getDealList(this.state.page,this.state.size,this.state.name)
		},300)
	}
	onInputChange(e){
		this.setState({
			name:e.target.value
		})
	}
	searchApp(){
		dealManageStore.getDealList(this.state.page,this.state.size,this.state.name)
	}
	removeItem(){
		let id=Client.arrStr(this.state.chooseArr)
		Client.getNullArgument('leadDeals/search/updateState?dealId='+id+'&dealState='+-1).then(res=>{
			dealManageStore.getDealList(this.state.page,this.state.size,this.state.name)
		})
		this.setState({
			chooseArr:[]
		})
	}
	onSwitchChange(e,id){
		let state=e?0:1;
		Client.getNullArgument('leadDeals/search/updateState?dealId='+id+'&dealState='+state).then(res=>{
			dealManageStore.getDealList(this.state.page,this.state.size,this.state.name)
		})
	}
	newDeal(){
		this.props.history.push({pathname:'/newDeal'})
	}
	edit(id){
		localStorage.setItem('dealId',id);
		this.props.history.push({pathname:'/editDeal'})
	}
	render() {
		let {tableList,total}=dealManageStore
		return (
			<div>
				<Layout history={this.props.history}/>
				<div className="content">
					<div className="contentBulk1">
						<div className="con-head">
							<div>
								<button className="borderBtn" onClick={()=>this.newDeal()}>新建Deal</button>
								<button className="borderBtn" onClick={()=>this.removeItem()}>删除</button>
							</div>
							<div className="searchInput">
								<input type="text"
									   placeholder="请输入查询的名称和关键字"
									   onChange={(e)=>this.onInputChange(e)}
									   value={this.state.name}
									   className='searchInputText'/>
								<div className='searchInputButton' onClick={()=>this.searchApp()}></div>
							</div>
						</div>
						<div className="table-head">
							<div  style={{width:'5%',float:'left',textAlign:'center'}}>
								<Checkbox onChange={this.onAllChange.bind(this)} checked={this.state.chooseArr.length==tableList.length}/>
							</div>
							{
								headArr.map((i,k)=>(
									<div key={k} style={{width:i.w,float:'left',textAlign:'center'}}>
										{i.name}
									</div>
								))
							}

						</div>
						{tableList.map((i,k)=>(
							<div className="table-body" key={k} style={{background:k%2==0?'#fff':'#fafafa'}}>
								<div  style={{width:'5%'}} className='gezi'>
									<Checkbox onChange={this.onChange.bind(this,i.id)} checked={this.state.chooseArr.indexOf(i.id)>-1}/>
								</div>
								<div  style={{width:headArr[0].w}} className='gezi'>{/*Deal名称*/}
									{i.dealName}
								</div>
								<div  style={{width:headArr[1].w}} className='gezi'>{/*Deal状态*/}
									<Switch checkedChildren="开" unCheckedChildren="关" checked={i.dealState==0} onChange={(e)=>this.onSwitchChange(e,i.id)}/>
								</div>
								<div  style={{width:headArr[2].w}} className='gezi'>{/*订单类型*/}
									{i.dealType}
								</div>
								<div style={{width:headArr[3].w}} title={i.id} className='gezi'>{/*Dealid*/}
									{i.id}
								</div>
								<div  style={{width:headArr[4].w}} className='gezi'>{/*投放媒体终端*/}
									{i.terminal}
								</div>
								<div  style={{width:headArr[5].w}} className='gezi'>{/*投放DSP平台*/}
									{i.leadDsp.name}
								</div>
								<div  style={{width:headArr[6].w}} className='gezi'>{/*计费单位*/}
									{i.dealPrice}
								</div>
								<div  style={{width:headArr[7].w}} className='gezi'>{/*总曝光上限*/}
									{i.totalPv==0?'不限制':i.totalPv}
								</div>
								<div  style={{width:headArr[8].w}} className='gezi'>{/*日曝光上限*/}
									{i.dayPv==0?'不限制':i.dayPv}
								</div>
								<div  style={{width:headArr[9].w}}
									  title={i.startTime?Client.formatDate(i.startTime)+'~'+Client.formatDate(i.endTime):null}
									  className='gezi'>{/*订单有效期*/}
									{i.startTime?Client.formatDate(i.startTime)+'~'+Client.formatDate(i.endTime):'不限制'}
								</div>
								<div  style={{width:headArr[10].w}} className='gezi'>{/*策略创建时间*/}
									{Client.formatDate(i.createTime)}
								</div>
								<div  style={{width:headArr[11].w}} className='gezi'>{/*操作*/}
									<span className="modification" onClick={()=>this.edit(i.id)}>编辑</span>
								</div>
							</div>
						))}
						<div className='con-head'>
							<Pagination
								pageSizeOptions={['10','20','50','100']}
								showSizeChanger
								defaultPageSize={this.state.size}
								current={this.state.page}
								onChange={this.onPageChange.bind(this)}
								onShowSizeChange={this.onShowSizeChange.bind(this)} defaultCurrent={1} total={total} />
						</div>
					</div>
				</div>
			</div>
		)
	}
}
