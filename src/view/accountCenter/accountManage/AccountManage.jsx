import React from "react";
import {Switch,Pagination} from 'antd';
import {Link} from "react-router-dom";
import AccountManageStore from "../../../mobx/accountCenter/account-manage-store"
import {observer} from "mobx-react";
import Client from '../../../common/lead-api';
import Layout from "../../../layout/Layout";
const headArr=[{name:'账户状态',w:'16.66%'},
	{name:'账户名称',w:'16.66%'},
	{name:'电子邮箱',w:'16.66%'},
	{name:'账户类型',w:'16.66%'},{name:'最后更新时间',w:'16.66%'},{name:'操作',w:'16.66%'}];
const navArr=[
	{name:'账户中心',isLink:false},
	{name:'账户管理',isLink:false}
]
@observer
export default class AccountManage extends React.Component {
	constructor(props){
		super(props)
		this.state={
			page:1,
			pageSize:10,
			typeObj:{},
			userName:''
		}
	}
	componentWillMount(){
		AccountManageStore.getleadUsers(this.state.pageSize,this.state.page,this.callback.bind(this));
	}
	callback(arr){
		arr.map(i=>{
			this.getTyped(i.id);
		})
	}
	getTyped(id){
		let obj=this.state.typeObj;
		let that=this;
		Client.getRelation("leadUsers",id,"groups").then(res=>{
			obj[id]=res._embedded.leadUserGroups;
			that.setState({
				typeObj:obj
			})
		})
	}
	searchUser(){
		AccountManageStore.searchleadUsers(this.state.userName);
	}
	reset(id){
		Client.createObject('auth/resetPassword',{userId:id}).then((res)=>{
			Client.showTank1(true,'重置成功,重置密码为（'+res.message+')')
		}).catch(err=>{
			console.log(err)
			Client.showTank(false,'重置失败')
		})
	}
	onSwitchChange(status,id){
		Client.modifyObject('leadUsers',id,{status:status==1?0:1}).then(res=>{
			AccountManageStore.getleadUsers(this.state.pageSize,this.state.page,this.callback.bind(this));
		})
	}
	onPageChange(i){
		this.setState({
			page:i
		})
		AccountManageStore.getleadUsers(this.state.pageSize,i,this.callback.bind(this));
	}
	onShowSizeChange(current, pageSize) {
		this.setState({
			page:1,
			pageSize:pageSize
		})
		AccountManageStore.getleadUsers(pageSize,1,this.callback.bind(this));
	}
	setAccountId(id){
		localStorage.setItem('editAccount',id);
	}
	render() {
		let {leadUsersArr,total}=AccountManageStore;
		return (
			<div>
				<Layout history={this.props.history} navlist={navArr}/>
				<div className="content">
					<div className="contentBulk1">
						<div className="con-head">
							<Link to={{
								pathname: '/newAccount',
							}}>
								<div className="borderBtn">
										创建账户
								</div>
							</Link>
							<div className="searchInput">
								<input type="text"
									   placeholder="请输入查询的名称和关键字"
									   onChange={(e)=>this.setState({userName:e.target.value})}
									   className='searchInputText'/>
								<div className='searchInputButton' onClick={()=>this.searchUser()}></div>
							</div>
						</div>
						<div className="table-head">
							{
								headArr.map((i,k)=>(
									<div key={k} style={{width:i.w,float:'left',textAlign:'center',color:'#808080'}}>
										{i.name}
									</div>
								))
							}
						</div>
						{leadUsersArr.map((i,k)=>(
							<div className="table-body" key={k} style={{background:k%2==0?'#fff':'#fafafa'}}>
								<div  style={{width:'16.66%'}} className='gezi'>
									<Switch checkedChildren="开"
											unCheckedChildren="关"
											defaultChecked
											onChange={()=>this.onSwitchChange(i.status,i.id)}
											checked={i.status==1}/>
								</div>
								<div  style={{width:'16.66%'}} title={i.userName} className='gezi'>
									{i.userName}
								</div>
								<div  style={{width:'16.66%'}} title={i.email} className='gezi'>
									{i.email}
								</div>
								<div  style={{width:'16.66%'}} title={this.state.typeObj[i.id]?this.state.typeObj[i.id].map(i=>i.name):null} className='gezi'>
									{this.state.typeObj[i.id]?this.state.typeObj[i.id].map(i=>i.name):null}
								</div>
								<div  style={{width:'16.66%'}} title={Client.formatDateTime(i.modifyTime)} className='gezi'>
									{Client.formatDateTime(i.modifyTime)}
								</div>
								<div  style={{width:'16.66%'}} className='gezi'>
									<Link to={{
										pathname: '/editAccount',
										id: i.id,
										userName:i.userName,
										email:i.email
									}} onClick={()=>this.setAccountId(i.id)}>编辑</Link>
									<button onClick={()=>this.reset(i.id)} className='pwRBtn'>密码重置</button>
								</div>
							</div>
						))}
						<div className="con-foot">
							<Pagination pageSizeOptions={['10','20','50','100']}
										showSizeChanger
										defaultPageSize={this.state.pageSize}
										onChange={this.onPageChange.bind(this)}
										onShowSizeChange={this.onShowSizeChange.bind(this)}
										current={this.state.page}
										defaultCurrent={this.state.page} total={total} />
						</div>
					</div>
				</div>
			</div>
		)
	}
}
