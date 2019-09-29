import React from "react";
import Layout from "../../../layout/Layout";
import {Radio} from "antd";
import UploadOrginality from "../../../mobx/generalizeSupport/upload-originality-store";
import {observer} from "mobx-react";
import $ from "jquery";
const RadioGroup = Radio.Group;
import Client from "../../../common/lead-api";
import HintAlert from "../../common/HintAlert";
const headArr=[
	{name:'广告位名称',w:'14.28%'},
	{name:'所属应用',w:'14.28%'},
	{name:'广告形式',w:'14.28%'},
	{name:'创意尺寸',w:'14.28%'},
	{name:'素材规格',w:'14.28%'},
	{name:'广告位底价',w:'14.28%'},
	{name:'广告位日均pv',w:'14.28%'},
];
@observer
export default class UploadingOriginality extends React.Component {
	constructor(){
		super()
		this.state={
			value:'BANNER',
			name:'',
			clickTargetURL:'',
			deeplink:'',
			clickAction:'',
			fields:[],
			nameError:false,
			urlError:false,
			isConfirm:false
		}
	}
	componentWillMount(){
		UploadOrginality.getleadAdForms(this.state.value);
	}
	componentDidMount(){
		setTimeout(()=>{
			let {formId,sizeId}=UploadOrginality
			UploadOrginality.getAdSpace({adFormId:formId,spaceSizeId:this.widthAndHeight(sizeId)})
		},1000)
	}
	widthAndHeight(sizeId){
		let strArr=sizeId.split('x');
		let height=strArr[1];
		let width=strArr[0].split(':')[1];
		return width+'*'+height;
	}
	onChange(e){
		UploadOrginality.getleadAdForms(e.target.value);
		this.setState({
			value:e.target.value
		})
		setTimeout(()=>{
			let {formId,sizeId}=UploadOrginality
			UploadOrginality.getAdSpace({adFormId:formId,spaceSizeId:this.widthAndHeight(sizeId)})
		},1000)
	}
	onFormChange(e){
		let {sizeId}=UploadOrginality
		UploadOrginality.formId=e.target.value;
		UploadOrginality.getSizeArr(e.target.value);
		UploadOrginality.getAdSpace({adFormId:e.target.value,spaceSizeId:this.widthAndHeight(sizeId)})
	}
	onSizeChange(e){
		let {formId}=UploadOrginality
		UploadOrginality.sizeId=e.target.value;
		UploadOrginality.getAdSpace({adFormId:formId,spaceSizeId:this.widthAndHeight(e.target.value)})
	}
	onClickChange(e){
		this.setState({
			clickAction:e.target.value
		})
	}
	confirm(){
		let {sizeId,formId,fields}=UploadOrginality;
		this.setState({
			isConfirm:true
		})
		this.isName(this.state.name);
		this.isUrl(this.state.clickTargetURL);
		if(this.state.fields.length==fields.length&&this.state.clickTargetURL!=''&&this.state.clickAction!=''&&this.state.name!=''){
			let data={}
			if(this.state.deeplink==''){
				data={
					adType:this.state.value,
					adSize:{id:sizeId},
					adForm:{id:formId},
					name:this.state.name,
					clickTargetURL:this.state.clickTargetURL,
					clickAction:this.state.clickAction,
					fields:this.state.fields,
					creativeState:'ONLINE',
					creativeType:'POPULARIZE'
				}
			}else{
				data={
					adType:this.state.value,
					adSize:{id:sizeId},
					adForm:{id:formId},
					name:this.state.name,
					clickTargetURL:this.state.deeplink,
					clickFallbackURL:this.state.clickTargetURL,
					clickAction:this.state.clickAction,
					fields:this.state.fields,
					creativeState:'ONLINE',
					creativeType:'POPULARIZE'
				}
			}
			UploadOrginality.createOriginality(data,this.callback.bind(this))
		}else{
			Client.showTank(false,'请按要求填写必填项')
		}
	}
	callback(){
		this.props.history.push({pathname:'/generalizeMaterial'})
	}
	aaa(i){
		if(i.type=="IMAGE"){
			return'图片尺寸'+i.constraints[0].value+'×'+i.constraints[1].value+','+'大小不超过'+i.constraints[2].value;
		}
		if(i.type="TEXT"){
			return i.constraints[0].desc
		}
	}
	onFileChange(name){
		if($(this.refs[name])[0].files[0]){
			let that=this;
			let file=$(this.refs[name])[0].files[0];
			let fd =new FormData();
			fd.append('file',file);
			Client.uploder('file/upload',fd).then(res=>{
				let shuzu=UploadOrginality.fields;
				for(let i=0; i<shuzu.length; i++){
					if(shuzu[i].name==name){
						shuzu[i].filename=$(that.refs[name])[0].files[0].name
					}
				}
				UploadOrginality.fields=shuzu;
				let arr=that.state.fields;
				let aaa=false,
					index=0
				for(let i=0; i<arr.length; i++){
					if(arr[i].name==name){
						aaa=true;
						index=i
						break;
					}
				}
				if(aaa){
					arr[index].name=name;
					arr[index].fileName=$(that.refs[name])[0].files[0].name;
					arr[index].value=/*Client.imgFile+*/res.data.signature;
				}else{
					arr.push({
						name:name,
						fileName:$(that.refs[name])[0].files[0].name,
						value:/*Client.imgFile+*/res.data.signature
					})
				}
				that.setState({
					fields:arr
				})
			}).catch(()=>{
				let shuzu=UploadOrginality.fields;
				for(let i=0; i<shuzu.length; i++){
					if(shuzu[i].name==name){
						shuzu[i].filename='文件上传失败';
					}
				}
				UploadOrginality.fields=shuzu;
			})
		}
	}
	textChange(e,name,k,disc){
		let shuzu=UploadOrginality.fields;
		if(disc=='不超过13个字符'){
			if(Client.isMax13(e.target.value)){
				shuzu[k].error=false
			}else{
				shuzu[k].error=true
			}
		}else{
			if(Client.isMax20(e.target.value)){
				shuzu[k].error=false
			}else{
				shuzu[k].error=true
			}
		}
		UploadOrginality.fields=shuzu;
		let arr=this.state.fields;
		let aaa=false,
		index=0
		for(let i=0; i<arr.length; i++){
			if(arr[i].name==name){
				aaa=true;
				index=i
				break;
			}
		}
		if(aaa){
			arr[index].name=name;
			arr[index].value=e.target.value;
		}else{
			arr.push({
				name:name,
				value:e.target.value
			})
		}
		this.setState({
			fields:arr
		})
	}
	isName(value){
		if(Client.isMax40(value)){
			this.setState({
				nameError:false
			})
		}else{
			this.setState({
				nameError:true
			})
		}
	}
	nameChange(e){
		if(this.state.isConfirm)this.isName(e.target.value)
		this.setState({name:e.target.value})
	}
	isUrl(value){
		if(value!=''){
			this.setState({
				urlError:false
			})
		}else{
			this.setState({
				urlError:true
			})
		}
	}
	urlChange(e){
		if(this.state.isConfirm)this.isUrl(e.target.value);
		this.setState({clickTargetURL:e.target.value})
	}
	depChange(e){
		this.setState({deeplink:e.target.value})
	}
	render() {
		let {forms,formId,sizeArr,sizeId,fields,SpaceFormListInfo}=UploadOrginality
		return (
			<div>
				<Layout history={this.props.history}/>
				<div className="content">
					<div className="list-haed">
						<span className="dah1">
							广告位类型
						</span>
						<span className="xiaoh1">
							选择要投放的广告类型
						</span>
					</div>
					<div className="contentBulk">
						<RadioGroup onChange={this.onChange.bind(this)} value={this.state.value}>
							<Radio value="BANNER">banner广告</Radio>
							<Radio value="OPENSCREEN">开屏广告</Radio>
							<Radio value="POPUP">插屏广告</Radio>
							<Radio value="NATIVE">原生广告</Radio>
							<Radio value="VIDEO">视频广告</Radio>
						</RadioGroup>
					</div>
					<div className="list-haed">
						<span className="dah1">
							尺寸筛选
						</span>
					</div>
						<div className="contentBulk">
							<div className="accountListRow">
								<div className="form-left">
									广告形式:
								</div>
								<div className="form-right">
									<RadioGroup onChange={this.onFormChange.bind(this)} value={formId}>
										{forms.map((i,k)=>(
											<Radio value={i.id} key={k}>{i.adFormName}</Radio>
										))}
									</RadioGroup>
								</div>
							</div>
							<div className="accountListRow">
								<div className="form-left">
									创意尺寸:
								</div>
								<div className="form-right">
									<RadioGroup onChange={this.onSizeChange.bind(this)} value={sizeId}>
										{sizeArr.map((i,k)=>(
											<Radio value={i.id} key={k}>{i.width}×{i.height}</Radio>
										))}
									</RadioGroup>
								</div>
							</div>
						</div>
					<div className="list-haed">
						<span className="dah1">
							创意支持投放的广告位列表
						</span>
					</div>
					<div className="contentBulk">
						<div className="table-head">
							{
								headArr.map((i,k)=>(
									<div key={k} style={{width:i.w,float:'left',textAlign:'center'}}>
										{i.name}
									</div>
								))
							}
						</div>
						{SpaceFormListInfo.map((i,k)=>(
							<div className="table-body" key={k} style={{background:k%2==0?'#fff':'#fafafa'}}>
								<div className="gezi" style={{width:headArr[0].w}}>
									{i.AD_SPACE_NAME}
								</div>
								<div className="gezi" style={{width:headArr[1].w}}>
									{i.APP_NAME}
								</div>
								<div className="gezi" style={{width:headArr[2].w}}>
									{i.AD_FORM_NAME}
								</div>
								<div className="gezi" style={{width:headArr[3].w}}>
									{i.WIDTH}×{i.HEIGHT}
								</div>
								<div className="gezi" style={{width:headArr[4].w}}>
									{i.CREATIVE_FORMAT}
								</div>
								<div className="gezi" style={{width:headArr[5].w}}>
									{i.FLOOR_PRICE}
								</div>
								<div className="gezi" style={{width:headArr[6].w}}>
									{i.AVE_PV}
								</div>
							</div>
						))}
					</div>
					<div className="list-haed">
						<span className="dah1">
							填充创意元素
						</span>
					</div>
					<div className="contentBulk">
						<div className="accountListRow">
							<div className="form-left">
								<i className="red">*</i>&nbsp; 创意名称:
							</div>
							<div className="form-right">
								<input type="text" className={this.state.nameError?'borderError':'border1'}
									   style={{width:360,height:30}}
									   value={this.state.name}
									   onChange={e=>this.nameChange(e)}/>
								{this.state.nameError?(
									<HintAlert left={360} width={170}
											   message={this.state.name==''?"名称不能为空":"名称不能大于40个"}/>
								):null}
								<i className="color1">40个字符以内</i>
							</div>
						</div>
						{fields.map((i,k)=>(
							<div className="accountListRow" key={k}>
								<div className="form-left">
									<i className="red">*</i>&nbsp;{i.displayName}:
								</div>
									{
										i.type=="IMAGE"?(
											<div className="form-right">
												<input className="fileButton" type="file" title="" style={{width:250,height:30}}
													   ref={i.name} accept="image/png, image/jpeg"
													   onChange={()=>this.onFileChange(i.name)} />
												<button>
													上传图片
												</button>
												<div style={{paddingLeft:10,height:30,lineHeight:'30px',display:'inline-block'}}>
													{i.filename}
												</div>
											</div>
										):null
									}
									{
										i.type=="TEXT"?(
											<div className="form-right">
												<input type="text" className={i.error?'borderError':'border1'}
													   style={{width:360,height:30}}
													   onChange={(e)=>{this.textChange(e,i.name,k,i.constraints[0].desc)}}
												/>
												{i.error?(
													<HintAlert left={360} width={170}
															   message={i.constraints?i.constraints[0].desc:null}/>
												):null}
												<i className="color1">
													{i.constraints?i.constraints[0].desc:null}
												</i>
											</div>
										):null
									}
									{
										i.type=="VIDEO"?(
											<div className="form-right">
												<input className="fileButton" type="file" title="" style={{width:250,height:30}}
													   ref={i.name} accept="audio/mp4, video/mp4"
													   onChange={()=>this.onFileChange(i.name)} />
												<button>
													上传视频
												</button>
												<div style={{paddingLeft:10,height:30,lineHeight:'30px',display:'inline-block'}}>
													{i.filename}
												</div>
											</div>
										):null
									}
							</div>
						))}
						<div className="accountListRow">
							<div className="form-left">
								<i className="red">*</i>&nbsp; 跳转页URL:
							</div>
							<div className="form-right">
								<input type="text" className={this.state.urlError?"borderError":"border1"}
									   style={{width:360,height:30}}
									   value={this.state.clickTargetURL}
									   onChange={e=>this.urlChange(e)}/>
								{this.state.urlError?(
									<HintAlert left={360} width={170}
											   message={this.state.clickTargetURL==''?"跳转url不能为空":"跳转url格式不正确"}/>
								):null}
							</div>
						</div>
						<div className="accountListRow">
							<div className="form-left">
						 		deeplink:
							</div>
							<div className="form-right">
								<input type="text" className="border1"
									   style={{width:360,height:30}}
									   value={this.state.deeplink}
									   onChange={e=>this.depChange(e)}/>
							</div>
						</div>
						<div className="accountListRow">
							<div className="form-left">
								<i className="red">*</i>&nbsp; 点击后效果:
							</div>
							<div className="form-right">
								<RadioGroup onChange={this.onClickChange.bind(this)}>
									<Radio value={'APPLICATION_OPEN'}>应用内打开</Radio>
									<Radio value={'BROWSER_OPEN'}>浏览器打开</Radio>
									<Radio value={'START_DOWNLOAD'}>直接下载</Radio>
									<Radio value={'CONFIRM_DOWNLOAD'}>确认后下载</Radio>
								</RadioGroup>
							</div>
						</div>
						<div className="submit-content">
							<button className="cancelBtn" onClick={()=>this.props.history.push({pathname:'/generalizeMaterial'})}>取消</button>
							<button className="confirmBtn" onClick={()=>this.confirm()}>确定</button>
						</div>
					</div>
				</div>
			</div>
		)
	}
}
