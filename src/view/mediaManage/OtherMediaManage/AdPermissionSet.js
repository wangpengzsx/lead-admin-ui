import React from "react";
import Layout from "../../../layout/Layout";
import {Pagination } from "antd";
import adPermissionStore from "../../../mobx/mediaManage/otherMediaManage/ad-permission-store";
import {observer} from "mobx-react";
import PermissionModal from "./modal/permissionModal";
import Client from "../../../common/lead-api";
import SearchInput from './component/SearchInput';
import NavHeader from './component/NavHeader';
const headArr=[{name:'应用名称',w:'20%'},
	{name:'appid',w:'20%'},
	{name:'包名',w:'20%'},
	{name:'应用创建时间',w:'20%'},
	{name:'广告位权限设置',w:'20%'}];
@observer
export default class AdPermissionSet extends React.Component {
	constructor(){
		super()
		this.state={
			size:10,
			page:1,
			appName:'',
			appId:'',
			packageName:'',
		}
	}
	componentWillMount(){
		let {appName,appId,packageName,size,page}=this.state;
		adPermissionStore.getleadApps(appName,appId,packageName,size,page)
	}
	query(){
		this.onPageChange(1)
	}
	onPageChange(i){
		this.setState({
			page:i
		})
		let {appName,appId,packageName,size}=this.state;
		adPermissionStore.getleadApps(appName,appId,packageName,size,i)
	}
	onShowSizeChange(current, pageSize) {
		this.setState({
			page:1,
			size:pageSize
		})
		let {appName,appId,packageName}=this.state;
		adPermissionStore.getleadApps(appName,appId,packageName,pageSize,1)
	}
	setPerModal(id){
		this._permissionModal.openModal(id)
	}
	render() {
		let {leadAppsArr,total}=adPermissionStore;
		return (
			<div>
				<Layout history={this.props.history}/>
				<div className="content">
					<PermissionModal ref={(e) => this._permissionModal = e}/>
					<NavHeader/>
					<div className="contentBulk">
						<SearchInput call={(e)=>this.setState({appName:e})} label='应用名称'/>
						<SearchInput call={(e)=>this.setState({appId:e})} label='应用id'/>
						<SearchInput call={(e)=>this.setState({packageName:e})} label='包名'/>
					</div>
					<div style={{ paddingBottom: 10 }}>
						<button className="filtrateBtn" onClick={() => { this.query() }}>
							查询
						</button>
					</div>
					<div className="contentBulk1" style={{paddingTop:10}}>
						<div className="table-head">
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
								<div  style={{width:headArr[0].w}} title={i.appName} className='gezi'>
									{i.appName}
								</div>
								<div style={{width:headArr[1].w}} title={i.packageName} className='gezi'>
									{i.id}
								</div>
								<div  style={{width:headArr[2].w}} title={i.appType} className='gezi'>
									{i.packageName}
								</div>
								<div  style={{width:headArr[3].w}} className='gezi'>
									{Client.formatDateTime(i.createTime)}
								</div>
								<div  style={{width:headArr[4].w}} className='gezi'>
									<a href="javascript:(0)" onClick={()=>this.setPerModal(i.id)}>
										设置
									</a>
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
