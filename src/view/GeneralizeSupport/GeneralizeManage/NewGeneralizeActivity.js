import React from "react";
import Layout from "../../../layout/Layout";
import {Input, Radio, DatePicker, Select} from "antd";
import moment from 'moment';
import locale from 'antd/lib/date-picker/locale/zh_CN';
import {observer} from "mobx-react";
import 'moment/locale/zh-cn';
import GeneralizeManageStore from "../../../mobx/generalizeSupport/generalize-manage-store";
import Client from "../../../common/lead-api";
import ModificationMadal  from "./Modal/modificationMadal";
import '../../../styles/chosen.css';
import jq from "jquery";
import AddOriginalityModal from "./Modal/addOriginalityModal";
import HintAlert from "../../common/HintAlert";
const RadioGroup = Radio.Group;
const { RangePicker } = DatePicker;
const Option = Select.Option;
const headArr=[{name:'广告位名称',w:'6.25%'},
	{name:'设置切量比例',w:'6.25%'},
	{name:'关联创意',w:'6.25%'},
	{name:'创意关联状态',w:'6.25%'},
	{name:'所属应用',w:'6.25%'},
	{name:'应用类型',w:'6.25%'},
	{name:'广告位类型',w:'6.25%'},
	{name:'广告展现形式',w:'6.25%'},
	{name:'广告位尺寸',w:'6.25%'},
	{name:'素材规格',w:'6.25%'},
	{name:'广告位底价',w:'6.25%'},
	{name:'广告位日均pv',w:'6.25%'},
	{name:'点击效果',w:'6.25%'},
	{name:'是否支持deeplink',w:'6.25%'},
	{name:'是否支持曝光/点击监测',w:'6.25%'},
	{name:'预览图片',w:'6.25%'},
];
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
@observer
export default class NewGeneralizeActivity extends React.Component {
	constructor(){
		super()
		this.state={
			name:'',
			type:'GAME',
			maxShow:0,
			maxClick:0,
			size:'default',
			planStart: moment().startOf("day"),
			planEnd: moment().endOf("day"),
			endOpen: false,
			chooseMoment:null,
			excludeDates:[],
			visible:false,
			appId:'',
			typeId:'',
			formId:'',
			sizeId:'',
			adSpaceId:'',
			divOffsetTop:490,
			scrollTop:0,
			scrollLeft:0,
			nameError:false,
			selectShow:false,
			isConfirm:false
		}
	}
	componentWillMount(){
		GeneralizeManageStore.getOursSpace();
		GeneralizeManageStore.getAppArr();
		GeneralizeManageStore.getAdFormsArr();
		GeneralizeManageStore.getAdSpaceSizes();
		GeneralizeManageStore.getSpaceFormListInfo({ appId:'',
			adType:'',
			adFormId :'',
			spaceSizeId:'',
			adSpaceId :'', });
		GeneralizeManageStore.spaceCreatives=[];
		if(localStorage.getItem('newGeneralizeActivity')){
			let that=this;
			Client.getleadArr('popu/findAllById',{id:localStorage.getItem('newGeneralizeActivity')}).then(res=>{
				let arr=[];
				res.excludeDates.map((i)=>{
					arr.push(Client.formatDate(i))
				})
				that.setState({
					name:res.name,
					type:res.type,
					planStart:moment(res.planStart),
					planEnd:moment(res.planEnd),
					excludeDates:arr,
					maxShow:res.maxShow,
					maxClick:res.maxClick
				})
				let arr1=[];
				let bigArr=res.spaceCreatives;
				for(let i=0; i<bigArr.length; i++){
					let data={}
					if(bigArr[i].appGroup!=null){
						 data={
							appGroupId:bigArr[i].appGroup?bigArr[i].appGroup.id:'',
							id:bigArr[i].id,
							adFormId:bigArr[i].adForm.id,
							popuRatio:bigArr[i].popuRatio,
							creativeId:typeof bigArr[i].creative=="object"?bigArr[i].creative.id:bigArr[i].creative
						}
					}else{
						 data={
							id:bigArr[i].id,
							adSpaceId:bigArr[i].adSpace?bigArr[i].adSpace.id:'',
							adFormId:bigArr[i].adForm.id,
							popuRatio:bigArr[i].popuRatio,
							creativeId:typeof bigArr[i].creative=="object"?bigArr[i].creative.id:bigArr[i].creative
						}
					}
					arr1.push(data);
				}
				GeneralizeManageStore.spaceCreatives=arr1
			})
		}
	}
	componentDidMount() {
		Client.getleadArr('leadAdSpaces/search/getOursSpace',{adSpaceName:''}).then(res=>{
			let str='<Option  value="" disabled selected style="display:none;">请选择广告位</Option>';
			 str+='<Option  value="" >全部</Option>';
			res._embedded.leadAdSpaces.map(d => str+= '<Option  value='+d.id+'>'+d.adSpaceName+'</Option>')
			$(this.el).html(str);
			$(this.el).chosen({placeholder_text_single:'请选择广告位'});
			$(this.el).chosen().change((e)=>{this.adSpaceChange(e.target.value)})
		})
	}
	componentWillUnmount(){
		localStorage.removeItem('newGeneralizeActivity');
	}
	onPanelChange(a){
		this.setState({
			chooseMoment:a.format('YYYY-MM-DD')
		})
	}
	remove(i){
		let arr=this.state.excludeDates;
		var index = arr.indexOf(i);
		if (index > -1) {
			arr.splice(index, 1);
		}
		this.setState({
			excludeDates:arr
		})
	}
	onOk(){
		let arr=this.state.excludeDates;
		if(arr.indexOf(this.state.chooseMoment)>-1){
			Client.showTank(false,'选择日期重复')
		}else{
			arr.push(this.state.chooseMoment);
		}
		this.setState({
			excludeDates:arr,
			divOffsetTop:jq(this.refs.aaa).offsetTop
		})
	}
	disabledDate(current){
		if(this.state.planStart&&this.state.planEnd){
			return current && current < this.state.planStart.startOf('day')||current > this.state.planEnd.endOf('day')
		}else{
			return false;
		}
	}
	onChange(e) {
		this.setState({
			type:e.target.value
		})
	}
	confirm(){
		this.setState({isConfirm:true})
		this.isName(this.state.name)
		if(this.state.name!=''){
			let arr=[];
			this.state.excludeDates.map(i=>arr.push(i))
			let {spaceCreatives}=GeneralizeManageStore
			if(this.state.planStart!=''&&this.state.planEnd!=''){
				let aaa=false;
				for(let i=0; i<spaceCreatives.length;i++){
					if(spaceCreatives[i].popuRatio==''||spaceCreatives[i].creativeId==''){
						aaa=true;
						break;
					}
				}
				if(aaa){
					Client.showTank(false,'切量比例和关联创意必须同时设置')
				}else if(parseInt(this.state.maxClick)>parseInt(this.state.maxShow)){
					Client.showTank(false,'每日点击不能大于每日曝光')
				}else{
					let data={};
					if(localStorage.getItem('newGeneralizeActivity')){
						data={
							name:this.state.name,
							type:this.state.type,
							maxShow:this.state.maxShow,
							maxClick:this.state.maxClick,
							planStart: this.state.planStart.format('YYYY-MM-DD'),
							planEnd: this.state.planEnd.format('YYYY-MM-DD'),
							excludeDates:arr,
							spaceCreatives:[...spaceCreatives],
							id:localStorage.getItem('newGeneralizeActivity')
						}
					}else{
						data={
							name:this.state.name,
							type:this.state.type,
							maxShow:this.state.maxShow,
							maxClick:this.state.maxClick,
							planStart: this.state.planStart.format('YYYY-MM-DD'),
							planEnd: this.state.planEnd.format('YYYY-MM-DD'),
							excludeDates:arr,
							spaceCreatives:[...spaceCreatives]
						}
					}
					GeneralizeManageStore.createPopularizePlans(data,this.callback.bind(this),this.errCallback.bind(this))
				}
			}else{
				Client.showTank(false,'请选择周期')
			}
		}else{
			Client.showTank(false,'推广名称不能为空')
		}
	}
	errCallback(err){
		Client.showTank(false,err.responseJSON.message)
	}
	callback(){
		this.props.history.push({pathname:'/generalizeManage'})
	}
	getSpace(){
		let data={};
		if(this.state.appId.indexOf('@')>-1){
			let str=this.state.appId.substr(1);
			data={ appId:str,
				adType:this.state.typeId,
				adFormId :this.state.formId,
				spaceSizeId:this.state.sizeId,
				adSpaceId :this.state.adSpaceId, }
		}else{
			let str=this.state.appId.substr(1);
			data={ appGroupId:str,
				adType:this.state.typeId,
				adFormId :this.state.formId,
				spaceSizeId:this.state.sizeId,
				adSpaceId :this.state.adSpaceId, }
		}
		GeneralizeManageStore.getSpaceFormListInfo(data);
	}
	onAppChange(e){
		this.setState({
			appId:e
		})
		setTimeout(()=>{
			this.getSpace();
		},300)
	}
	onTypeChange(e){
		this.setState({typeId:e})
		setTimeout(()=>{
			this.getSpace();
		},300)
	}
	onFormChange(e){
		this.setState({formId:e})
		setTimeout(()=>{
			this.getSpace();
		},300)
	}
	onSizeChange(e){
		this.setState({sizeId:e})
		setTimeout(()=>{
			this.getSpace();
		},300)
	}
	adSpaceChange(e){
		this.setState({adSpaceId:e});
		setTimeout(()=>{
			this.getSpace();
		},300)
	}
	typeClassify(type){
		if(type=='null'){
			return ''
		}else{
			if(type=='BANNER'){
				return 'banner广告'
			}else if(type=='POPUP'){
				return '插屏广告'
			}else if(type=='OPENSCREEN'){
				return '开屏广告'
			}else if(type=='NATIVE'){
				return '原生广告'
			}else if(type=='VIDEO'){
				return '视频广告'
			}
		}
	}
	openMadal(fromId,spaceId,isApp,value){
		this._modificationMadal.openModal(fromId,spaceId,isApp,value)
	}
	addOriginalty(fromId,sizeId,clicks,spaceId,isApp){
		this._addOriginalityModal.openModal(fromId,sizeId,clicks,spaceId,isApp)
	}
	pipeiguanlian(spaceId,formId){
		let {spaceCreatives}=GeneralizeManageStore;
		let aaa=false;
		for(let i=0; i<spaceCreatives.length; i++){
			if(spaceCreatives[i].adSpaceId){
				if(spaceCreatives[i].adSpaceId==spaceId&&spaceCreatives[i].creativeId!=''&&spaceCreatives[i].adFormId==formId){
					aaa=true;
					break;
				}
			}
		}
		return aaa;
	}
	pipeiguanlian2(groupId,formId){
		let {spaceCreatives}=GeneralizeManageStore;
		let aaa=false;
		for(let i=0; i<spaceCreatives.length; i++){
			if(spaceCreatives[i].appGroupId){
				if(spaceCreatives[i].appGroupId==groupId&&spaceCreatives[i].creativeId!=''&&spaceCreatives[i].adFormId==formId){
					aaa=true;
					break;
				}
			}
		}
		return aaa;
	}
	jiaoyan(spaceId,formId){
		let {spaceCreatives}=GeneralizeManageStore;
		let aaa=false;
		for(let i=0; i<spaceCreatives.length; i++){
			if(spaceCreatives[i].adSpaceId){
				if(spaceCreatives[i].adSpaceId==spaceId&&spaceCreatives[i].popuRatio!=''&&spaceCreatives[i].adFormId==formId){
					aaa=true;
					break;
				}
			}
		}
		return aaa;
	}
	jiaoyan2(groupId,formId){
		let {spaceCreatives}=GeneralizeManageStore;
		let aaa=false;
		for(let i=0; i<spaceCreatives.length; i++){
			if(spaceCreatives[i].appGroupId){
				if(spaceCreatives[i].appGroupId==groupId&&spaceCreatives[i].popuRatio!=''&&spaceCreatives[i].adFormId==formId){
					aaa=true;
					break;
				}
			}
		}
		return aaa;
	}
	jiaoyanbi(spaceId,formId){
		let {spaceCreatives}=GeneralizeManageStore;
		let aaa='';
		for(let i=0; i<spaceCreatives.length; i++){
			if(spaceCreatives[i].adSpaceId){
				if(spaceCreatives[i].adSpaceId==spaceId&&spaceCreatives[i].popuRatio!=''&&spaceCreatives[i].adFormId==formId){
					aaa=spaceCreatives[i].popuRatio;
					break;
				}
			}
		}
		return aaa;
	}
	jiaoyanbi2(groupId,formId){
		let {spaceCreatives}=GeneralizeManageStore;
		let aaa='';
		for(let i=0; i<spaceCreatives.length; i++){
			if(spaceCreatives[i].appGroupId){
				if(spaceCreatives[i].appGroupId==groupId&&spaceCreatives[i].popuRatio!=''&&spaceCreatives[i].adFormId==formId){
					aaa=spaceCreatives[i].popuRatio;
					break;
				}
			}
		}
		return aaa;
	}
	isName(value){
		value==''? this.setState({nameError:true}) : this.setState({nameError:false})
	}
	nameChange(e){
		if(this.state.isConfirm)this.isName(e.target.value);
		this.setState({name:e.target.value})
	}
	onRangeChange(e){
		this.setState({
			planStart:e[0],
			planEnd:e[1]
		})
	}
	render() {
		let {appArr,AdForms,adSizes,SpaceFormListInfo,oursSpace}=GeneralizeManageStore;
		return (
			<div >
				<Layout history={this.props.history}/>
				<ModificationMadal ref={(e) => this._modificationMadal = e}/>
				<AddOriginalityModal ref={(e)=> this._addOriginalityModal = e}/>
				<div className="content">
					<div className="list-haed">
						<span className="dah1">
							基础信息
						</span>
						<span className="xiaoh1">
							请填写基础信息，带 <i className="red">*</i> 的为必填项
						</span>
					</div>
					<div className="contentBulk">
						<div className="accountListRow">
							<div className="form-left">
								<i className="red">*</i>&nbsp;推广名称:
							</div>
							<div className="form-right">
								<input type="text"
									   className={this.state.nameError?'borderError':'border1'}
									   style={{width:360,height:30}}
									   onChange={e=>this.nameChange(e)}
									   value={this.state.name}/>
								{this.state.nameError?(
									<HintAlert left={360} width={170} message="推广名称不能为空"/>
								):null}
							</div>
						</div>
						<div className="accountListRow ">
							<div className="form-left">
								<i className="red">*</i>&nbsp;推广类型:
							</div>
							<div className="form-right">
								<RadioGroup onChange={this.onChange.bind(this)} value={this.state.type}>
									<Radio value="GAME">游戏</Radio>
									<Radio value="SITE">官网</Radio>
								</RadioGroup>
							</div>
						</div>
						<div className="accountListRow">
							<div className="form-left">
								<i className="red">*</i>&nbsp;投放周期:
							</div>
							<div className="form-right">
								<RangePicker
									onChange={(e)=>this.onRangeChange(e)}
									value={[this.state.planStart,this.state.planEnd]}
								/>
							</div>
						</div>
						{this.state.planStart!=null&&this.state.planEnd!=null?(
							<div className="accountListRow">
								<div className="form-left">
								</div>
								<div className="form-right" style={{flexDirection:'row',display: 'flex'}}>
									<DatePicker
										className="qwe"
										showTime
										disabledDate={this.disabledDate.bind(this)}
										onChange={this.onPanelChange.bind(this)}
										value={null}
										placeholder={'选择排除日期'}
										locale={locale}
										onOk={this.onOk.bind(this)}
									/>
								</div>
							</div>
						):null}
						{
							this.state.excludeDates.map((i,k)=>(
								<div className="accountListRow" key={k}>
									<div className="form-left">
									</div>
									<div className="form-right">
										<div className="paichu">
											<span>
												已排除：{i}
											</span>
											<span className="cha" onClick={()=>this.remove(i)}>
												×
											</span>
										</div>
									</div>
								</div>
							))
						}
						<div className="accountListRow">
							<div className="form-left">
								每日曝光上限:
							</div>
							<div className="form-right" style={{position:'relative'}}>
								<Input type="text" className="border1"
									   style={{width:360,height:30}}
									   onChange={e=>this.setState({maxShow:e.target.value})}
									   value={this.state.maxShow}/>
								<i className="color1">
									次 说明：切量比例与每日曝光/点击上限为联合频次控制，即有一个条件达到上限即停止投放
								</i>
							</div>
						</div>
						<div className="accountListRow">
							<div className="form-left">
								每日点击上限:
							</div>
							<div className="form-right">
								<Input type="text" className="border1"
									   style={{width:360,height:30}}
									   onChange={e=>this.setState({maxClick:e.target.value})}
									   value={this.state.maxClick}/>
								<i className="color1">
									次
								</i>
							</div>
						</div>
					</div>
					<div className="list-haed">
						<span className="dah1">
							关联创意
						</span>
					</div>
					<div className="contentBulk" style={{overflow:'visible'}}>
						<div className="con-head">
							<div>
								<Select defaultValue="请选择应用" style={{ width: 150 ,marginRight:10}}
										onChange={(e)=>{this.onAppChange(e)}}>
									<Option value="">全部</Option>
									{appArr.map((i,k)=>(
										<Option value={i.APP_ID?'@'+i.APP_ID:'$'+i.APP_GROUP_ID} key={k}>{i.NAME}</Option>
									))}
								</Select>
								<Select defaultValue="请选择广告类型" style={{ width: 150 ,marginRight:10}}
										onChange={(e)=>this.onTypeChange(e)}>
									<Option value="">全部</Option>
									{typeArr.map((i,k)=>(
										<Option value={i.value} key={k}>{i.name}</Option>
									))}
								</Select>
								<Select defaultValue="请选择广告形式" style={{ width: 150 ,marginRight:10}}
										onChange={(e)=>this.onFormChange(e)}>
									<Option value="">全部</Option>
									{AdForms.map((i,k)=>(
										<Option value={i.id} key={k}>{i.adFormName}</Option>
									))}
								</Select>
								<Select defaultValue="请选择广告位尺寸" style={{ width: 150 ,marginRight:10}}
										onChange={(e)=>this.onSizeChange(e)}>
									<Option value="">全部</Option>
									{adSizes.map((i,k)=>(
										<Option value={i.width+'*'+i.height} key={k}>{i.width}×{i.height}</Option>
									))}
								</Select>
								<select className="Chosen-select"
										placeholder="jjjj"
										ref={el => this.el = el}>
									{oursSpace.map(d => <option key={d.id} value={d.id}>{d.adSpaceName}</option>)}
								</select>
							</div>
						</div>
						<div style={{overflowX:'scroll'}}  ref="bbb">
							<div className="table-head2" ref="aaa"
								 style={{position:this.state.scrollTop>this.state.divOffsetTop?'fixed':'relative',top:0,
								 left:this.state.scrollTop>this.state.divOffsetTop?-this.state.scrollLeft:0,
								 paddingLeft:this.state.scrollTop>this.state.divOffsetTop?20:0,
								 paddingRight:this.state.scrollTop>this.state.divOffsetTop?40:0}}>
								{
									headArr.map((i,k)=>(
										<div key={k} style={{width:i.w,float:'left',textAlign:'center',fontSize:12}}>
											{i.name}
										</div>
									))
								}
							</div>
							{SpaceFormListInfo.map((i,k)=>{
								if(i.APP_GROUP_ID){
									return(
										<div className="table-body1" key={k} style={{height:i.allfrom.length*40,background:k%2==0?'#fff':'#fafafa'}}>
											<div className="gezif juzhong" style={{width:headArr[0].w,height:i.allfrom.length*40}}>
												无
											</div>
											<div className="gezif" style={{width:headArr[1].w,height:i.allfrom.length*40}}>
												{
													i.allfrom.map((a,b)=>{
														{
															if(this.jiaoyan2(i.APP_GROUP_ID,a.AD_FORM_ID)){
																return(
															<div className="xiaogezi" key={b} style={{width:'100%'}}>
																{this.jiaoyanbi2(i.APP_GROUP_ID,a.AD_FORM_ID)}%&nbsp;&nbsp; <span className="modification" onClick={()=>{this.openMadal(a.AD_FORM_ID,i.APP_GROUP_ID,false,this.jiaoyanbi2(i.APP_GROUP_ID,a.AD_FORM_ID))}}>修改</span>
															</div>
														)
															}else{
																return(
															<div className="xiaogezi" key={b} style={{width:'100%'}}>
																<span className="modification" onClick={()=>{this.openMadal(a.AD_FORM_ID,i.APP_GROUP_ID,false,'')}}>点击设置</span>
															</div>
														)}
														}
													})
												}
											</div>
											<div className="gezif" style={{width:headArr[2].w,height:i.allfrom.length*40}}>
												{
													i.allfrom.map((a,b)=>(
														<div key={b} className="xiaogezi" style={{width:'100%'}}>
															<button className="borderBtn" style={{minWidth:60}}
																	onClick={()=>{this.addOriginalty(a.AD_FORM_ID,'','',i.APP_GROUP_ID,false)}}>+创意</button>
														</div>
													))
												}
											</div>
											<div className="gezif" style={{width:headArr[3].w,height:i.allfrom.length*40}}>
												{
													i.allfrom.map((a,b)=>(
														<div key={b} className="xiaogezi" style={{width:'100%'}}>
															{this.pipeiguanlian2(i.APP_GROUP_ID,a.AD_FORM_ID)?(
																<span style={{color:'#000'}}>
																	'已关联'
																</span>
															):'未关联'}
														</div>
													))
												}
											</div>
											<div className="gezif juzhong" style={{width:headArr[4].w,height:i.allfrom.length*40}}>
												{i.APP_GROUP_NAME}
											</div>
											<div className="gezif juzhong" style={{width:headArr[5].w,height:i.allfrom.length*40}}>
											</div>
											<div className="gezif " style={{width:headArr[6].w,height:i.allfrom.length*40}}>
												{
													i.allfrom.map((a,b)=>(
														<div key={b} className="xiaogezi" style={{width:'100%'}}>
															{Client.adTypeEffect(a.AD_TYPE)}
														</div>
													))
												}
											</div>
											<div className="gezif" style={{width:headArr[7].w,height:i.allfrom.length*40}}>
												{
													i.allfrom.map((a,b)=>(
														<div key={b} className="xiaogezi" style={{width:'100%'}}>
															{a.AD_FORM_NAME}
														</div>
													))
												}
											</div>
											<div className="gezif juzhong" style={{width:headArr[8].w,height:i.allfrom.length*40}}>
												无
											</div>
											<div className="gezif" style={{width:headArr[9].w,height:i.allfrom.length*40}}>
												{
													i.allfrom.map((a,b)=>(
														<div key={b} className="xiaogezi" style={{width:'100%'}}>
															{a.CREATIVE_FORMAT}
														</div>
													))
												}
											</div>
											<div className="gezif" style={{width:headArr[10].w,height:i.allfrom.length*40}}>
												{
													i.allfrom.map((a,b)=>(
														<div key={b} className="xiaogezi" style={{width:'100%'}}>
															{a.AD_TYPE=='VIDEO'?i.PRICE_VIDEO:null}
															{a.AD_TYPE=='OPENSCREEN'?i.PRICE_OPEN_SCREEN:null}
															{a.AD_TYPE=='NATIVE'?i.PRICE_NATIVE:null}
															{a.AD_TYPE=='POPUP'?i.PRICE_POPUP:null}
															{a.AD_TYPE=='BANNER'?i.PRICE_BANNER:null}
														</div>
													))
												}
											</div>
											<div className="gezif juzhong" style={{width:headArr[11].w,height:i.allfrom.length*40}}>
												无
											</div>
											<div className="gezif juzhong" style={{width:headArr[12].w,height:i.allfrom.length*40}}>
												无
											</div>
											<div className="gezif juzhong" style={{width:headArr[13].w,height:i.allfrom.length*40}}>
												无
											</div>
											<div className="gezif juzhong" style={{width:headArr[14].w,height:i.allfrom.length*40}}>
												无
											</div>
											<div className="gezif juzhong" style={{width:headArr[15].w,height:i.allfrom.length*40}}>
											</div>
										</div>
									)
								}else{
									return(
										<div className="table-body1" key={k} style={{background:k%2==0?'#fff':'#fafafa'}}>
											<div className="gezi" title={i.AD_SPACE_NAME} style={{width:headArr[0].w}}>
												{i.AD_SPACE_NAME}
											</div>
												{this.jiaoyan(i.AD_SPACE_ID,i.AD_FORM_ID)?(
													<div className="gezi" style={{width:headArr[1].w}}>
														{this.jiaoyanbi(i.AD_SPACE_ID,i.AD_FORM_ID)}%&nbsp;&nbsp;
														<span className="modification"
																onClick={()=>{this.openMadal(i.AD_FORM_ID,i.AD_SPACE_ID,true,this.jiaoyanbi(i.AD_SPACE_ID,i.AD_FORM_ID))}}>修改</span>
													</div>
												):(
													<div className="gezi" style={{width:headArr[1].w}}>
														<span className="modification" onClick={()=>{this.openMadal(i.AD_FORM_ID,i.AD_SPACE_ID,true,'')}}>点击设置</span>
													</div>
												)}
											<div className="gezi" style={{width:headArr[2].w}}>
												<button className="borderBtn" style={{minWidth:60}}
												onClick={()=>{this.addOriginalty(i.AD_FORM_ID,i.SPACE_SIZE_ID,i.CLICK_EFFECT,i.AD_SPACE_ID,true)}}>+创意</button>
											</div>
											<div className="gezi" style={{width:headArr[3].w}}>
												{this.pipeiguanlian(i.AD_SPACE_ID,i.AD_FORM_ID)?(
													<span style={{color:'#000'}}>
														'已关联'
													</span>
												):'未关联'}
											</div>
											<div className="gezi" title={i.APP_NAME} style={{width:headArr[4].w}}>
												{i.APP_NAME}
											</div>
											<div className="gezi" title={i.APP_TYPE} style={{width:headArr[5].w}}>
												{i.APP_TYPE}
											</div>
											<div className="gezi" style={{width:headArr[6].w}}>
												{this.typeClassify(i.AD_TYPE)}
											</div>
											<div className="gezi" title={i.AD_FORM_NAME} style={{width:headArr[7].w}}>
												{i.AD_FORM_NAME}
											</div>
											<div className="gezi" title={i.WIDTH+'×'+i.HEIGHT} style={{width:headArr[8].w}}>
												{i.WIDTH}×{i.HEIGHT}
											</div>
											<div className="gezi" title={i.CREATIVE_FORMAT} style={{width:headArr[9].w}}>
												{i.CREATIVE_FORMAT}
											</div>
											<div className="gezi" style={{width:headArr[10].w}}>
												{i.FLOOR_PRICE}
											</div>
											<div className="gezi" style={{width:headArr[11].w}}>
												{i.AVE_PV}
											</div>
											<div className="gezi" title={Client.effect(i.CLICK_EFFECT)} style={{width:headArr[12].w}}>
												{Client.effect(i.CLICK_EFFECT)}
											</div>
											<div className="gezi" style={{width:headArr[13].w}}>
												{i.IS_DEEP_LINK?'是':'否'}
											</div>
											<div className="gezi" style={{width:headArr[14].w}}>
												{i.IS_PV_MONITOR}
											</div>
											<div className="gezi" style={{width:headArr[15].w}}>
												<img src={i.PREVIEW_IMG_URL} alt="" style={{width:100,height:30}}/>
											</div>
										</div>
									)
								}
							})}
						</div>
						<div className="submit-content">
							<button className="cancelBtn" onClick={()=>this.props.history.push({pathname:'/generalizeManage'})}>取消</button>
							<button className="confirmBtn" onClick={()=>this.confirm()}>确定</button>
						</div>
					</div>
				</div>
			</div>
		)
	}
}
