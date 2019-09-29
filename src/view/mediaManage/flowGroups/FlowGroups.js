import React from "react";
import Layout from "../../../layout/Layout";
import {observer} from "mobx-react";
import {Checkbox, Pagination, Switch} from "antd";
import FlowGroupsStore from "../../../mobx/mediaManage/flowGroups/flow-groups-store"
import {Link} from "react-router-dom";
import Client from "../../../common/lead-api"
const headArr=[{name:'流量分组名称',w:'9.5%'},
	{name:'关联第三方应用数量',w:'9.5%'},
	{name:'状态',w:'9.5%'},
	{name:'Banner广告底价',w:'9.5%'},
	{name:'插屏广告底价',w:'9.5%'},
	{name:'开屏广告底价',w:'9.5%'},
	{name:'原生广告底价',w:'9.5%'},
	{name:'视频广告底价',w:'9.5%'},
	{name:'最后更新时间',w:'9.5%'},
	{name:'操作',w:'9.5%'},];
@observer
export default class FlowGroups extends React.Component {
	constructor(){
		super();
		this.state={
			size:10,
			page:1,
			searchText:'',
			chooseIdArr:[]
		}
	}
	componentWillMount(){
		FlowGroupsStore.searchleadAppsGroups(this.state.searchText,this.state.size,this.state.page)
	}
	clickSearch(){
		FlowGroupsStore.searchleadAppsGroups(this.state.searchText,this.state.size,this.state.page)
	}
	onAllChange(e){
		let {appsGroups}=FlowGroupsStore;
		let arr=[];
		appsGroups.map(i=>arr.push(i.id));
		let arr1=this.state.chooseIdArr;
		if(e.target.checked){
			arr1=arr;
		}else{
			for(let i=0;i<arr1.length; i++){
				for(let j=0;j<arr.length; j++){
					if(arr1[i]==arr[j]){
						arr1.splice(i,1)
					}
				}
			}
		}
		this.setState({
			chooseIdArr:arr1
		});
	}
	onChange(i){
		let arr=this.state.chooseIdArr;
		if(arr.indexOf(i)>-1){
			let index=arr.indexOf(i);
			if (index > -1) {
				arr.splice(index, 1);
			}
		}else{
			arr.push(i);
		}
		this.setState({
			chooseIdArr:arr
		});
	}
	isCheckd(CreativesArr){
		let arr=[]
		for(let i=0; i<CreativesArr.length; i++){
			arr.push(CreativesArr[i].id)
		}
		return Client.isContained(this.state.chooseIdArr,arr);
	}
	onPageChange(i){
		this.setState({
			page:i
		})
		FlowGroupsStore.searchleadAppsGroups(this.state.searchText,this.state.size,i)
	}
	onShowSizeChange(current, pageSize){
		this.setState({
			size:pageSize,
			page:current
		})
		FlowGroupsStore.searchleadAppsGroups(this.state.searchText,pageSize, current)
	}
	callback(){
		FlowGroupsStore.searchleadAppsGroups(this.state.searchText,this.state.size,this.state.page)
	}
	onSwitchChange(e,id){
		if(e){
			FlowGroupsStore.changeLeadGroups({ids: [id], field: "state", value: "OPEN"},this.callback.bind(this));
		}else{
			FlowGroupsStore.changeLeadGroups({ids: [id], field: "state", value: "CLOSED"},this.callback.bind(this));
		}
	}
	openItem(){
		FlowGroupsStore.changeLeadGroups({ids: this.state.chooseIdArr, field: "state", value: "OPEN"},this.callback.bind(this))
	}
	closeItem(){
		FlowGroupsStore.changeLeadGroups({ids: this.state.chooseIdArr, field: "state", value: "CLOSED"},this.callback.bind(this))
	}
	removeItem(){
		FlowGroupsStore.changeLeadGroups({ids: this.state.chooseIdArr, field: "state", value: "DELETED"},this.callback.bind(this))
	}
	setFlowGroupId(id){
		localStorage.setItem('newFlowGroups1',id);
	}
	render() {
		let {appsGroups,total}=FlowGroupsStore;
		return (
			<div>
				<Layout history={this.props.history}/>
				<div className="content">
					<div className="contentBulk1">
						<div className="con-head">
							<div>
								<button className="borderBtn" onClick={()=>this.props.history.push({pathname:'/newFlowGroups'})} >创建流量分组</button>
								<button className="borderBtn" onClick={()=>this.openItem()}>开启</button>
								<button className="borderBtn" onClick={()=>this.closeItem()}>关闭</button>
								<button className="borderBtn" onClick={()=>this.removeItem()}>删除</button>
							</div>
							<div className="searchInput">
								<input type="text"
									   placeholder="请输入查询的名称和关键字"
									   onChange={(e)=>this.setState({searchText:e.target.value})}
									   className='searchInputText'/>
								<div className='searchInputButton' onClick={()=>this.clickSearch()}></div>
							</div>
						</div>
						<div className="table-head">
							<div  style={{width:'5%',float:'left',textAlign:'center'}}>
								<Checkbox onChange={this.onAllChange.bind(this)} checked={this.isCheckd(appsGroups)}/>
							</div>
							{
								headArr.map((i,k)=>(
									<div key={k} style={{width:i.w,float:'left',textAlign:'center',fontSize:12}}>
										{i.name}
									</div>
								))
							}
						</div>
						{appsGroups.map((i,k)=>(
							<div className="table-body" key={k} style={{background:k%2==0?'#fff':'#fafafa'}}>
								<div  style={{width:'5%'}} className='gezi'>
									<Checkbox onChange={this.onChange.bind(this,i.id)} checked={this.state.chooseIdArr.indexOf(i.id)>-1}/>
								</div>
								<div  style={{width:headArr[0].w}} className='gezi'>
									{i.name}
								</div>
								<div  style={{width:headArr[1].w}} className='gezi'>
									{i.memberCount}
								</div>
								<div  style={{width:headArr[2].w}} className='gezi'>
									<Switch checkedChildren="开"
											unCheckedChildren="关"
											defaultChecked
											onChange={(e)=>this.onSwitchChange(e,i.id)}
											checked={i.state=='OPEN'}/>
								</div>
								<div style={{width:headArr[3].w}} className='gezi'>
									{i.priceBanner}元
								</div>
								<div  style={{width:headArr[4].w}} className='gezi'>
									{i.pricePopup}元
								</div>
								<div  style={{width:headArr[5].w}} className='gezi'>
									{i.priceOpenScreen}元
								</div>
								<div  style={{width:headArr[6].w}} className='gezi'>
									{i.priceNative}元
								</div>
								<div  style={{width:headArr[7].w}} className='gezi'>
									{i.priceVideo}元
								</div>
								<div  style={{width:headArr[8].w}} className='gezi'>
									{Client.formatDateTime(i.modifyTime)}
								</div>
								<div  style={{width:headArr[9].w}} className='gezi'>
									<Link to={{
										pathname:'/newFlowGroups1',
										id:i.id,
										name:i.name,
										priceBanner:i.priceBanner,
										pricePopup:i.pricePopup,
										priceOpenScreen:i.priceOpenScreen,
										priceNative:i.priceNative,
										priceVideo:i.priceVideo
									}} onClick={()=>this.setFlowGroupId(i.id)}>
										编辑
									</Link>
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
