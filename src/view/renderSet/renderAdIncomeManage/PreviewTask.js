import React from "react";
import Layout from "../../../layout/Layout";
import {Pagination} from "antd";
import EditModal from './model/EditModal';
import {observer} from "mobx-react";
import previewTaskStore from '../../../mobx/mediaManage/otherMediaManage/preview-task-store'
const headArr=[
	{name:'日期',w:'8.33%'},
	{name:'第三方appid',w:'8.33%'},
	{name:'第三方广告位id',w:'8.33%'},
	{name:'收入',w:'8.33%'},
	{name:'展现数',w:'8.33%'},
	{name:'CPM',w:'8.33%'},
	{name:'点击数',w:'8.33%'},
	{name:'点击率',w:'8.33%'},
	{name:'CPC',w:'8.33%'},
	{name:'状态',w:'8.33%'},
	{name:'失败原因查询',w:'8.33%'},
	{name:'操作',w:'8.33%'},
];
@observer
export default class PreviewTask extends React.Component {
	constructor(){
		super()
		this.state={
			page:1,
			size:10,
			id:localStorage.getItem('taskId')
		}
	}
	componentWillMount(){
		let {id,page,size}=this.state;
		previewTaskStore.getTaskInfoList(id,page,size)
	}
	edit(i){
		this._editModal.openModal(i)
	}
	query(){
		let {id,page,size}=this.state;
		previewTaskStore.getTaskInfoList(id,page,size)
	}
	skipCon(i){
		alert('错误原因：'+i)
	}
	onPageChange(page){
		this.setState({
			page:page
		})
		let {id,size}=this.state;
		previewTaskStore.getTaskInfoList(id,page,size)
	}
	onShowSizeChange(page,size){
		this.setState({
			page:page,
			size:size
		})
		let {id}=this.state;
		previewTaskStore.getTaskInfoList(id,page,size)
	}
	render() {
		let {InfoList,successNum,errorNum,total}=previewTaskStore;
		return (
			<div>
				<Layout history={this.props.history} call={()=>{this.query()}}/>
				<div className="content">
					<EditModal ref={e=>this._editModal=e} call={()=>{this.query()}}/>
					<div className="contentBulk1" style={{marginTop:10,width:'100%'}}>
						<div className="con-head">
							<div>
								&nbsp;&nbsp;本次共上传{total}条数据，{successNum}条成功 {errorNum}条失败
							</div>
						</div>
						<div className="table-head">
							{headArr.map((i,k)=>{
								return(
									<div key={k} style={{width:i.w,float:'left',textAlign:'center',color:'#808080',lineHeight:'29px',height:'30px'}} title={i.name} className="gezi">
										{i.name}
									</div>
								)
							})}
						</div>
						{InfoList.map((i,k)=>(
							<div className="table-body" key={k}>
								<div className="gezi" style={{width:'8.33%'}}>{/*日期*/}
									{i.eventDate}
								</div>
								<div className="gezi" style={{width:'8.33%'}}>{/*第三方appid*/}
									{i.otherAppId}
								</div>
								<div className="gezi" style={{width:'8.33%'}}>{/*第三方广告位id*/}
									{i.otherSpaceId}
								</div>
								<div className="gezi" style={{width:'8.33%'}}>{/*收入*/}
									{i.income}
								</div>
								<div className="gezi" style={{width:'8.33%'}}>{/*展现数*/}
									{i.pv}
								</div>
								<div className="gezi" style={{width:'8.33%'}}>{/*CPM*/}
									{i.cpm}
								</div>
								<div className="gezi" style={{width:'8.33%'}}>{/*点击数*/}
									{i.cv}
								</div>
								<div className="gezi" style={{width:'8.33%'}}>{/*点击率*/}
									{i.cvRatio}
								</div>
								<div className="gezi" style={{width:'8.33%'}}>{/*CPC*/}
									{i.cpc}
								</div>
								<div className="gezi" style={{width:'8.33%'}}>{/*状态*/}
									{i.uploadState==0?'成功':'失败'}
								</div>
								<div className="gezi" style={{width:'8.33%'}}>{/*失败原因查询*/}
									<span className={i.uploadState==1?"modification":"color-hui"}
										  onClick={()=>i.uploadState==1?this.skipCon(i.failReason):null}>查看</span>
								</div>
								<div className="gezi" style={{width:'8.33%'}}>{/*操作*/}
									<span className="modification"
										  onClick={()=>this.edit(i)}>编辑</span>
								</div>
							</div>
						))}
						<div className='con-head' style={{display:'block'}}>
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
