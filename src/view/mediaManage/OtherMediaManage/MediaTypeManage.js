import React from "react";
import Layout from "../../../layout/Layout";
import {Pagination} from 'antd';
import SearchInput from './component/SearchInput';
import NavHeader from './component/NavHeader';
import SelectCom from './component/SelectCom';
import {observer} from "mobx-react";
import MediaModal from "./modal/mediaModal";
import mediaTypeStore from '../../../mobx/mediaManage/otherMediaManage/media-type-store'
const mediaArr=[
	{
		name:'自有媒体',
		value:'LENOVO',
	},
	{
		name:'第三方媒体',
		value:'THIRD',
	}
]
const headArr=[{name:'应用名称',w:'20%'},
	{name:'appid',w:'20%'},
	{name:'包名',w:'20%'},
	{name:'媒体类型',w:'20%'},
	{name:'媒体类型设置',w:'20%'}];
@observer
export default class MediaTypeManage extends React.Component {
	constructor(props){
		super(props)
		this.state={
			appName:'',
			appId:'',
			packageName:'',
			mediaType:'',
			size:10,
			page:1
		}
	}
	componentWillMount(){
		let {appName,appId,packageName,mediaType,size,page}=this.state;
		mediaTypeStore.getleadApps(appName,appId,packageName,mediaType,size,page)
	}
	query(){
		let {appName,appId,packageName,mediaType,size,page}=this.state;
		mediaTypeStore.getleadApps(appName,appId,packageName,mediaType,size,page)
	}
	onPageChange(page){
		this.setState({
			page:page
		})
		let {appName,appId,packageName,mediaType,size}=this.state;
		mediaTypeStore.getleadApps(appName,appId,packageName,mediaType,size,page)
	}
	onShowSizeChange(page,pageSize){
		this.setState({
			page:page,
			size:pageSize
		})
		let {appName,appId,packageName,mediaType}=this.state;
		mediaTypeStore.getleadApps(appName,appId,packageName,mediaType,pageSize,page)
	}
	setPerModal(id,type){
		this._mediaModal.openModal(id,type);
	}
	render() {
		let {leadAppsArr,total}=mediaTypeStore;
		return (
			<div>
				<Layout history={this.props.history}/>
				<div className="content">
					<MediaModal ref={(e) => this._mediaModal = e} call={()=>this.query()}/>
					<NavHeader/>
					<div className="contentBulk">
						<div style={{height:50,padding:10}}>
							<SearchInput call={(e)=>this.setState({appName:e})} label='应用名称'/>
							<SearchInput call={(e)=>this.setState({appId:e})} label='应用id'/>
							<SearchInput call={(e)=>this.setState({packageName:e})} label='包名'/>
						</div>
						<div style={{height:50,padding:10}}>
							<SelectCom call={(e)=>this.setState({mediaType:e})} option={mediaArr} label='媒体类型'/>
						</div>
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
								<div style={{width:headArr[1].w}} className='gezi'>
									{i.id}
								</div>
								<div  style={{width:headArr[2].w}} className='gezi'>
									{i.packageName}
								</div>
								<div  style={{width:headArr[3].w}} className='gezi'>
									{i.appType}
								</div>
								<div  style={{width:headArr[4].w}} className='gezi'>
									<a href="javascript:(0)" onClick={()=>this.setPerModal(i.id,i.appType)}>
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
