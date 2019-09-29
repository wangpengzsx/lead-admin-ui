import React from "react";
import Layout from "../../../layout/Layout";
import Client from "../../../common/lead-api";
export default class AdMapSet extends React.Component {
	constructor(){
		super();
		this.state={
			mapObj:{},
			otherAppName:'',
			otherAppId:'',
			packName:'',
			resArr:[]
		}
	}
	componentWillMount(){
		Client.getNullArgument('strategy/getForMappingPage?strategyId='+localStorage.getItem('strategyId1')).then(res=>{
			let arr=[];
			if(res.APP_ID){
				arr=res.ADSPACELIST;
				for(let i=0;i<arr.length;i++){
					arr[i].spaceName='';
					arr[i].spaceId='';
					arr[i].width='';
					arr[i].height='';
				}
			}else{
				arr=[{typeName:'banner广告',adType:'BANNER'},
					{typeName:'开屏广告',adType:'OPENSCREEN'},
					{typeName:'插屏广告',adType:'POPUP'},
					{typeName:'原生广告',adType:'NATIVE'},
					{typeName:'视频广告',adType:'VIDEO'}]
				for(let i=0;i<arr.length;i++){
					arr[i].spaceName='';
					arr[i].spaceId='';
					arr[i].width='';
					arr[i].height='';
				}
			}
			this.setState({
				mapObj:res,
				resArr:arr
			})
			let appid='';
			if(res.APP_ID){
				appid='@'+res.APP_ID
			}else{
				appid='#'+res.GROUP_ID
			}
			this.initValue(res.FALLBACKDSP_ID,appid)
		})
	}
	initValue(fallId,appid){
		let str=''
		if(appid.slice(0,1)=='@'){
			str='&appId='+appid.slice(1);
		}else{
			str='&groupId='+appid.slice(1);
		}
		Client.searchType('strategy/findAllByDspIdAndOurAppId?fallBackId='+fallId+str).then(res=>{
			let arr=this.state.resArr;
			for(let i=0;i<arr.length;i++){
				for(let h=0;h<res.length;h++){
					if(res[h].adSpaceId!=null){
						if(res[h].adSpaceId==arr[i].AD_SPACE_ID){
							this.setState({
								otherAppId:this.isNull(res[h].appId),
								packName:this.isNull(res[h].packageName),
								otherAppName:this.isNull(res[h].appName)
							})
							arr[i].spaceId=this.isNull(res[h].posId);
							arr[i].width=this.isNull(res[h].posWidth);
							arr[i].height=this.isNull(res[h].posHeight);
							arr[i].spaceName=this.isNull(res[h].posName);
						}
					}else{
						if(arr[i].adType==res[h].adType){
							this.setState({
								otherAppId:this.isNull(res[h].appId),
								packName:this.isNull(res[h].packageName),
								otherAppName:this.isNull(res[h].appName)
							})
							arr[i].spaceId=this.isNull(res[h].posId);
							arr[i].width=this.isNull(res[h].posWidth);
							arr[i].height=this.isNull(res[h].posHeight);
							arr[i].spaceName=this.isNull(res[h].posName);
						}
					}
				}
			}
			this.setState({
				resArr:arr
			})
		})
	}
	isNull(item){
		return item==null?'':item
	}
	confirm(){
		let mapArr=this.state.resArr;
		let arr=[];
		for(let i=0;i<mapArr.length;i++){
			let obj={}
			if(this.state.mapObj.APP_ID){
				obj={
					ourAppId:this.state.mapObj.APP_ID,
					dspId:this.state.mapObj.FALLBACKDSP_ID,
					adSpaceId:mapArr[i].AD_SPACE_ID,
					posName:mapArr[i].spaceName,
					appId:this.state.otherAppId,
					posId:mapArr[i].spaceId,
					appName:this.state.otherAppName,
					packageName:this.state.packName,
					posWidth:mapArr[i].width,
					posHeight:mapArr[i].height,
				}
			}else{
				obj={
					ourGroupId:this.state.mapObj.GROUP_ID,
					dspId:this.state.mapObj.FALLBACKDSP_ID,
					posName:mapArr[i].spaceName,
					appName:this.state.otherAppName,
					adType:mapArr[i].adType,
					appId:this.state.otherAppId,
					posId:mapArr[i].spaceId,
					packageName:this.state.packName,
					posWidth:mapArr[i].width,
					posHeight:mapArr[i].height,
				}
			}
			arr.push(obj)
		}
		Client.createObject('strategy/saveLeadFallbackDspConfigAll',arr).then(res=>{
			if(res.status==200){
				this.props.history.push({pathname:'/putInStrategyManage'});
			}
		})
	}
	onInputChange(e,i,item){
		let arr=this.state.resArr;
		arr[i][item]=e.target.value;
		this.setState({resArr:arr})
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
					</div>
					<div className="contentBulk" style={{padding:10}}>
						<div className="accountListRow" >
							<div className="form-left" style={{width:'30%'}}>
								广告投放平台名称：
							</div>
							<div className="form-right-multiple" style={{width:'68%'}} >
								{this.state.mapObj.FALLBACKDSP_NAME}
							</div>
						</div>
						<div className="accountListRow" >
							<div className="form-left" style={{width:'30%'}}>
								打底广告投放策略名称：
							</div>
							<div className="form-right-multiple" style={{width:'68%'}} >
								{this.state.mapObj.STRATEGY_NAME}
							</div>
						</div>
						<div className="accountListRow" >
							<div className="form-left" style={{width:'30%'}}>
								媒体名称：
							</div>
							<div className="form-right-multiple" style={{width:'68%'}} >
								{this.state.mapObj.APP_NAME?this.state.mapObj.APP_NAME:this.state.mapObj.GROUP_NAME}
							</div>
						</div>
						<div className="accountListRow" >
							<div className="form-left" style={{width:'30%'}}>
								APPid：
							</div>
							<div className="form-right-multiple" style={{width:'68%'}} >
								{this.state.mapObj.APP_ID?this.state.mapObj.APP_ID:this.state.mapObj.GROUP_ID}
							</div>
						</div>
						<div className="accountListRow" >
							<div className="form-left" style={{width:'30%'}}>
								第三方广告平台应用名称：
							</div>
							<div className="form-right-multiple" style={{width:'68%'}} >
								<input className="border1"
									   value={this.state.otherAppName}
									   onChange={(e)=>{this.setState({otherAppName: e.target.value})}}
									   type="text"/>
								<i className="color1">请填写该媒体在第三方广告平台对应的应用名称</i>
							</div>
						</div>
						<div className="accountListRow" >
							<div className="form-left" style={{width:'30%'}}>
								第三方广告平台APPid：
							</div>
							<div className="form-right-multiple" style={{width:'68%'}} >
								<input className="border1"
									   value={this.state.otherAppId}
									   onChange={(e)=>{this.setState({otherAppId: e.target.value})}}
									   type="text"/>
								<i className="color1">请填写该媒体在第三方广告平台对应的APPid</i>
							</div>
						</div>
						<div className="accountListRow" >
							<div className="form-left" style={{width:'30%'}}>
								包名：
							</div>
							<div className="form-right-multiple" style={{width:'68%'}} >
								<input className="border1"
									   value={this.state.packName}
									   onChange={(e)=>{this.setState({packName: e.target.value})}}
									   type="text"/>
								<i className="color1">请填写该应用包名</i>
							</div>
						</div>
						{this.state.mapObj.APP_ID?this.state.resArr.map((i,k)=>(
							<div key={k}>
								<div className="accountListRow" >
									<div className="form-left" style={{width:'30%'}}>
										广告位名称：
									</div>
									<div className="form-right-multiple" style={{width:'68%'}} >
										{i.AD_SPACE_NAME}
									</div>
								</div>
								<div className="accountListRow" >
									<div className="form-left" style={{width:'30%'}}>
										广告位id：
									</div>
									<div className="form-right-multiple" style={{width:'68%'}} >
										{i.AD_SPACE_ID}
									</div>
								</div>
								<div className="accountListRow" >
									<div className="form-left" style={{width:'30%'}}>
										第三方广告平台广告位名称：
									</div>
									<div className="form-right-multiple" style={{width:'68%'}} >
										<input className="border1"
											  value={i.spaceName}
											  onChange={(e)=>this.onInputChange(e,k,'spaceName')}
											  type="text"/>
										<i className="color1">请填写该广告位在第三方广告平台对应的广告位名称</i>
									</div>
								</div>
								<div className="accountListRow" >
									<div className="form-left" style={{width:'30%'}}>
										第三方广告平台广告位id：
									</div>
									<div className="form-right-multiple" style={{width:'68%'}} >
										<input className="border1"
											   value={i.spaceId}
											   onChange={(e)=>this.onInputChange(e,k,'spaceId')}
											   type="text"/>
										<i className="color1">请填写该广告位在第三方广告平台对应的广告位id</i>
									</div>
								</div>
								<div className="accountListRow" >
									<div className="form-left" style={{width:'30%'}}>
										第三方广告平台广告位尺寸：
									</div>
									<div className="form-right-multiple" style={{width:'68%'}} >
										<input
											type="text"
											placeholder="宽度"
											value={i.width}
											className='border1 width-100'
											onChange={(e)=>this.onInputChange(e,k,'width')}
										/>*&nbsp;&nbsp;
										<input
											type="text"
											placeholder="高度"
											value={i.height}
											className='border1 width-100'
											onChange={(e)=>this.onInputChange(e,k,'height')}
										/>
										<i className="color1">请填写该广告位在第三方广告平台对应的广告位尺寸</i>
									</div>
								</div>
							</div>
						)):this.state.resArr.map((i,k)=>(
							<div key={k}>
								<div className="accountListRow" >
									<div className="form-left" style={{width:'30%'}}>
										广告位名称：
									</div>
									<div className="form-right-multiple" style={{width:'68%'}} >
										{i.typeName}
									</div>
								</div>
								<div className="accountListRow" >
									<div className="form-left" style={{width:'30%'}}>
										第三方广告平台广告位名称：
									</div>
									<div className="form-right-multiple" style={{width:'68%'}} >
										<input className="border1"
											   value={i.spaceName}
											   onChange={(e)=>this.onInputChange(e,k,'spaceName')}
											   type="text"/>
										<i className="color1">请填写该广告位在第三方广告平台对应的广告位名称</i>
									</div>
								</div>
								<div className="accountListRow" >
									<div className="form-left" style={{width:'30%'}}>
										第三方广告平台广告位id：
									</div>
									<div className="form-right-multiple" style={{width:'68%'}} >
										<input className="border1"
											   value={i.spaceId}
											   onChange={(e)=>this.onInputChange(e,k,'spaceId')}
											   type="text"/>
										<i className="color1">请填写该广告位在第三方广告平台对应的广告位id</i>
									</div>
								</div>
								<div className="accountListRow" >
									<div className="form-left" style={{width:'30%'}}>
										第三方广告平台广告位尺寸：
									</div>
									<div className="form-right-multiple" style={{width:'68%'}} >
										<input
											type="text"
											placeholder="宽度"
											value={i.width}
											className='border1 width-100'
											onChange={(e)=>this.onInputChange(e,k,'width')}
										/>*&nbsp;&nbsp;
										<input
											type="text"
											placeholder="高度"
											value={i.height}
											className='border1 width-100'
											onChange={(e)=>this.onInputChange(e,k,'height')}
										/>
										<i className="color1">请填写该广告位在第三方广告平台对应的广告位尺寸</i>
									</div>
								</div>
							</div>
						))}
					</div>
					<div className="submit-content">
						<button className="cancelBtn" onClick={()=>this.props.history.push({pathname:'/putInStrategyManage'})}>取消</button>
						<button className="confirmBtn" onClick={this.confirm.bind(this)}>
							确定
						</button>
					</div>
				</div>
			</div>
		)
	}
}
