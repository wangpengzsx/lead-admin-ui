import React from "react";
import Layout from "../../../layout/Layout";
import {Checkbox} from "antd";
import CreativityModal from "./modal/CreativityModal";
import adCreativityStore from "../../../mobx/generalizeSupport/AdPutInManage/ad-creativity-store";
import {observer} from "mobx-react";
import Client from "../../../common/lead-api";
const headArr=[
	{name:'创意',w:'10.55%'},
	{name:'创意名称',w:'10.55%'},
	{name:'创意尺寸',w:'10.55%'},
	{name:'素材规格',w:'10.55%'},
	{name:'deeplink地址',w:'10.55%'},
	{name:'落地页地址',w:'10.55%'},
	{name:'曝光监测',w:'10.55%'},
	{name:'点击监测',w:'10.55%'},
	{name:'上传时间',w:'10.55%'}
];
@observer
export default class NewCreativity extends React.Component {
	constructor(){
		super()
		this.state={
			name:'',
			ids:[]
		}
	}
	componentWillMount(){
		adCreativityStore.getHoldMedia(localStorage.getItem('findActivityId'))
	}
	componentWillUnmount(){
		adCreativityStore.choiceArr = [];
	}
	removeItem(){
		let arr=adCreativityStore.choiceArr;
		for(let i=0;i<arr.length;i++){
			for(let j=0;j<this.state.ids.length;j++){
				if(arr[i].id==this.state.ids[j]){
					arr.splice(i,1)
				}
			}
		}
		this.setState({ids:[]})
		adCreativityStore.choiceArr=arr;
	}
	onAllChange(e){
		let {choiceArr}=adCreativityStore;
		let arr = [];
		if (e.target.checked) {
			choiceArr.map(i => arr.push(i.id))
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
	cancel(){
		adCreativityStore.choiceArr=[];
		this.props.history.push({pathname:'/creativityList'})
	}
	onInputChange(e,k,name){
		let arr=adCreativityStore.choiceArr;
		arr[k][name]=e.target.value;
		adCreativityStore.choiceArr=arr;
	}
	newDsp(){
		this._creativityModal.openModal();
	}
	submit(){
		let {choiceArr}=adCreativityStore
		let arr=[],urlState=true;
		for(let i=0;i<choiceArr.length;i++){
			let obj= {
				leadCreative: {id: choiceArr[i].id},
				creativeName: choiceArr[i].name,
				deepLinkUrl: choiceArr[i].clickFallbackURL,
				landUrl: choiceArr[i].clickTargetURL,
				pvUrl: choiceArr[i].thirdShowMonitor,
				clickUrl: choiceArr[i].thirdClickMonitor,
				acState: 0,
				activeId: localStorage.getItem('findActivityId')
			}
			arr.push(obj)
			if(!Client.isUrl(choiceArr[i].clickTargetURL)){
				urlState=false
			}
		}
		if(urlState){
			Client.createObject('adv/saveCreative',arr).then(res=>{
				if(res.status==200){
					this.props.history.push({pathname:'/creativityList'})
					adCreativityStore.choiceArr=[];
				}else{
					Client.showTank(false,res.message)
				}
			})
		}else{
			Client.showTank(false,'请填写格式正确的落地页地址')
		}
	}
	render() {
		let {putInType,putInMedia,choiceArr}=adCreativityStore
		return (
			<div>
				<Layout history={this.props.history}/>
				<CreativityModal ref={e=>this._creativityModal=e}/>
				<div className="content">
					<div className="list-haed">
						<span className="dah1">
							适用广告类型与媒体
						</span>
					</div>
					<div className="contentBulk">
						<p>创意将在以下广告类型及媒体中投放，如需修改，请返回广告活动进行相应设置</p>
						<div className="accountListRow">
							<div className="form-left">
								 投放广告类型:
							</div>
							<div className="form-right" style={{lineHeight:'29px'}}>
								{Client.adTypeArrEffect(putInType)}
							</div>
						</div>
						<div className="accountListRow">
							<div className="form-left">
								投放媒体:
							</div>
							<div className="form-right" style={{lineHeight:'29px'}}>
								{putInMedia}
							</div>
						</div>
					</div>
					<div className="list-haed">
						<span className="dah1">
							创意上传
						</span>
					</div>
					<div className="contentBulk">
						<p>从创意库选择相应创意，点击确定完成创意关联</p>
						<div className="con-head">
							<div>
								<button className="borderBtn" onClick={()=>this.newDsp()}>从创意库选择</button>
								<button className="borderBtn" onClick={()=>this.removeItem()}>删除</button>
							</div>
						</div>
						<div className="table-head">
							<div  style={{width:'5%',float:'left',textAlign:'center'}}>
								<Checkbox onChange={this.onAllChange.bind(this)} checked={this.state.ids.length==choiceArr.length}/>
							</div>
							{
								headArr.map((i,k)=>(
									<div key={k} style={{width:i.w,float:'left',textAlign:'center'}}>
										{i.name}
									</div>
								))
							}
						</div>
						{choiceArr.map((i,k)=>(
							<div className="height-table-body" key={k}>
								<div className="heightGezi" style={{width:'5%',textOverflow:'none'}}>
									<Checkbox onChange={this.onOneChange.bind(this,i.id)} checked={this.state.ids.indexOf(i.id)>-1}/>
								</div>
								<div className="heightGezi" style={{width:headArr[0].w}}>{/*创意*/}
									{i.adSize.adType=='NATIVE'?(
										<div  className='native heightGezi flexCenter'
											  onClick={()=>{
												  this.props.history.push({
													  pathname:'/NativeCreative',
													  fileds:i
												  })
											  }}
										>
											原生创意预览
										</div>
									):null}
									{i.adSize.adType=='BANNER'||i.adSize.adType=='OPENSCREEN'||i.adSize.adType=='POPUP'&&i.fields?(
										<img src={Client.imgFile+(i.fields[0]?i.fields[0].value:null)}
											 onClick={()=>{
												 window.open(Client.imgFile+(i.fields[0]?i.fields[0].value:null), "_blank");
											 }}
											 alt="" style={{width:100,height:70}}/>
									):null}
									{i.adSize.adType=='VIDEO'&&i.fields?(
										<div  className='native heightGezi'
											  onClick={()=>{
												  window.open(Client.imgFile+(i.fields[0]?i.fields[0].value:null), "_blank");
											  }}
										>
											视频创意预览
										</div>
									):null}

								</div>
								<div className="heightGezi" style={{width:headArr[1].w}}>{/*创意名称*/}
									<input type="text"
										   className="border1"
										   style={{width:'90%'}}
										   value={i.name}
										   onChange={(e)=>{this.onInputChange(e,k,"name")}}
									/>
								</div>
								<div className="heightGezi" style={{width:headArr[2].w}}>{/*创意尺寸*/}
									{i.adSize.width+'x'+i.adSize.height}
								</div>
								<div className="heightGezi" style={{width:headArr[3].w}}>{/*素材规格*/}
									{i.adForm.creativeFormat}
								</div>
								<div className="heightGezi" style={{width:headArr[4].w}}>{/*DeepLink地址*/}
									<input type="text"
										   className="border1"
										   style={{width:'90%'}}
										   value={i.clickFallbackURL}
										   onChange={(e)=>{this.onInputChange(e,k,"clickFallbackURL")}}
									/>
								</div>
								<div className="heightGezi" style={{width:headArr[5].w}}>{/*落地页地址*/}
									<input type="text"
										   className="border1"
										   style={{width:'90%'}}
										   value={i.clickTargetURL}
										   onChange={(e)=>{this.onInputChange(e,k,"clickTargetURL")}}
									/>
								</div>
								<div className="heightGezi" style={{width:headArr[0].w}}>{/*曝光监测*/}
									<input type="text"
										   className="border1"
										   style={{width:'90%'}}
										   value={i.thirdShowMonitor?i.thirdShowMonitor:''}
										   onChange={(e)=>{this.onInputChange(e,k,"thirdShowMonitor")}}
									/>
								</div>
								<div className="heightGezi" style={{width:headArr[0].w}}>{/*点击监测*/}
									<input type="text"
										   className="border1"
										   style={{width:'90%'}}
										   value={i.thirdClickMonitor?i.thirdClickMonitor:''}
										   onChange={(e)=>{this.onInputChange(e,k,"thirdClickMonitor")}}
									/>
								</div>
								<div className="heightGezi" style={{width:headArr[0].w}}>{/*上传时间*/}
									{Client.formatDateTime(i.createTime)}
								</div>
							</div>
						))}
					</div>
					<div className="submit-content">
						<button className="cancelBtn" onClick={()=>this.cancel()}>取消</button>
						<button className="confirmBtn" onClick={()=>this.submit()}>确定</button>
					</div>
				</div>
			</div>
		)
	}
}
