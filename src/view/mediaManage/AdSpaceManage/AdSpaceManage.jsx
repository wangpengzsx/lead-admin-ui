import React from "react";
import {Switch,Pagination,Checkbox} from 'antd';
import {Link} from "react-router-dom";
import AdSpaceManageStore from "../../../mobx/mediaManage/adSpace/adSpace-manage-store";
import EditAdSpaceStore from "../../../mobx/mediaManage/adSpace/edit-adSpace-store";
import {observer} from "mobx-react";
import Layout from "../../../layout/Layout";
import Client from "../../../common/lead-api";
const headArr=[{name:'广告位名称',w:'9.5%'},
	{name:'广告位状态',w:'9.5%'},
	{name:'所属应用',w:'9.5%'},
	{name:'广告位类型',w:'9.5%'},
	{name:'广告位底价/CPM',w:'9.5%'},
	{name:'广告位ID',w:'9.5%'},
	{name:'广告位尺寸',w:'9.5%'},
	{name:'点击效果',w:'9.5%'},
	{name:'最后更新时间',w:'9.5%'},
	{name:'操作',w:'9.5%'}];
@observer
export default class AdSpaceManage extends React.Component {
	constructor(props){
		super(props)
		this.state={
			size:10,
			page:1,
			chooseIdArr:[],
			searchText:''
		};
	}
	componentWillMount(){
		AdSpaceManageStore.searchLeadAdSpaces(localStorage.getItem('appId'),this.state.searchText,this.state.page,this.state.size)
	}
	componentWillUnmount(){
		localStorage.removeItem('appId');
	}
	//回调函数 获取列表
	callback(){
		AdSpaceManageStore.searchLeadAdSpaces(localStorage.getItem('appId'),this.state.searchText,this.state.page,this.state.size)
	}
	clickSearch(){
		AdSpaceManageStore.searchLeadAdSpaces(localStorage.getItem('appId'),this.state.searchText,this.state.page,this.state.size)
	}
	// 开启关闭广告位
	onSwitchChange(state,id){
		let a=state=="OPEN"?1:0;
		EditAdSpaceStore.editAdSpace(id,{spaceState:a},this.callback.bind(this));
	}
	//批量删除广告位
	removeItem(){
		AdSpaceManageStore.deleteMany(this.state.chooseIdArr,this.callback.bind(this),this.callback.bind(this));
	}
	//批量开启或关闭广告位
	updateStateByIds(spaceState){
		AdSpaceManageStore.updateStateByIds(this.state.chooseIdArr,spaceState,this.callback.bind(this));
	}
	//列表前CheckBox   change事件
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
	onAllChange(e){
		let {adSpaceArr}=AdSpaceManageStore;
		let arr=[];
		adSpaceArr.map(i=>arr.push(i.id));
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
		})
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
		AdSpaceManageStore.searchLeadAdSpaces(localStorage.getItem('appId'),this.state.searchText,i,this.state.size)
	}
	onShowSizeChange(current, pageSize) {
		this.setState({
			size:pageSize,
			page:current
		})
		AdSpaceManageStore.searchLeadAdSpaces(localStorage.getItem('appId'),this.state.searchText,current,pageSize)
	}
	setAdSpaceId(id){
		localStorage.setItem('editAdSpace',id);
	}
	render() {
		let {adSpaceArr,total}=AdSpaceManageStore;
		return (
			<div>
				<Layout history={this.props.history} />
				<div className="content">
					<div className="contentBulk1">
						<div className="con-head">
							<div>
								<Link to={{pathname: '/newAdSpace',}}>
									<button className="borderBtn">
										创建广告位
									</button>
								</Link>
								<button className="borderBtn" onClick={()=>this.updateStateByIds(2)}>删除</button>
								<button className="borderBtn" onClick={()=>this.updateStateByIds(0)}>开启</button>
								<button className="borderBtn" onClick={()=>this.updateStateByIds(1)}>关闭</button>
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
								<Checkbox onChange={this.onAllChange.bind(this)} checked={this.isCheckd(adSpaceArr)}/>
							</div>
							{
								headArr.map((i,k)=>(
									<div key={k} style={{width:i.w,lineHeight:'30px',height:30}} className="gezi">
										{i.name}
									</div>
								))
							}

						</div>
						{adSpaceArr.map((i,k)=>(
							<div className="table-body" key={k} style={{background:k%2==0?'#fafafa':'#fff'}}>
								<div  style={{width:'5%'}} className='gezi'>
									<Checkbox onChange={this.onChange.bind(this,i.id)} checked={this.state.chooseIdArr.indexOf(i.id)>-1}/>
								</div>
								<div  style={{width:headArr[0].w}} className='gezi'>
									<Link to={{pathname: '/formManage',
										adSpaceId:i.id,
										adSpaceType:i.adType}}>
										{i.adSpaceName}
									</Link>
								</div>
								<div  style={{width:headArr[0].w}} className='gezi'>
									<Switch  checked={i.spaceState=="OPEN"} checkedChildren="开" unCheckedChildren="关"
											 onChange={()=>this.onSwitchChange(i.spaceState,i.id)}
									/>
								</div>
								<div  style={{width:headArr[0].w}} title={i.appName} className='gezi'>
									{i.appName}
								</div>
								<div  style={{width:headArr[0].w}} title={Client.adTypeEffect(i.adType)} className='gezi'>
									{Client.adTypeEffect(i.adType)}
								</div>
								<div  style={{width:headArr[0].w}} title={i.floorPrice} className='gezi'>
									{i.floorPrice}
								</div>
								<div  style={{width:headArr[0].w}} title={i.id} className='gezi'>
									{i.id}
									<button id={i.id}  data-clipboard-text={i.id} className="geziChild">
										复制
									</button>
								</div>
								<div  style={{width:headArr[0].w}} title={i.width+'×'+i.height} className='gezi'>
									{i.width}×{i.height}
								</div>
								<div  style={{width:headArr[0].w}} title={Client.effect(i.clickEffect)} className='gezi'>
									{Client.effect(i.clickEffect)}
								</div>
								<div  style={{width:headArr[0].w}} title={Client.formatDateTime(i.modifyTime)} className='gezi'>
									{Client.formatDateTime(i.modifyTime)}
								</div>
								<div  style={{width:headArr[0].w}} className='gezi'>
									<Link to={{
										pathname: '/editAdSpace',
										id: i.id,
										adSpaceName:i.adSpaceName,
										spaceState:i.spaceState,
										floorPrice:i.floorPrice,
										adType:i.adType,
										spaceSizeId:i.formSizeId,
										appId:i.appId,
										avePv:i.avePv,
										clickEffect:i.clickEffect,
										isDeepLink:i.isDeepLink,
										isPvMonitor:i.isPvMonitor,
										maxPvMonitor:i.maxPvMonitor,
										isCvMonitor:i.isCvMonitor,
										previewImgUrl:i.previewImgUrl
									}} onClick={()=>this.setAdSpaceId(i.id)}>编辑</Link>
								</div>
							</div>
						))}
						<div className='con-foot'>
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
