import React ,{Component}from "react";
import { Radio, Checkbox} from 'antd';
const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;
import NewAdSpaceStore from "../../../mobx/mediaManage/adSpace/new-adSpace-store"
import {observer} from "mobx-react";
import {Link} from "react-router-dom";
import Layout from "../../../layout/Layout";
import AppManageStore from "../../../mobx/mediaManage/appManage/app-manage-store";
import AdspceManageStore from "../../../mobx/mediaManage/adSpace/adSpace-manage-store";
import Client from "../../../common/lead-api";
import HintAlert from "../../common/HintAlert";
const options = [
	{ label: 'banner广告', value: 'BANNER' },
	{ label: '开屏广告', value: 'OPENSCREEN' },
	{ label: '插屏广告', value: 'POPUP' },
	{ label: '原生广告', value: 'NATIVE' },
	{ label: '视频广告', value: 'VIDEO' },
];
const radioOptions = [
	{ label: '是', value: 0 },
	{ label: '否', value: 1 },
];
const checkoptions = [
	{ label: '应用内打开', value: 'APPLICATION_OPEN' },
	{ label: '浏览器打开', value: 'BROWSER_OPEN' },
	{ label: '直接下载', value: 'START_DOWNLOAD' },
	{ label: '确认后下载', value: 'CONFIRM_DOWNLOAD' },
];
import $ from "jquery";
@observer
export default class NewAdSpace extends Component {
	constructor(props){
		super(props)
		this.state={
			adSpaceName:'',
			appId:'',
			spaceSizeId:'',
			adSpaceType:'',
			floorPrice:'',
			avePv:'',
			clickEffect:[],
			isDeepLink:0,
			isPvMonitor:0,
			maxPvMonitor:'',
			isCvMonitor:0,
			previewImgUrl:'',
			adNameError:false,
			floorPriceError:false,
			pvError:false,
			filename:'未选择任何文件',
			isConfirm:false,
			imgWidth:0,
			imgHeight:0
		};
	}
	//页面加载时访问的方法
	componentWillMount(){
		//获取app列表
		AppManageStore.searchItem('',1,100);
	}
	onAdTypeChange(e){
		this.setState({adSpaceType: e.target.value});
		AdspceManageStore.getSpaceSizeByAdType(e.target.value);
	}
	onRadioChange1(e){
		this.setState({isDeepLink: e.target.value});
	}
	onRadioChange2(e){
		this.setState({isPvMonitor: e.target.value});
	}
	onRadioChange3(e){
		this.setState({isCvMonitor:e.target.value});
	}
	// 选择点击效果
	clickEffectChange(event) {
		this.setState({clickEffect: event});
	}
	confirm(){
		this.setState({isConfirm: true});
		this.isFp(this.state.floorPrice);
		this.isName(this.state.adSpaceName);
		if(this.state.floorPrice!=''&&this.state.adSpaceName!=''&&this.state.adSpaceType!=''&&this.state.appId!=''&&this.state.clickEffect.length>0&&this.state.spaceSizeId!=''){
			if(Client.isNumber(this.state.floorPrice)&&Client.isMax40(this.state.adSpaceName)){
				let temmaxPvMonitor = "";
				if(this.state.isPvMonitor==0&&this.state.maxPvMonitor==""){//表示支持  但是最大数字没有填写
					temmaxPvMonitor = 3;
				}else{
					temmaxPvMonitor = this.state.maxPvMonitor;
				}
				NewAdSpaceStore.createAdSpace(
					{adSpaceName:this.state.adSpaceName,spaceState:0, leadApp: "/leadApps/"+this.state.appId,
						adType:this.state.adSpaceType,formSize: "/leadAdSpaceSizes/"+this.state.spaceSizeId,floorPrice:this.state.floorPrice,avePv:this.state.avePv,
						clickEffect:this.state.clickEffect,isDeepLink:this.state.isDeepLink,isPvMonitor:this.state.isPvMonitor,
						maxPvMonitor:temmaxPvMonitor,isCvMonitor:this.state.isCvMonitor,
						previewImgUrl:this.state.previewImgUrl,
						fileName:this.state.filename
					},
					this.callback.bind(this));
			}else{
				Client.showTank(false,'请按要求填写信息')
			}
		}else{
			Client.showTank(false,'请填写必填项')
		}
	}
	callback(id){
		this.props.history.push({
			pathname:'/newForm',
			adSpaceId:id,
			adSpaceType:this.state.adSpaceType
		});
	}
	upfile(){
		let file=$(this.refs.file)[0].files[0];
		let size=$(this.refs.file)[0].files[0].size;
		if(size>199*1024){
			alert('上传的图片的大于199kb,请重新选择');
			$(this.refs.file).val('')
			return false;
		}else{
			let fd =new FormData();
			fd.append('file',file);
			Client.uploder('file/upload',fd).then(res=>{
				this.setState({
					previewImgUrl:Client.imgFile+res.data.signature
				})
			})
		}
	}
	isName(name){
		Client.isMax40(name)? this.setState({adNameError:false}) : this.setState({adNameError:true})
	}
	nameChange(e){
		if(this.state.isConfirm)this.isName(e.target.value);
		this.setState({adSpaceName:e.target.value})
	}
	isFp(fp){
		Client.isNumber(fp)? this.setState({floorPriceError:false}) : this.setState({floorPriceError:true})
	}
	isPv(fp){
		Client.isNumber(fp)? this.setState({pvError:false}) : this.setState({pvError:true})
	}
	fpChange(e){
		if(this.state.isConfirm)this.isFp(e.target.value);
		this.setState({floorPrice:e.target.value})
	}
	pvChange(e){
		if(this.state.isConfirm)this.isPv(e.target.value);
		this.setState({avePv:e.target.value})
	}
	onSizeChange(e){
		let str=$(e.target).find("option:selected").text();
		this.setState({
			spaceSizeId:e.target.value,
			imgWidth: str.split('*')[0],
			imgHeight: str.split('*')[1]
		})
	}
	onFileChange(e){
		let fileData = e.target.files[0];
		let width=0;
		let height=0;
		let that=this;
		//读取图片数据
		let reader = new FileReader();
		reader.onload = function (e) {
			let data = e.target.result;
			let image = new Image();
			image.onload = function () {
				width=image.width;
				height=image.height;
			};
			image.src = data;
		};
		reader.readAsDataURL(fileData);
		if(this.state.imgWidth===0&&this.state.imgHeight===0){
			Client.showTank(false,'请先选择尺寸大小')
		}else {
			if (e.target.files[0]) {
				let fileName=e.target.files[0].name;
				let file = e.target.files[0];
				let size = e.target.files[0].size;
				if (size > 199 * 1024) {
					Client.showTank(false, '上传的图片的大于199kb,请重新选择');
					this.setState({
						filename: '未选择任何文件'
					})
					return false;
				} else {
					let fd = new FormData();
					fd.append('file', file);
					setTimeout(function () {
						if (width != that.state.imgWidth || height != that.state.imgHeight) {
							Client.showTank(false, '请选择标准大小的图片')
						} else {
							Client.uploder('file/upload', fd).then(res => {
								that.setState({
									filename: fileName,
									previewImgUrl: Client.imgFile + res.data.signature
								})
							})
						}
					}, 300)
				}
			}
		}
	}
	render() {
		let {leadAppsArr}=AppManageStore;
		let {spaceSizeArrByAdType} = AdspceManageStore;
		return (
			<div>
				<Layout history={this.props.history}/>
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
						<div>
							<div style={{width:'100%',height:30,marginBottom:10}}>
								<div className="form-left">
									<i className="red">*</i>&nbsp; 广告位名称:
								</div>
								<div className="form-right">
									<input type="text"
										   placeholder=" 少于40个字符"
										   className={this.state.adNameError?'borderError':"border1"}
										   onChange={e=>this.nameChange(e)}
									/>
									{this.state.adNameError?(
										<HintAlert left={360} width={170} message={this.state.adSpaceName==''?"名称不能为空":"名称不能大于40个字符"}/>
									):null}
								</div>
							</div>
							<div style={{width:'100%',height:30,marginBottom:10}}>
								<div className="form-left">
									<i className="red">*</i>&nbsp;所属应用:
								</div>
								<div className="form-right">
									<select name="appId" className="border1"  onChange={e=>this.setState({appId:e.target.value})}>
										<option value="-1">请选择所属应用</option>
										{leadAppsArr.map((i,k)=>(
											<option key={i.id} value={i.id}>{i.appName}</option>
										))}
									</select>
								</div>
							</div>
							<div style={{width:'100%',height:30,marginBottom:10}}>
								<div className="form-left">
									<span style={{color:'red'}}>*</span> &nbsp;&nbsp;广告位类型:
								</div>
								<div className="form-right">
									<RadioGroup options={options} onChange={(e)=>this.onAdTypeChange(e)}
												value={this.state.adSpaceType} />
								</div>
							</div>
							<div style={{width:'100%',height:30,marginBottom:10}}>
								<div className="form-left">
									<i className="red">*</i>&nbsp;广告位尺寸:
								</div>
								<div className="form-right">
									<select name="appId" className="border1"  onChange={e=>this.onSizeChange(e)}>
										<option value="-1">请选择尺寸</option>
										{spaceSizeArrByAdType.map((i,k)=>(
											<option key={i.id} value={i.id}>{i.width}*{i.height}</option>
										))}
									</select>
								</div>
							</div>
							<div style={{width:'100%',height:30,marginBottom:10}}>
								<div className="form-left">
									<span style={{color:'red'}}>*</span> &nbsp;&nbsp;广告位底价:
								</div>
								<div className="form-right">
									<input type="text"
										   placeholder=" 元/CPM"
										   className={this.state.floorPriceError?'borderError':'border1'}
										   name="floorPrice"
										   onChange={e=>this.fpChange(e)}/>
									{this.state.floorPriceError?(
										<HintAlert left={360} width={170} message={this.state.floorPrice==''?"底价不能为空":"底价必须是数字"}/>
									):null}
								</div>
							</div>
							<div style={{width:'100%',height:30,marginBottom:10}}>
								<div className="form-left">
									 广告位日均PV:
								</div>
								<div className="form-right">
									<input type="text" placeholder=" 联想自有媒体必填"
										   className={this.state.pvError?'borderError':'border1'}
										   name="avePv"
										   onChange={e=>this.pvChange(e)}/>
									{this.state.pvError?(
										<HintAlert left={360} width={170} message={"底价必须是数字"}/>
									):null}
								</div>
							</div>
							<div style={{width:'100%',height:30,marginBottom:10}}>
								<div className="form-left">
									<span style={{color:'red'}}>*</span> &nbsp;&nbsp;点击效果:
								</div>
								<div className="form-right" >
									<CheckboxGroup options={checkoptions} defaultValue={this.state.clickEffect}
												   onChange={(e)=>this.clickEffectChange(e)} />
								</div>
							</div>
							<div style={{width:'100%',height:30,marginBottom:10}}>
								<div className="form-left">
									是否支持deeplink:
								</div>
								<div className="form-right">
									<RadioGroup options={radioOptions} onChange={(e)=>this.onRadioChange1(e)}
												value={this.state.isDeepLink} />
								</div>
							</div>

							<div style={{width:'100%',height:30,marginBottom:10}}>
								<div className="form-left">
									是否支持曝光监测:
								</div>
								<div className="form-right">
									<RadioGroup options={radioOptions} onChange={(e)=>this.onRadioChange2(e)}
												value={this.state.isPvMonitor} />
									最大条数 &nbsp;<input type="text" className="ant-input" style={{width:180,height:30}}
													  onChange={e=>this.setState({maxPvMonitor:e.target.value})}/>
									<i className="color1">不填写默认支持，且最大条数默认3条</i>
								</div>
							</div>
							<div style={{width:'100%',height:30,marginBottom:10}}>
								<div className="form-left">
									是否支持点击监测:
								</div>
								<div className="form-right">
									<RadioGroup options={radioOptions} onChange={(e)=>this.onRadioChange3(e)}
												value={this.state.isCvMonitor} />
								</div>
							</div>
							<div style={{width:'100%',height:30,marginBottom:10}}>
								<div className="form-left">
									广告位预览图:
								</div>
								<div className="form-right">
									<input className="fileButton" type="file" title=""
										   style={{width:250,height:30}} ref="file" accept="image/png, image/jpeg"
										   onChange={(e)=>this.onFileChange(e)} />
									<button onClick={()=>this.upfile()}>
										上传图片
									</button>
									<div style={{paddingLeft:10,height:30,lineHeight:'30px',display:'inline-block'}}>{this.state.filename}</div>
								</div>
							</div>
						</div>
					</div>
					<div className="submit-content">
						<Link to={{pathname:'/adSpaceManage'}}>
							<button className="cancelBtn">取消</button>
						</Link>
						<button className="confirmBtn" onClick={this.confirm.bind(this)}>
							下一步
						</button>
					</div>
				</div>
			</div>
		)
	}
}
