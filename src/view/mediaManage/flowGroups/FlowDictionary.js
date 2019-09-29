import React from "react";
import Layout from "../../../layout/Layout";
import { Select } from "antd";
import Client from "../../../common/lead-api";
import {observer} from "mobx-react";
import FlowDictionaryStore from "../../../mobx/mediaManage/flowGroups/flow-dictionary-store";
import GeneralizeManageStore from "../../../mobx/generalizeSupport/generalize-manage-store";
import ExcellentExport from 'excellentexport';
const Option = Select.Option;
const apptype=['LENOVO','第三方'];
const specification=['JPG','PNG','MP4'];
const clickEffect=[
	{
		name:'应用内打开',
		value:'APPLICATION_OPEN'
	},
	{
		name:'浏览器打开',
		value:'BROWSER_OPEN'
	},
	{
		name:'直接下载',
		value:'START_DOWNLOAD'
	},
	{
		name:'确认后下载',
		value:'CONFIRM_DOWNLOAD'
	}
]
const headArr = [{name: '广告位名称', w: '6.25%'},
	{name: '广告位id', w: '6.25%'},
	{name: '所属应用', w: '6.25%'},
	{name: '应用id', w: '6.25%'},
	{name: '应用类型', w: '6.25%'},
	{name: '终端', w: '6.25%'},
	{name: '广告位类型', w: '6.25%'},
	{name: '广告展现形式', w: '6.25%'},
	{name: '广告位尺寸', w: '6.25%'},
	{name: '素材规格', w: '6.25%'},
	{name: '广告位底价', w: '6.25%'},
	{name: '广告位日均pv', w: '6.25%'},
	{name: '点击效果', w: '6.25%'},
	{name: '是否支持deeplink', w: '6.25%'},
	{name: '是否支持曝光/点击监测', w: '6.25%'},
	{name: '预览图片', w: '6.25%'}]
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
export default class FlowDictionary extends React.Component {
	constructor(){
		super()
		this.state={
			size:10,
			appId:'',
			typeId:'',
			formId:'',
			sizeId:'',
			appType:'',
			specification:'',
			clickEffect:'',
			searchText:'',
			headStateArr:[],
			selectArr:['广告位名称', '广告位id','所属应用',
				'应用id',
				'应用类型',
				'终端',
				'广告位类型',
				'广告展现形式',
				'广告位尺寸',
				'素材规格',
				'广告位底价',
				'广告位日均pv',
				'点击效果',
				'是否支持deeplink',
				'是否支持曝光/点击监测',
				'预览图片'],
		}
	}
	componentWillMount(){
		GeneralizeManageStore.getAppArr();
		GeneralizeManageStore.getAdFormsArr();
		GeneralizeManageStore.getAdSpaceSizes();
		this.setState({
			appId:localStorage.getItem('appId')?localStorage.getItem('appId'):'',
			adType:localStorage.getItem('adType')?localStorage.getItem('adType'):'',
			formId :localStorage.getItem('formId')?localStorage.getItem('formId'):'',
			sizeId:localStorage.getItem('sizeId')?localStorage.getItem('sizeId'):'',
			appType:localStorage.getItem('appType')?localStorage.getItem('appType'):'',
			specification:localStorage.getItem('specification')?localStorage.getItem('specification'):'',
			clickEffect:localStorage.getItem('clickEffect')?localStorage.getItem('clickEffect'):'',
			search:this.state.searchText,
			headStateArr: headArr
		})
	}
	componentDidMount(){
		let data={};
		if(this.state.appId.indexOf('@')>-1){
			let str=this.state.appId.substr(1);
			data={ appId:str,
				adType:this.state.adType,
				adFormId :this.state.formId,
				spaceSizeId:this.state.sizeId,
				appType:this.state.appType,
				creativeFormat:this.state.specification,
				clickEffect:this.state.clickEffect,
				search:this.state.searchText
			}
		}else{
			let str=this.state.appId.substr(1);
			data={ appGroupId:str,
				adType:this.state.adType,
				adFormId :this.state.formId,
				spaceSizeId:this.state.sizeId,
				appType:this.state.appType,
				creativeFormat:this.state.specification,
				clickEffect:this.state.clickEffect,
				search:this.state.searchText
			}
		}
		FlowDictionaryStore.getSpaceFormListInfo(data);
	}
	componentWillUnmount(){
		localStorage.removeItem('appId')
		localStorage.removeItem('adType')
		localStorage.removeItem('formId')
		localStorage.removeItem('sizeId')
		localStorage.removeItem('appType')
		localStorage.removeItem('specification')
		localStorage.removeItem('clickEffect')
	}
	getSpace(){
		let data={};
		if(this.state.appId.indexOf('@')>-1){
			let str=this.state.appId.substr(1);
			data={ appId:str,
				adType:this.state.adType,
				adFormId :this.state.formId,
				spaceSizeId:this.state.sizeId,
				appType:this.state.appType,
				creativeFormat:this.state.specification,
				clickEffect:this.state.clickEffect,
				search:this.state.searchText
				 }
		}else{
			let str=this.state.appId.substr(1);
			data={ appGroupId:str,
				adType:this.state.adType,
				adFormId :this.state.formId,
				spaceSizeId:this.state.sizeId,
				appType:this.state.appType,
				creativeFormat:this.state.specification,
				clickEffect:this.state.clickEffect,
				search:this.state.searchText
				 }
		}
		FlowDictionaryStore.getSpaceFormListInfo(data);
	}
	onAppTypeChange(e){//应用类型
		localStorage.setItem('appType',e);
		this.setState({
			appType:e
		})
	}
	onAppChange(e){//所属应用
		localStorage.setItem('appId',e);
		this.setState({
			appId:e
		})
	}
	onTypeChange(e){//广告位类型
		localStorage.setItem('adType',e);
		this.setState({
			adType:e
		})
	}
	onFormChange(e){//广告位展现形式
		localStorage.setItem('formId',e);
		this.setState({
			formId:e
		})
	}
	onSizeChange(e){//广告位大小
		localStorage.setItem('sizeId',e);
		this.setState({
			sizeId:e
		})
	}
	onSpecChange(e){//素材规格
		localStorage.setItem('specification',e);
		this.setState({
			specification:e
		})
	}
	onClickChange(e){//点击效果
		localStorage.setItem('clickEffect',e);
		this.setState({
			clickEffect:e
		})
	}
	filtrate(){
		location.reload();
	}
	clickSearch(){
		this.getSpace()
	}
	aaa(e){
		return ExcellentExport.excel(e.target,'datatable', 'Sheet Name Here');
	}
	onMulChange(e){
		let arr=headArr;
		let arr1=[];
		for(let i=0; i<arr.length; i++){
			if(e.indexOf(arr[i].name)>=0){
				arr1.push(arr[i]);
			}
		}
		for(let i=0; i<arr1.length; i++){
			arr1[i].w=(100/arr1.length)+'%'
		}
		this.setState({
			selectArr: e,
			headStateArr:arr1,
		})
	}
	render() {
		let {flowGroups}=FlowDictionaryStore;
		let {appArr,AdForms,adSizes}=GeneralizeManageStore;
		return (
			<div>
				<Layout history={this.props.history}/>
				<div className="content">
					<div className="contentBulk1" style={{paddingTop: 20}}>
						<div className="accountListRow" >
							<div className="listROwlet2" >
								<div className="form-left" style={{width: '35%'}}>
									应用类型:
								</div>
								<div className="form-right" style={{width: '50%'}}>
									<Select defaultValue="全部" style={{ width: 120 }} value={this.state.appType}
											onChange={(e)=>this.onAppTypeChange(e)}>
										<Option value=''>全部</Option>
										{apptype.map((i,k)=>(
											<Option value={i} key={k}>{i}</Option>
										))}
									</Select>
								</div>
							</div>
							<div className="listROwlet2" >
								<div className="form-left" style={{width: '35%'}}>
									所属应用:
								</div>
								<div className="form-right" style={{width: '50%'}}>
									<Select defaultValue="全部" style={{ width: 120 }}
											value={this.state.appId}
											onChange={(e)=>this.onAppChange(e)}>
										<Option value=''>全部</Option>
										{appArr.map((i,k)=>(
											<Option value={i.APP_ID?'@'+i.APP_ID:'$'+i.APP_GROUP_ID} key={k}>{i.NAME}</Option>
										))}
									</Select>
								</div>
							</div>
							<div className="listROwlet2" >
								<div className="form-left" style={{width: '35%'}}>
									广告位类型:
								</div>
								<div className="form-right" style={{width: '50%'}}>
									<Select defaultValue="全部" style={{ width: 120 }}
											value={this.state.adType}
											onChange={(e)=>this.onTypeChange(e)}>
										<Option value=''>全部</Option>
										{typeArr.map((i,k)=>(
											<Option value={i.value} key={k}>{i.name}</Option>
										))}
									</Select>
								</div>
							</div>
							<div className="listROwlet2" >
								<div className="form-left" style={{width: '35%'}}>
									广告展现形式:
								</div>
								<div className="form-right" style={{width: '50%'}}>
									<Select defaultValue="全部" style={{ width: 120 }}
											value={this.state.formId}
											onChange={(e)=>this.onFormChange(e)}>
										<Option value=''>全部</Option>
										{AdForms.map((i,k)=>(
											<Option value={i.id} key={k}>{i.adFormName}</Option>
										))}
									</Select>
								</div>
							</div>
							<div className="listROwlet2" >
								<div className="form-left" style={{width: '35%'}}>
									广告位尺寸:
								</div>
								<div className="form-right" style={{width: '50%'}}>
									<Select defaultValue="全部" style={{ width: 120 }}
											value={this.state.sizeId}
											onChange={(e)=>this.onSizeChange(e)}>
										<Option value=''>全部</Option>
										{adSizes.map((i,k)=>(
											<Option value={i.width+'*'+i.height} key={k}>{i.width}×{i.height}</Option>
										))}
									</Select>
								</div>
							</div>
							<div className="listROwlet2" >
								<div className="form-left" style={{width: '35%'}}>
									素材规格:
								</div>
								<div className="form-right" style={{width: '50%'}}>
									<Select defaultValue="全部" style={{ width: 120 }}
											value={this.state.specification}
											onChange={(e)=>this.onSpecChange(e)}>
										<Option value=''>全部</Option>
										{specification.map((i,k)=>(
											<Option value={i} key={k}>{i}</Option>
										))}
									</Select>
								</div>
							</div>
							<div className="listROwlet2" >
								<div className="form-left" style={{width: '35%'}}>
									点击后效果:
								</div>
								<div className="form-right" style={{width: '50%'}}>
									<Select defaultValue="全部" style={{ width: 120 }}
											value={this.state.clickEffect}
											onChange={(e)=>this.onClickChange(e)}>
										<Option value=''>全部</Option>
										{clickEffect.map((i,k)=>(
											<Option value={i.value} key={k}>{i.name}</Option>
										))}
									</Select>
								</div>
							</div>
						</div>
					</div>
					<div style={{paddingBottom:10}}>
						<button className="filtrateBtn" onClick={()=>this.filtrate()}>
							查询
						</button>
					</div>
					<div className="contentBulk1">
						<div className="con-head">
							<div>
								<a className="borderBtn" download="somedata.xls" href="#"
								   onClick={(e)=>this.aaa(e)}>导出
									 Excel</a>
							</div>
							<div>
								<div className="searchInput">
									<input type="text"
										   placeholder="请输入查询的名称和关键字"
										   onChange={(e)=>this.setState({searchText:e.target.value})}
										   className='searchInputText'/>
									<div className='searchInputButton' onClick={()=>this.clickSearch()}></div>
								</div>
								<div style={{float:'left',marginLeft:10}}>
									<Select
										mode="multiple"
										style={{ width: '200px' }}
										placeholder="Please select"
										value={this.state.selectArr}
										onChange={this.onMulChange.bind(this)}
										maxTagCount={3}
										dropdownMatchSelectWidth={true}
									>
										{headArr.map((i)=>(
											<Option key={i.name} disabled={i.name=="广告位名称"||i.name=="广告位id"}>{i.name}</Option>
										))}
									</Select>
								</div>
							</div>
						</div>
						<table id="datatable" style={{width:'100%'}}>
							<thead>
								<tr className="table-head1">
									{
										this.state.headStateArr.map((i, k) => (
											<th key={k} style={{width: i.w}} className="gezi">
												{i.name}
											</th>
										))
									}
								</tr>
							</thead>
							<tbody>
							{flowGroups.map((i, k) => {
								if (i.APP_GROUP_ID) {
									return(
										<tr className="table-body" key={k} style={{height:i.allfrom.length*40,background:k%2==0?'#fff':'#fafafa'}}>
											{this.state.selectArr.indexOf("广告位名称")>-1?(<td className="gezif juzhong" style={{width:this.state.headStateArr[0].w,height:i.allfrom.length*40}}>
												无
											</td>):null}
											{this.state.selectArr.indexOf("广告位id")>-1?(<td className="gezif juzhong" style={{width:this.state.headStateArr[0].w,height:i.allfrom.length*40}}>
												无
											</td>):null}
											{this.state.selectArr.indexOf("所属应用")>-1?(<td className="gezif juzhong" style={{width:this.state.headStateArr[0].w,height:i.allfrom.length*40}}>
												无
											</td>):null}
											{this.state.selectArr.indexOf("应用id")>-1?(<td className="gezif juzhong" style={{width:this.state.headStateArr[0].w,height:i.allfrom.length*40}}>
												无
											</td>):null}
											{this.state.selectArr.indexOf("应用类型")>-1?(<td className="gezif juzhong" style={{width:this.state.headStateArr[0].w,height:i.allfrom.length*40}}>
												{i.APP_GROUP_NAME}
											</td>):null}
											{this.state.selectArr.indexOf("终端")>-1?(<td className="gezif juzhong" style={{width:this.state.headStateArr[0].w,height:i.allfrom.length*40}}>
												无
											</td>):null}
											{this.state.selectArr.indexOf("广告位类型")>-1?(<td className="gezif " style={{width:this.state.headStateArr[0].w,height:i.allfrom.length*40}}>
												{
													i.allfrom.map((a,b)=>(
														<div key={b} className="xiaogezi" style={{width:'100%'}}>
															{a.AD_TYPE}
														</div>
													))
												}
											</td>):null}
											{this.state.selectArr.indexOf("广告展现形式")>-1?(<td className="gezif" style={{width:this.state.headStateArr[0].w,height:i.allfrom.length*40}}>
												{
													i.allfrom.map((a,b)=>(
														<div key={b} className="xiaogezi" style={{width:'100%'}}>
															{a.AD_FORM_NAME}
														</div>
													))
												}
											</td>):null}
											{this.state.selectArr.indexOf("广告位尺寸")>-1?(<td className="gezif juzhong" style={{width:this.state.headStateArr[0].w,height:i.allfrom.length*40}}>
												无
											</td>):null}
											{this.state.selectArr.indexOf("素材规格")>-1?(<td className="gezif" style={{width:this.state.headStateArr[0].w,height:i.allfrom.length*40}}>
												{
													i.allfrom.map((a,b)=>(
														<div key={b} className="xiaogezi" style={{width:'100%'}}>
															{a.CREATIVE_FORMAT}
														</div>
													))
												}
											</td>):null}
											{this.state.selectArr.indexOf("广告位底价")>-1?(<td className="gezif" style={{width:this.state.headStateArr[0].w,height:i.allfrom.length*40}}>
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
											</td>):null}
											{this.state.selectArr.indexOf("广告位日均pv")>-1?(<td className="gezif juzhong" style={{width:this.state.headStateArr[0].w,height:i.allfrom.length*40}}>
												无
											</td>):null}
											{this.state.selectArr.indexOf("点击效果")>-1?(<td className="gezif juzhong" style={{width:this.state.headStateArr[0].w,height:i.allfrom.length*40}}>
												无
											</td>):null}
											{this.state.selectArr.indexOf("是否支持deeplink")>-1?(<td className="gezif juzhong" style={{width:this.state.headStateArr[0].w,height:i.allfrom.length*40}}>
												无
											</td>):null}
											{this.state.selectArr.indexOf("是否支持曝光/点击监测")>-1?(<td className="gezif juzhong" style={{width:this.state.headStateArr[0].w,height:i.allfrom.length*40}}>
												无
											</td>):null}
											{this.state.selectArr.indexOf("预览图片")>-1?(<td className="gezif juzhong" style={{width:this.state.headStateArr[0].w,height:i.allfrom.length*40}}>
											</td>):null}
										</tr>
									)
								} else {
									return (
										<tr className="table-body" key={k}
											style={{background: k % 2 == 0 ? '#fff' : '#fafafa'}}>
											{this.state.selectArr.indexOf("广告位名称")>-1?(<td style={{width: this.state.headStateArr[0].w}} title={i.AD_SPACE_NAME} className='gezi'>
												{i.AD_SPACE_NAME}
											</td>):null}
											{this.state.selectArr.indexOf("广告位id")>-1?(<td style={{width: this.state.headStateArr[0].w}} title={i.AD_SPACE_ID} className='gezi'>
												{i.AD_SPACE_ID}
											</td>):null}
											{this.state.selectArr.indexOf("所属应用")>-1?(<td style={{width: this.state.headStateArr[0].w}} title={i.APP_NAME} className='gezi'>
												{i.APP_NAME}
											</td>):null}
											{this.state.selectArr.indexOf("应用id")>-1?(<td style={{width: this.state.headStateArr[0].w}} title={i.APP_ID} className='gezi'>
												{i.APP_ID}
											</td>):null}
											{this.state.selectArr.indexOf("应用类型")>-1?(<td style={{width: this.state.headStateArr[0].w}} title={i.APP_TYPE} className='gezi'>
												{i.APP_TYPE}
											</td>):null}
											{this.state.selectArr.indexOf("终端")>-1?(<td style={{width: this.state.headStateArr[0].w}} className='gezi'>
												{i.OS=='Android'?'App':'PC'}
											</td>):null}
											{this.state.selectArr.indexOf("广告位类型")>-1?(<td style={{width: this.state.headStateArr[0].w}} title={i.AD_TYPE} className='gezi'>
												{i.AD_TYPE}
											</td>):null}
											{this.state.selectArr.indexOf("广告展现形式")>-1?(<td style={{width: this.state.headStateArr[0].w}} title={i.AD_FORM_NAME} className='gezi'>
												{i.AD_FORM_NAME}
											</td>):null}
											{this.state.selectArr.indexOf("广告位尺寸")>-1?(<td style={{width: this.state.headStateArr[0].w}} title={i.WIDTH+'×'+i.HEIGHT} className='gezi'>
												{i.WIDTH}×{i.HEIGHT}
											</td>):null}
											{this.state.selectArr.indexOf("素材规格")>-1?(<td style={{width: this.state.headStateArr[0].w}} title={i.CREATIVE_FORMAT} className='gezi'>
												{i.CREATIVE_FORMAT}
											</td>):null}
											{this.state.selectArr.indexOf("广告位底价")>-1?(<td style={{width: this.state.headStateArr[0].w}} className='gezi'>
												{i.FLOOR_PRICE}
											</td>):null}
											{this.state.selectArr.indexOf("广告位日均pv")>-1?(<td style={{width: this.state.headStateArr[0].w}} className='gezi'>
												{i.AVE_PV}
											</td>):null}
											{this.state.selectArr.indexOf("点击效果")>-1?(<td style={{width: this.state.headStateArr[0].w}} title={Client.effect(i.CLICK_EFFECT)} className='gezi'>
												{Client.effect(i.CLICK_EFFECT)}
											</td>):null}
											{this.state.selectArr.indexOf("是否支持deeplink")>-1?(<td style={{width: this.state.headStateArr[0].w}} className='gezi'>
												{i.IS_DEEP_LINK}
											</td>):null}
											{this.state.selectArr.indexOf("是否支持曝光/点击监测")>-1?(<td style={{width: this.state.headStateArr[0].w}} className='gezi'>
												{i.IS_PV_MONITOR}
											</td>):null}
											{this.state.selectArr.indexOf("预览图片")>-1?(<td style={{width: this.state.headStateArr[0].w}} className='gezi'>
											</td>):null}
										</tr>
									)
								}
							})}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		)
	}
}
