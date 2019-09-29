import React from "react";
import Layout from "../../../layout/Layout";
import {Switch,Pagination,Checkbox} from 'antd';
import {Link} from "react-router-dom";
import Client from "../../../common/lead-api";
import AppManageStore from "../../../mobx/mediaManage/appManage/app-manage-store";
import {observer} from "mobx-react";
import Clipboard from "clipboard";
const headArr=[{name:'应用名称',w:'8.63%'},
	{name:'应用状态',w:'8.63%'},
	{name:'广告位信息',w:'8.63%'},
	{name:'包名',w:'8.63%'},
	{name:'应用类型',w:'8.63%'},
	{name:'终端',w:'8.63%'},
	{name:'操作系统',w:'8.63%'},
	{name:'创建时间',w:'8.63%'},
	{name:'APPID',w:'8.63%'},
	{name:'最后更新时间',w:'8.63%'},
	{name:'操作',w:'8.63%'},];
@observer
export default class AppManage extends React.Component {
	constructor(){
		super()
		this.state={
			size:10,
			page:1,
			chooseIdArr:[],
			searchText:''
		};
	}
	componentWillMount(){
		AppManageStore.searchItem(this.state.searchText,this.state.page,this.state.size);
	}
	searchApp(){
		AppManageStore.searchItem(this.state.searchText,this.state.page,this.state.size);
	}
	componentDidMount(){
		var clipboard = new Clipboard('.geziChild');
		clipboard.on('success', function(e) {
			Client.showTank(true,'复制成功')
		});
	}
	onAllChange(e){
		let {leadAppsArr}=AppManageStore;
		let arr=[];
		leadAppsArr.map(i=>arr.push(i.id));
		let arr1=this.state.chooseIdArr;
		if(e.target.checked){
			arr1=arr
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
		AppManageStore.searchItem(this.state.searchText,i,this.state.size)
	}
	removeItem(){
		AppManageStore.deleteLeadApp({ids: this.state.chooseIdArr, field: "state", value: "DELETED"},this.callback.bind(this))
		let that=this;
		setTimeout(()=>{
			that.setState({
				chooseIdArr:[]
			});
		},300);
	}
	onShowSizeChange(current, pageSize) {
		this.setState({
			size:pageSize,
			page:current
		})
		AppManageStore.searchItem(this.state.searchText,current,pageSize)
	}
	onSwitchChange(state,id){
		let a=state=='OPEN'?"CLOSED":"OPEN";
		AppManageStore.modifyApp1(id,{state:a},this.callback.bind(this));
	}
	callback(){
		AppManageStore.searchItem(this.state.searchText,this.state.page,this.state.size)
	}
	onInputChange(e){
		this.setState({
			searchText:e.target.value
		})
	}
	setAppId(id){
		localStorage.setItem('editApp',id);
	}
	setAppSpaceId(id){
		localStorage.setItem('appId',id);
	}
	render() {
		let {leadAppsArr,total}=AppManageStore;
		return (
			<div>
				<Layout history={this.props.history}/>
				<div className="content">
					<div className="contentBulk1">
						<div className="con-head">
							<div>
								<Link to='/newApp'>
									<button className="borderBtn">
										创建应用
									</button>
								</Link>
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
								<Checkbox onChange={this.onAllChange.bind(this)} checked={this.isCheckd(leadAppsArr)}/>
							</div>
							{
								headArr.map((i,k)=>(
									<div key={k} style={{width:i.w,float:'left',textAlign:'center'}}>
										{i.name}
									</div>
								))
							}
						</div>
						{leadAppsArr.map((i,k)=>(
							<div className="table-body" key={k} style={{background:k%2==0?'#fff':'#fafafa'}}>
								<div  style={{width:'5%'}} className='gezi'>
									<Checkbox onChange={this.onChange.bind(this,i.id)} checked={this.state.chooseIdArr.indexOf(i.id)>-1}/>
								</div>
								<div  style={{width:headArr[0].w}} title={i.appName} className='gezi'>
									<Link to={{pathname:'/adSpaceManage',appId:i.id}} onClick={()=>this.setAppSpaceId(i.id)}>
										{i.appName}
									</Link>
								</div>
								<div  style={{width:headArr[1].w}} className='gezi'>
									<Switch checkedChildren="开" unCheckedChildren="关" checked={i.state=='OPEN'} onChange={()=>this.onSwitchChange(i.state,i.id)}/>
								</div>
								<div  style={{width:headArr[2].w}} title={i.description} className='gezi'>
									{i.description}
								</div>
								<div style={{width:headArr[3].w}} title={i.packageName} className='gezi'>
									{i.packageName}
								</div>
								<div  style={{width:headArr[4].w}} title={i.appType} className='gezi'>
									{i.appType}
								</div>
								<div  style={{width:headArr[5].w}} title={i.os=='Android'?'App':'PC'} className='gezi'>
									{i.os=='Android'?'App':'PC'}
								</div>
								<div  style={{width:headArr[6].w}} title={i.os} className='gezi'>
									{i.os}
								</div>
								<div  style={{width:headArr[7].w}} title={Client.formatDateTime(i.createTime)} className='gezi'>
									{Client.formatDateTime(i.createTime)}
								</div>
								<div  style={{width:headArr[8].w}} title={i.id} className='gezi'>
									{i.id}
									<button id={i.id}  data-clipboard-text={i.id} className="geziChild">
										复制
									</button>
								</div>
								<div  style={{width:headArr[9].w}} title={Client.formatDateTime(i.modifyTime)} className='gezi'>
									{Client.formatDateTime(i.modifyTime)}
								</div>
								<div  style={{width:headArr[10].w}} className='gezi'>
									<Link to={{
										pathname:'/editApp',
										appName:i.appName,
										packageName:i.packageName,
										description:i.description,
										appKeyWord:i.appKeyWord,
										id:i.id}} onClick={()=>this.setAppId(i.id)}>
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
