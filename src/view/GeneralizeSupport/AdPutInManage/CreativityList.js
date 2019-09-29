import React from "react";
import Layout from "../../../layout/Layout";
import {Checkbox,Pagination,Switch} from "antd";
import adCreativityStore from "../../../mobx/generalizeSupport/AdPutInManage/ad-creativity-store";
import {observer} from "mobx-react"
import Client from "../../../common/lead-api";
import Clipboard from "clipboard";
const headArr=[
	{name:'创意',w:'7.9%'},
	{name:'创意名称',w:'7.9%'},
	{name:'创意状态',w:'7.9%'},
	{name:'创意id',w:'7.9%'},
	{name:'花费',w:'7.9%'},
	{name:'创意尺寸',w:'7.9%'},
	{name:'素材规格',w:'7.9%'},
	{name:'Deeplink地址',w:'7.9%'},
	{name:'落地页地址',w:'7.9%'},
	{name:'曝光监测',w:'7.9%'},
	{name:'点击监测',w:'7.9%'},
	{name:'上传时间',w:'7.9%'},
]
@observer
export default class CreativityList extends React.Component {
	constructor(){
		super()
		this.state={
			page:1,
			size:10,
			name:'',
			ids:[],
			mouseId:''
		}
	}
	componentWillMount(){
		let {size,page,name}=this.state;
		adCreativityStore.getCreativityArr(size,page,name,localStorage.getItem('findActivityId'))
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
		this.callback()
	}
	openItem(){
		this.updateCreativesState(0);
	}
	closeItem(){
		this.updateCreativesState(1);
	}
	removeItem(){
		this.updateCreativesState(-1);
		this.setState({ids:[]})
	}
	onSwitchChange(state,id){
		adCreativityStore.updateCreativesState(state,[id],this.callback.bind(this))
	}
	updateCreativesState(state){
		adCreativityStore.updateCreativesState(state,this.state.ids,this.callback.bind(this))
	}
	callback(){
		let {size,page,name}=this.state;
		adCreativityStore.getCreativityArr(size,page,name,localStorage.getItem('findActivityId'))
	}
	onAllChange(e){
		let {creativityArr}=adCreativityStore;
		let arr = [];
		if (e.target.checked) {
			creativityArr.map(i => arr.push(i.id))
		}
		this.setState({ids: arr})
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
	newCreativity(){
		this.props.history.push({pathname:'/newCreativity'});
	}
	render() {
		let {creativityArr,total1}=adCreativityStore;
		return (
			<div>
				<Layout history={this.props.history}/>
				<div className="content">
					<div className="contentBulk1">
						<div className="con-head">
							<div>
								<button className="borderBtn" onClick={()=>this.newCreativity()}>上传创意</button>
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
						<div style={{ width: '100%', overflowX: 'scroll' }}>
							<div className="table-head" style={{width:'120%'}}>
								<div  style={{width:'5%',float:'left',textAlign:'center'}}>
									<Checkbox onChange={this.onAllChange.bind(this)} checked={this.state.ids.length==creativityArr.length}/>
								</div>
								{
									headArr.map((i,k)=>(
										<div key={k} style={{width:i.w,float:'left',textAlign:'center'}}>
											{i.name}
										</div>
									))
								}
							</div>
							{creativityArr.map((i,k)=>(
								<div className="height-table-body" key={k} style={{background:k%2==0?'#fff':'#fafafa',width:'120%'}}>
									<div  style={{width:'5%'}} className='heightGezi'>
										<Checkbox onChange={this.onOneChange.bind(this,i.id)} checked={this.state.ids.indexOf(i.id)>-1}/>
									</div>
									<div  style={{width:headArr[0].w}} className='heightGezi flexCenter'>{/*创意*/}
										{i.leadCreative.adSize.adType=='NATIVE'?(
											<div  className='native heightGezi flexCenter'
												  onClick={()=>{
													  this.props.history.push({
														  pathname:'/NativeCreative',
														  fileds:i.leadCreative
													  })
												  }}
											>
												原生创意预览
											</div>
										):null}
										{i.leadCreative.adSize.adType=='BANNER'||i.leadCreative.adSize.adType=='OPENSCREEN'||i.leadCreative.adSize.adType=='POPUP'&&i.leadCreative.fields?(
											<img src={Client.imgFile+(i.leadCreative.fields[0]?i.leadCreative.fields[0].value:null)}
												 onClick={()=>{
													 window.open(Client.imgFile+(i.leadCreative.fields[0]?i.leadCreative.fields[0].value:null), "_blank");
												 }}
												 alt="" style={{width:100,height:70}}/>
										):null}
										{i.leadCreative.adSize.adType=='VIDEO'&&i.leadCreative.fields?(
											<div  className='native heightGezi'
												  onClick={()=>{
													  window.open(Client.imgFile+(i.leadCreative.fields[0]?i.leadCreative.fields[0].value:null), "_blank");
												  }}
											>
												视频创意预览
											</div>
										):null}
									</div>
									<div  style={{width:headArr[1].w}} className='heightGezi'>{/*创意名称*/}
										{i.creativeName}
									</div>
									<div  style={{width:headArr[2].w}} className='heightGezi'>{/*创意状态*/}
										<Switch checkedChildren="开" unCheckedChildren="关" checked={i.acState==0} onChange={()=>this.onSwitchChange(i.acState==0?1:0,i.id)}/>
									</div>
									<div style={{width:headArr[3].w}} title={i.id} className='heightGezi'>{/*创意id*/}
										{i.id}
										<button id={i.id}  data-clipboard-text={i.id} className="geziChild">
											复制
										</button>
									</div>
									<div  style={{width:headArr[4].w}} className='heightGezi'>{/*花费*/}
									</div>
									<div  style={{width:headArr[5].w}} className='heightGezi'>{/*创意尺寸*/}
										{i.leadCreative.adSize?i.leadCreative.adSize.width+'x'+i.leadCreative.adSize.height:null}
									</div>
									<div  style={{width:headArr[6].w}} className='heightGezi'>{/*素材规格*/}
										{i.leadCreative.adForm?i.leadCreative.adForm.creativeFormat:null}
									</div>
									<div  style={{width:headArr[7].w}} className='heightGezi'>{/*Deeplink地址*/}
										{i.deepLinkUrl}
									</div>
									<div  style={{width:headArr[8].w}} className='heightGezi'>{/*落地页地址*/}
										{i.landUrl}
									</div>
									<div  style={{width:headArr[9].w}} className='heightGezi'>{/*曝光监测*/}
										{i.pvUrl}
									</div>
									<div  style={{width:headArr[10].w}} className='heightGezi'>{/*点击监测*/}
										{i.clickUrl}
									</div>
									<div  style={{width:headArr[11].w}}
										  title={Client.formatDateTime(i.modifyTime)}
										  className='heightGezi'>{/*上传时间*/}
										{Client.formatDateTime(i.modifyTime)}
									</div>
								</div>
							))}
						</div>
						<div className='con-head'>
							<Pagination
								pageSizeOptions={['10','20','50','100']}
								showSizeChanger
								defaultPageSize={this.state.size}
								onChange={this.onPageChange.bind(this)}
								onShowSizeChange={this.onShowSizeChange.bind(this)} defaultCurrent={1} total={total1} />
						</div>
					</div>
				</div>
			</div>
		)
	}
}
