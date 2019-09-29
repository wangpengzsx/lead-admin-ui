import React from "react";
import Layout from "../../../layout/Layout";
import {Input} from "antd";
import Client from "../../../common/lead-api";
import HintAlert from "../../common/HintAlert";
import FlowGroupsStore from "../../../mobx/mediaManage/flowGroups/flow-groups-store";
import {observer} from "mobx-react";
import $ from "jquery";
@observer
export default class NewFlowGroups extends React.Component {
	constructor(props){
		super(props)
		this.state = {
			name: '',
			priceBanner:'',
			pricePopup:'',
			priceOpenScreen:'',
			priceNative:'',
			priceVideo:'',
			threeApp:'',
			filename:'未选择任何文件',
			nameError:false,
			bannerError:false,
			popupError:false,
			openError:false,
			nativeError:false,
			videoError:false,
			isConfirm:false,
		};
	}
	componentWillMount(){
		if(localStorage.getItem('newFlowGroups1')){
			Client.getNullArgument('leadAppGroups/'+localStorage.getItem('newFlowGroups1')).then(res=>{
				this.setState({
					name: res.name,
					priceBanner:res.priceBanner,
					pricePopup:res.pricePopup,
					priceOpenScreen:res.priceOpenScreen,
					priceNative:res.priceNative,
					priceVideo:res.priceVideo,
					filename:res.fileName
				})
			})
		}
	}
	componentWillUnmount(){
		localStorage.removeItem('newFlowGroups1');
	}
	submit(){
		this.setState({
			isConfirm:true
		})
		this.isPopup(this.state.pricePopup);
		this.isBanner(this.state.priceBanner);
		this.isName(this.state.name);
		this.isNative(this.state.priceNative);
		this.isOpen(this.state.priceOpenScreen);
		this.isVideo(this.state.priceVideo);
		if(this.state.name!=''&&Client.isNumber(this.state.priceBanner)&&Client.isNumber(this.state.pricePopup)&&Client.isNumber(this.state.priceOpenScreen)&&Client.isNumber(this.state.priceNative)&&Client.isNumber(this.state.priceVideo)&&this.state.filename!='未选择任何文件'){
			if(localStorage.getItem('newFlowGroups1')){
				FlowGroupsStore.modifyLeadAppsGroups(localStorage.getItem('newFlowGroups1'),{
					"fileName":this.state.filename,
					"priceBanner": this.state.priceBanner,
					"pricePopup": this.state.pricePopup,
					"priceOpenScreen": this.state.priceOpenScreen,
					"priceNative": this.state.priceNative,
					"priceVideo": this.state.priceVideo,
					"name": this.state.name
				},this.callback.bind(this),this.errCallback.bind(this))
			}else{
				FlowGroupsStore.createLeadAppsGroups({
					"fileName":this.state.filename,
					"priceBanner": this.state.priceBanner,
					"pricePopup": this.state.pricePopup,
					"priceOpenScreen": this.state.priceOpenScreen,
					"priceNative": this.state.priceNative,
					"priceVideo": this.state.priceVideo,
					"name": this.state.name},this.callback.bind(this),this.errCallback.bind(this))
			}
		}else if(this.state.filename=='未选择任何文件'){
			Client.showTank(false,'请选择上传文件')
		}else{
			Client.showTank(false,'请按要求填写信息')
		}
	}
	onFileChange(e){
		if(e.target.files[0]) {
			this.setState({
				filename: e.target.files[0].name
			})
		}
	}
	errCallback(err){
		Client.showTank(false,err.responseJSON.message);
	}
	callback(id){
		let file=$(this.refs["filename"])[0].files[0];
		if(file){
			let fd =new FormData();
			fd.append('apps',file);
			FlowGroupsStore.uploadExcel(fd,id,false,this.upCall.bind(this))
		}else{
			this.upCall()
		}
	}
	upCall(){
		this.props.history.push({pathname: '/flowGroups'});
	}
	isName(value){
		value==''? this.setState({nameError:true}):this.setState({nameError:false})
	}
	nameChange(e){
		if(this.state.isConfirm)this.isName(e.target.value);
		this.setState({name: e.target.value})
	}
	isBanner(value){
		Client.isNumber(value)?this.setState({bannerError: false}):this.setState({bannerError: true})
	}
	bannerChange(e){
		if(this.state.isConfirm)this.isBanner(e.target.value);
		this.setState({priceBanner: e.target.value})
	}
	isPopup(value){
		Client.isNumber(value)? this.setState({popupError: false}) : this.setState({popupError: true})
	}
	popupChange(e){
		if(this.state.isConfirm)this.isPopup(e.target.value);
		this.setState({pricePopup: e.target.value})
	}
	isOpen(value){
		Client.isNumber(value)? this.setState({openError: false}) : this.setState({openError: true})
	}
	openChange(e){
		if(this.state.isConfirm)this.isOpen(e.target.value);
		this.setState({priceOpenScreen: e.target.value})
	}
	isNative(value){
		Client.isNumber(value)? this.setState({nativeError: false}) : this.setState({nativeError: true})
	}
	nativeChange(e){
		if(this.state.isConfirm)this.isNative(e.target.value)
		this.setState({priceNative: e.target.value})
	}
	isVideo(value){
		Client.isNumber(value)? this.setState({videoError: false}) : this.setState({videoError: true})
	}
	videoChange(e){
		if(this.state.isConfirm)this.isVideo(e.target.value);
		this.setState({priceVideo: e.target.value})
	}
	render() {
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
						<div className="accountListRow">
							<div className="form-left">
								<i className="red">*</i>&nbsp; 流量分组名称:
							</div>
							<div className="form-right">
								<input style={{width: 360, height: 30}}
									   type="text" className={this.state.nameError?'borderError':'border1'}
									   value={this.state.name}
									   onChange={e=>this.nameChange(e)}/>
								{this.state.nameError?(
									<HintAlert left={360} width={170} message="流量分组名称不能为空"/>
								):null}
							</div>
						</div>
						<div className="accountListRow">
							<div className="form-left">
								<i className="red">*</i>&nbsp; 关联第三方应用：
							</div>
							<div className="form-right">
								<input className="fileButton" type="file" title=""
									   style={{width:58,height:30}} ref="filename"
									   accept=".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
									   onChange={(e)=>this.onFileChange(e)} />
								<button >
									选择文件
								</button>
								<div style={{paddingLeft:10,height:30,lineHeight:'30px',display:'inline-block'}}>{this.state.filename}</div>
								<a href={Client.base+"/sample/group.xlsx"}>模板下载</a>
							</div>
						</div>
						<div className="accountListRow">
							<div className="form-left">
								<i className="red">*</i>&nbsp; Banner广告底价:
							</div>
							<div className="form-right">
								<Input style={{width: 360, height: 30}}
									   type="text" className={this.state.bannerError?'borderError':'border1'}
									   value={this.state.priceBanner}
									   onChange={e=>this.bannerChange(e)}/>
								{this.state.bannerError?(
									<HintAlert left={360} width={170}
											   message={this.state.priceBanner==''?"banner广告底价不能为空":'banner广告底价必须是数字'}/>
								):null}
							</div>
						</div>
						<div className="accountListRow">
							<div className="form-left">
								<i className="red">*</i>&nbsp; 插屏广告底价:
							</div>
							<div className="form-right">
								<Input style={{width: 360, height: 30}}
									   type="text" className={this.state.popupError?'borderError':'border1'}
									   value={this.state.pricePopup}
									   onChange={e=>this.popupChange(e)}/>
								{this.state.popupError?(
									<HintAlert left={360} width={170}
											   message={this.state.pricePopup==''?"插屏广告底价不能为空":'插屏广告底价必须是数字'}/>
								):null}
							</div>
						</div>
						<div className="accountListRow">
							<div className="form-left">
								<i className="red">*</i>&nbsp; 开屏广告底价:
							</div>
							<div className="form-right">
								<Input style={{width: 360, height: 30}}
									   type="text" className={this.state.openError?'borderError':'border1'}
									   value={this.state.priceOpenScreen}
									   onChange={e=>this.openChange(e)}/>
								{this.state.openError?(
									<HintAlert left={360} width={170}
											   message={this.state.priceOpenScreen==''?"开屏广告底价不能为空":'开屏广告底价必须是数字'}/>
								):null}
							</div>
						</div>
						<div className="accountListRow">
							<div className="form-left">
								<i className="red">*</i>&nbsp; 原生广告底价:
							</div>
							<div className="form-right">
								<Input style={{width: 360, height: 30}}
									   type="text" className={this.state.nativeError?'borderError':'border1'}
									   value={this.state.priceNative}
									   onChange={e=>this.nativeChange(e)}/>
								{this.state.nativeError?(
									<HintAlert left={360} width={170}
											   message={this.state.priceNative==''?"原生广告底价不能为空":'原生广告底价必须是数字'}/>
								):null}
							</div>
						</div>
						<div className="accountListRow">
							<div className="form-left">
								<i className="red">*</i>&nbsp; 视频广告底价:
							</div>
							<div className="form-right">
								<Input style={{width: 360, height: 30}}
									   type="text" className={this.state.videoError?'borderError':'border1'}
									   value={this.state.priceVideo}
									   onChange={e=>this.videoChange(e)}/>
								{this.state.videoError?(
									<HintAlert left={360} width={170}
											   message={this.state.priceVideo==''?"视频广告底价不能为空":'视频广告底价必须是数字'}/>
								):null}
							</div>
						</div>
					</div>
					<div className="submit-content">
						<button className="cancelBtn" onClick={()=>this.props.history.push({pathname: '/flowGroups'})}>取消</button>
						<button className="confirmBtn" onClick={()=>this.submit()}>确定</button>
					</div>
				</div>
			</div>
		)
	}
}
