import React from "react";
import Layout from "../../../layout/Layout";
import {Checkbox,Pagination,Radio} from "antd";
const RadioGroup = Radio.Group;
import Client from "../../../common/lead-api";
import adBillingStore from "../../../mobx/mediaManage/otherMediaManage/ad-billing-store";
import {observer} from "mobx-react";
import BillingModal from "./modal/billingModal";
import PiBillingModal from "./modal/piBillingModal";
import SearchInput from './component/SearchInput';
import NavHeader from './component/NavHeader';
import SelectCom from './component/SelectCom';
const typeArr=[
	{
		name:'banner广告',
		value:'BANNER',
	},
	{
		name:'插屏广告',
		value:'POPUP',
	},
	{
		name:'开屏广告',
		value:'OPENSCREEN',
	},
	{
		name:'原生广告',
		value:'NATIVE',
	},
	{
		name:'视频广告',
		value:'VIDEO',
	}
]
const headArr=[
	{name:'开发者名称',w:'10%'},
	{name:'开发者主体',w:'10%'},
	{name:'应用名称',w:'10%'},
	{name:'appid',w:'10%'},
	{name:'包名',w:'10%'},
	{name:'应用创建时间',w:'10%'},
	{name:'广告位类型',w:'10%'},
	{name:'第三方媒体计费设置',w:'25%'}
]
@observer
export default class AdBillingSet extends React.Component {
	constructor(){
		super()
		this.state={
			size:10,
			page:1,
			id1:'',
			id2:'',
			appName:'',
			appId:'',
			adType:'',
			chooseIdArr:[]
		}
	}
	componentWillMount(){
		let {id1,id2,appName,appId,adType,page,size}=this.state;
		adBillingStore.getDeveloperApps(id1,id2,appName,appId,adType,page,size)
	}
	query(){
		this.onPageChange(1)
	}
	query1(){
		let {id1,id2,appName,appId,adType,page,size}=this.state;
		adBillingStore.getDeveloperApps(id1,id2,appName,appId,adType,page,size)
	}
	componentDidMount(){
		Client.getNullArgument('media/getDeveloperList').then(res=>{
			let str='<Option  value="" disabled selected style="display:none;">请选择开发者名称</Option>';
			str+='<Option  value="" >全部</Option>';
			res.map(d => str+= '<Option  value='+d.id+'>'+d.developer_name+'</Option>')
			$(this.el).html(str);
			$(this.el).chosen({placeholder_text_single:'请选择开发者名称'});
			$(this.el).chosen().change((e)=>{this.adDevNameChange(e.target.value)})
			let str1='<Option  value="" disabled selected style="display:none;">请选择开发者主体</Option>';
			str1+='<Option  value="" >全部</Option>';
			let arr=[];
			res.map(d =>arr.push(d.developer_body));
			arr=Client.unique(arr);
			arr.map(d => str1+= '<Option  value='+d+'>'+d+'</Option>')
			$(this.ell).html(str1);
			$(this.ell).chosen({placeholder_text_single:'请选择开发者主体'});
			$(this.ell).chosen().change((e)=>{this.adDevBodyChange(e.target.value)})
		})
	}
	onPageChange(i){
		this.setState({
			page:i
		})
		let {id1,id2,appName,appId,adType,size}=this.state;
		adBillingStore.getDeveloperApps(id1,id2,appName,appId,adType,i,size)
	}
	onShowSizeChange(current, pageSize) {
		this.setState({
			page:1,
			size:pageSize
		})
		let {id1,id2,appName,appId,adType}=this.state;
		adBillingStore.getDeveloperApps(id1,id2,appName,appId,adType,1,pageSize)
	}
	adDevNameChange(val){
		this.setState({
			id1:val
		})
	}
	adDevBodyChange(val){
		this.setState({
			id2:val
		})
	}
	onAllChange(e){
		let {developerArr}=adBillingStore;
		let arr=[];
		developerArr.map(i=>arr.push(i.app_id+'@'+i.ad_type));
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
	onOneChange(i){
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
			arr.push(CreativesArr[i].app_id+'@'+CreativesArr[i].ad_type)
		}
		return Client.isContained(this.state.chooseIdArr,arr);
	}
	billingSet(appid,adtype,divideType,ratio,cpm){
		if(divideType==null){
			this._billingModal.openModal(appid,adtype,divideType,ratio);
		}else{
			if(divideType==1){
				this._billingModal.openModal(appid,adtype,divideType,ratio);
			}else{
				this._billingModal.openModal(appid,adtype,divideType,cpm);
			}
		}
	}
	onOpenChange(e,appid,adtype){
		adBillingStore.modificationBilling(appid,adtype,e.target.value,0,0,this.callback.bind(this));
	}
	callback(){
		this.query1();
	}
	radioText(radio){
		if(radio==null){
			return null
		}else{
			return radio==0?null:radio+'%'
		}
	}
	cpmText(radio){
		if(radio==null){
			return null
		}else{
			return radio==0?null:radio+'元'
		}
	}
	piliang(){
		if(this.state.chooseIdArr.length>=1){
			this._piBillingModal.openModal(this.state.chooseIdArr);
		}else{
			Client.showTank(false,'请先选择媒体')
		}
	}
	render() {
		let {developerArr,total}=adBillingStore;
		return (
			<div>
				<Layout history={this.props.history}/>
				<div className="content">
					<BillingModal ref={(e) => this._billingModal = e} call={()=>this.callback()}/>
					<PiBillingModal ref={(e) => this._piBillingModal = e} call={()=>this.callback()}/>
					<NavHeader/>
					<div className="contentBulk" style={{overflow: 'visible'}}>
						<div style={{height:50,padding:10}}>
							<div className="listROwlet2" style={{ lineHeight: '30px' }}>
								<div className="form-left" style={{ width: '30%' }}>
									开发者名称：
								</div>
								<div className="form-right-multiple" style={{ width: '50%' }}>
									<select className="Chosen-select"
											placeholder="jjjj"
											ref={el => this.el = el}>
									</select>
								</div>
							</div>
							<div className="listROwlet2" style={{ lineHeight: '30px' }}>
								<div className="form-left" style={{ width: '30%' }}>
									开发者主体：
								</div>
								<div className="form-right-multiple" style={{ width: '50%' }}>
									<select className="Chosen-select"
											placeholder="jjjj"
											ref={el => this.ell = el}>
									</select>
								</div>
							</div>
							<SearchInput call={(e)=>this.setState({appName:e})} label='应用名称'/>
						</div>
						<div style={{height:50,padding:10}}>
							<SearchInput call={(e)=>this.setState({appId:e})} label='应用id'/>
							<SelectCom call={(e)=>this.setState({adType:e})} label='广告位类型' option={typeArr}/>
						</div>
					</div>
					<div style={{ paddingBottom: 10 }}>
						<button className="filtrateBtn" onClick={() => { this.query() }}>
							查询
						</button>
					</div>
					<div className="contentBulk1">
						<div className="con-head">
							<div>
								<button className="borderBtn" onClick={()=>this.piliang()}>批量设置</button>
							</div>
							<div className="searchInput">
							</div>
						</div>
						<div className="table-head">
							<div style={{width:'5%',float:'left',textAlign:'center'}}>
								<Checkbox onChange={(e)=>this.onAllChange(e)} checked={this.isCheckd(developerArr)}/>
							</div>
							{
								headArr.map((i,k)=>(
									<div key={k} style={{width:i.w,float:'left',textAlign:'center'}}>
										{i.name}
									</div>
								))
							}
						</div>
						{developerArr.map((i,k)=>(
							<div className="table-body" key={k} style={{background:k%2==0?'#fff':'#fafafa'}}>
								<div  style={{width:'5%'}} className='gezi'>
									<Checkbox onChange={()=>this.onOneChange(i.app_id+'@'+i.ad_type)} checked={this.state.chooseIdArr.indexOf(i.app_id+'@'+i.ad_type)>-1}/>
								</div>
								<div  style={{width:headArr[0].w}} className='gezi'>
									{i.developer_name}
								</div>
								<div style={{width:headArr[1].w}} className='gezi'>
									{i.developer_body}
								</div>
								<div  style={{width:headArr[2].w}} className='gezi'>
									{i.app_name}
								</div>
								<div  style={{width:headArr[3].w}} className='gezi'>
									{i.app_id}
								</div>
								<div  style={{width:headArr[4].w}} className='gezi'>
									{i.package_name}
								</div>
								<div  style={{width:headArr[5].w}} className='gezi'>
									{i.create_time}
								</div>
								<div  style={{width:headArr[6].w}} className='gezi'>
									{i.ad_type}
								</div>
								<div  style={{width:headArr[7].w}} className='gezi'>
									<RadioGroup onChange={(e)=>this.onOpenChange(e,i.app_id,i.ad_type)} value={i.divide_type==null?1:i.divide_type} >
										<Radio value={1}>分成比例</Radio>
										<Radio value={2}>CPM</Radio>
									</RadioGroup>
									<span style={{marginRight:10}}>{i.divide_type==null?this.radioText(i.ratio):(i.divide_type==1?this.radioText(i.ratio):this.cpmText(i.cpm))}</span>
									<a href="javascript:(0)" onClick={()=>this.billingSet(i.app_id,i.ad_type,i.divide_type,i.ratio,i.cpm)}>设置</a>
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
