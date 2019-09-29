import React from "react";
import Layout from "../../../layout/Layout";
import {Checkbox,Pagination,Radio,DatePicker,Switch} from "antd";
import {Link} from "react-router-dom";
import CreativesManageStore from "../../../mobx/generalizeSupport/creatives-manage-store";
import GeneralizeManageStore from "../../../mobx/generalizeSupport/generalize-manage-store";
import {observer} from "mobx-react";
import Client from "../../../common/lead-api";
import EditNameModal from "./Modal/EditNameModal";
import EditUrlModal from "./Modal/EditUrlModal";
import ChakanAdSpaceMomal from "./Modal/ChakanAdSpaceMomal";
import moment from "moment";
const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;
const plainOptions = [ {label:'Banner',value:'BANNER'},
	{label:'开屏广告',value:'OPENSCREEN'},
	{label:'插屏广告',value:'POPUP'},
	{label:'原生广告',value:'NATIVE'},
	{label:'视频广告',value:'VIDEO'}];
const matterOptions = [ 'JPG', 'PNG','GIF','MP4','FLV'];
const headArr=[
	{name:'创意id',w:'8%'},
	{name:'创意',w:'8%'},
	{name:'创意名称',w:'8%'},
	{name:'创意尺寸',w:'8%'},
	{name:'创意状态',w:'8%'},
	{name:'广告位类型',w:'8%'},
	{name:'素材规格',w:'8%'},
	{name:'到达地址',w:'8%'},
	{name:'点击后效果',w:'8%'},
	{name:'上传时间',w:'8%'},
	{name:'创意支持的广告位',w:'8%'},
	{name:'操作',w:'8%'},
];
@observer
export default class GeneralizeMaterial extends React.Component {
	constructor(){
		super()
		this.state={
			adType:'',
			value:1,
			duoArr:[],
			show:false,
			size:10,
			page:1,
			allTypeState:this.verifyBoo(localStorage.getItem("allTypeState")),
			choiceTypes:this.verifyArr(localStorage.getItem("choiceTypes")),
			allFormatState:this.verifyBoo(localStorage.getItem("allFormatState")),
			choiceFormats:this.verifyArr(localStorage.getItem("choiceFormats")),
			statusState:this.stateArr(localStorage.getItem("statusState")),
			allSizeState:this.verifyBoo(localStorage.getItem("allSizeState")),
			choiceSizes:this.verifyArr(localStorage.getItem("choiceSizes")),
			ids:[],
			juluids:[],
			searchText:'',
			time:this.verifyArr(localStorage.getItem('time')),
			mouseId:'',
		}
	}
	verifyBoo(item){
		return item?item=="true":true
	}
	verifyArr(item){
		if(item){
			if(item.split(',')==''){
				return [];
			}else{
				return item.split(',')
			}
		}else{
			return [];
		}
	}
	stateArr(item){
		if(item){
			if(item.split(',')==''){
				return ['ONLINE','OFFLINE'];
			}else{
				return item.split(',')
			}
		}else{
			return ['ONLINE','OFFLINE'];
		}
	}

	componentWillMount(){
		GeneralizeManageStore.getAdSpaceSizes()
		CreativesManageStore.searchCreativesArr(this.state.size,this.state.page,{adType:this.state.choiceTypes,
			format:this.state.choiceFormats,
			status:this.state.statusState,
			size:this.state.choiceSizes,
			name:this.state.searchText,
			time:this.state.time
		});
	}
	componentDidMount(){
		setTimeout(()=>{
			let {adSizes}=GeneralizeManageStore;
			this.setState({
				duoArr:adSizes.slice(0,7)
			})
		},500)
	}
	onAllChange(e) {
		let {CreativesArr} = CreativesManageStore;
		let arr = []
		if (e.target.checked) {
			for (let i = 0; i < CreativesArr.length; i++) {
				arr.push(CreativesArr[i].id)
			}
		}
		this.setState({
			ids:arr
		})
	}
	onDateChange(e){
		if(e){
			this.setState({
				time:[e.format('YYYY-MM-DD')]
			})
		}else{
			this.setState({
				time:[null]
			})
		}
	}
	onOneChange(id){
		let arr=this.state.ids;
		if(arr.indexOf(id)>-1){
			let index=arr.indexOf(id);
			if (index > -1) {
				arr.splice(index, 1);
			}
		}else{
			arr.push(id);
		}
		this.setState({
			ids:arr
		})
	}
	onPageChange(e){
		this.setState({
			page:e
		})
		CreativesManageStore.searchCreativesArr(this.state.size,e,{adType:this.state.choiceTypes,
			format:this.state.choiceFormats,
			status:this.state.statusState,
			size:this.state.choiceSizes,
			time:this.state.time,
			name:this.state.searchText
		});
	}
	onShowSizeChange(current, pageSize){
		this.setState({
			size:pageSize
		})
		CreativesManageStore.searchCreativesArr(pageSize,this.state.page,{adType:this.state.choiceTypes,
			format:this.state.choiceFormats,
			status:this.state.statusState,
			size:this.state.choiceSizes,
			name:this.state.searchText,
			time:this.state.time
		});
	}
	toggleall(){
		let {adSizes}=GeneralizeManageStore;
		this.setState({show:!this.state.show})
		if(!this.state.show){
			this.setState({
				duoArr:adSizes
			})
		}else{
			this.setState({
				duoArr:adSizes.slice(0,7)
			})
		}
	}
	editName(){
		this._editModal.openModal(this.state.ids)
	}
	editUrl(){
		this._editUrlModal.openModal(this.state.ids)
	}
	searchCreative(){
		setTimeout(()=>{
			CreativesManageStore.searchCreativesArr(this.state.size,this.state.page,{adType:this.state.choiceTypes,
				format:this.state.choiceFormats,
				status:this.state.statusState,
				size:this.state.choiceSizes,
				name:this.state.searchText,
				time:this.state.time
			});
		},300)
	}
	onTypeChange(e){
		this.setState({
			choiceTypes:e
		})
		if(e.length>0){
			this.setState({
				allTypeState:false
			})
		}else{
			this.setState({
				allTypeState:true
			})
		}
	}
	onAllTypeChange(e){
		this.setState({
			allTypeState:e.target.checked
		})
		if(e.target.checked){
			this.setState({
				choiceTypes:[]
			})
		}
	}
	onFormatChange(e){
		this.setState({
			choiceFormats:e
		})
		if(e.length>0){
			this.setState({
				allFormatState:false
			})
		}else{
			this.setState({
				allFormatState:true
			})
		}
	}
	onAllFormatChange(e){
		this.setState({
			allFormatState:e.target.checked
		})
		if(e.target.checked){
			this.setState({
				choiceFormats:[]
			})
		}
	}
	onStatusChange(e){
		if(e.target.value=='All'){
			this.setState({
				statusState:['ONLINE','OFFLINE']
			})
		}else{
			this.setState({
				statusState:[e.target.value]
			})
		}
	}
	onAllSizeChange(e){
		this.setState({
			allSizeState:e.target.checked
		})
		if(e.target.checked){
			this.setState({
				choiceSizes:[]
			})
		}
	}
	onSizeChange(e){
		let arr=this.state.choiceSizes;
		if(arr.indexOf(e.target.value)>-1){
			let index=arr.indexOf(e.target.value);
			if (index > -1) {
				arr.splice(index, 1);
			}
		}else{
			arr.push(e.target.value);
		}
		this.setState({
			choiceSizes:arr
		})
		if(arr.length>0){
			this.setState({
				allSizeState:false
			})
		}else{
			this.setState({
				allSizeState:true
			})
		}
	}
	filtrate(){
		this.searchCreative();
	}
	openStatus(){
		CreativesManageStore.changeCreativesArr({ids: this.state.ids, field: "creativeState", value: "ONLINE"});
		this.searchCreative()
	}
	closeStatus(){
		CreativesManageStore.changeCreativesArr({ids: this.state.ids, field: "creativeState", value: "OFFLINE"});
		this.searchCreative()
	}
	removeItem(){
		CreativesManageStore.changeCreativesArr({ids: this.state.ids, field: "creativeState", value: "DELETE"});
		this.searchCreative()
	}
	onSwitchChange(state,id){
		CreativesManageStore.changeCreativesArr({ids: [id], field: "creativeState", value: state=='ONLINE'?"OFFLINE":"ONLINE"});
		this.searchCreative()
	}
	chakan(i){
		this._chakanAdSpaceMomal.openModal(i.adForm.id,i.adSize.width+'*'+i.adSize.height)
	}
	searchChange(e){
		this.setState({
			searchText:e.target.value
		})
	}
	clickSearch(){
		CreativesManageStore.searchCreativesArr(this.state.size,this.state.page,{adType:this.state.choiceTypes,
			format:this.state.choiceFormats,
			status:this.state.statusState,
			size:this.state.choiceSizes,
			name:this.state.searchText,
			time:this.state.time
		});
	}
	setCreativeId(id){
		localStorage.setItem('editCreative',id);
	}
	render() {
		let {CreativesArr,total}=CreativesManageStore;
		localStorage.setItem("allFormatState",this.state.allFormatState);
		localStorage.setItem("choiceFormats",this.state.choiceFormats);
		localStorage.setItem("statusState",this.state.statusState);
		localStorage.setItem("allSizeState",this.state.allSizeState);
		localStorage.setItem("choiceSizes",this.state.choiceSizes);
		localStorage.setItem("choiceTypes",this.state.choiceTypes);
		localStorage.setItem("allTypeState",this.state.allTypeState);
		localStorage.setItem("time",this.state.time);
		return (
			<div>
				<Layout history={this.props.history}/>
				<div className="content">
					<EditNameModal ref={(e) => this._editModal = e} editChange={()=>this.searchCreative()}/>
					<EditUrlModal ref={(e) => this._editUrlModal = e} editChange={()=>this.searchCreative()}/>
					<ChakanAdSpaceMomal ref={(e)=>this._chakanAdSpaceMomal =e}/>
					<div className="list-haed">
						<span className="dah1">
							筛选条件
						</span>
					</div>
					<div className="contentBulk">
						<div className="accountListRow">
							<div className="form-left">
								广告位类型:
							</div>
							<div className="form-right">
								<Checkbox onChange={(e)=>this.onAllTypeChange(e)}
										  checked={this.state.allTypeState}
										  style={{marginRight:20}}>全部</Checkbox>
								<CheckboxGroup options={plainOptions} value={this.state.choiceTypes} onChange={(e)=>this.onTypeChange(e)} />
							</div>
						</div>
						<div className="accountListRow">
							<div className="form-left">
								素材规格:
							</div>
							<div className="form-right">
								<Checkbox onChange={(e)=>this.onAllFormatChange(e)}
										  checked={this.state.allFormatState}
										  style={{marginRight:20}}>全部</Checkbox>
								<CheckboxGroup options={matterOptions}
											   value={this.state.choiceFormats}
											   onChange={(e)=>this.onFormatChange(e)} />
							</div>
						</div>
						<div className="accountListRow">
							<div className="form-left">
								创意状态:
							</div>
							<div className="form-right">
								<RadioGroup onChange={(e)=>this.onStatusChange(e)}
											value={this.state.statusState.length==1?this.state.statusState[0]:'All'}>
									<Radio value='All'>全部</Radio>
									<Radio value='ONLINE'>开启</Radio>
									<Radio value='OFFLINE'>关闭</Radio>
								</RadioGroup>
							</div>
						</div>
						<div className="accountListRow">
							<div className="form-left">
								创意尺寸:
							</div>
							<div className="form-right">
								<Checkbox onChange={(e)=>this.onAllSizeChange(e)}
								checked={this.state.allSizeState}>全部</Checkbox>
							</div>
						</div>
						<div className="accountListRow" style={{height:'auto'}}>
							<div className="form-left">
							</div>
							<div className="form-right" style={{height:'auto',flexWrap: 'wrap'}}>
								{this.state.duoArr.map((i,k)=>(
									<div key={k} style={{width:130,height:30}}>
										<Checkbox onChange={(e)=>this.onSizeChange(e)}
												  checked={this.state.choiceSizes.indexOf(i.width+'*'+i.height)>-1}
												  value={i.width+'*'+i.height} >{i.width}×{i.height}</Checkbox>
									</div>
								))}
							</div>
							<a onClick={()=>this.toggleall()}>
								{this.state.show?'收起':'展开'}
							</a>
						</div>
						<div className="accountListRow">
							<div className="form-left">
								创意上传时间:
							</div>
							<div className="form-right">
								<DatePicker
									value={this.state.time[0]?moment(this.state.time[0],'YYYY-MM-DD'):null}
									onChange={this.onDateChange.bind(this)} />
							</div>
						</div>

					</div>
					<div style={{paddingBottom:10}}>
						<button className="filtrateBtn" onClick={()=>this.filtrate()}>
							查询
						</button>
					</div>
					<div className="contentBulk1" style={{overflow:'inherit'}}>
						<div className="con-head">
							<div>
								<button className="borderBtn" onClick={()=>this.props.history.push({pathname:'/uploadingOriginality'})}>上传创意</button>
								<button className="borderBtn" onClick={()=>this.openStatus()}>开启</button>
								<button className="borderBtn" onClick={()=>this.closeStatus()}>关闭</button>
								<button className="borderBtn" onClick={()=>this.removeItem()}>删除</button>
								<button className="borderBtn" onClick={()=>this.editName()}>修改创意名称</button>
								<button className="borderBtn" onClick={()=>this.editUrl()}>修改到达地址</button>
							</div>
							<div className="searchInput">
								<input type="text"
									   placeholder="请输入查询的名称和关键字"
									   onChange={(e)=>this.searchChange(e)}
									   className='searchInputText'/>
								<div className='searchInputButton' onClick={()=>this.clickSearch()}></div>
							</div>
						</div>
						<div className="table-head">
							<div  style={{width:'4%',float:'left',textAlign:'center'}}>
								<Checkbox onChange={(e)=>this.onAllChange(e)} checked={this.state.ids.length==CreativesArr.length}/>
							</div>
							{
								headArr.map((i,k)=>(
									<div key={k} style={{width:i.w,float:'left',textAlign:'center'}}>
										{i.name.length>5?i.name.slice(0,4)+'...':i.name}
									</div>
								))
							}
						</div>
						{
							CreativesArr.map((i,k)=>(
								<div className="height-table-body" key={k} style={{background:k%2==0?'#fff':'#fafafa'}}>
									<div className="heightGezi" style={{width:'4%'}}>
										<Checkbox onChange={()=>this.onOneChange(i.id)} checked={this.state.ids.indexOf(i.id)>-1}/>
									</div>
									<div className="heightGezi" title={i.id} style={{width:headArr[0].w}}>
										{i.id}
									</div>
									<div className="heightGezi flexCenter" style={{width:headArr[1].w, overflow:'inherit'}}>
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
									<div className="heightGezi" title={i.name} style={{width:headArr[2].w}}>
										{i.name}
									</div>
									<div className="heightGezi" title={i.width+'x'+i.height} style={{width:headArr[3].w}}>
										{i.width}x{i.height}
									</div>
									<div className="heightGezi" style={{width:headArr[4].w}}>
										<Switch checkedChildren="开" unCheckedChildren="关" checked={i.creativeState=='ONLINE'} onChange={()=>this.onSwitchChange(i.creativeState,i.id)}/>
									</div>
									<div className="heightGezi" title={Client.adTypeEffect(i.adSize.adType)} style={{width:headArr[5].w}}>
										{Client.adTypeEffect(i.adSize.adType)}
									</div>
									<div className="heightGezi" title={i.creativeFormat} style={{width:headArr[6].w}}>
										{i.adForm.creativeFormat}
									</div>
									<div className="heightGezi" title={i.clickTargetURL} style={{width:headArr[7].w}}>
										{i.clickTargetURL}
									</div>
									<div className="heightGezi" title={Client.effect(i.clickAction)} style={{width:headArr[8].w}}>
										{Client.effect(i.clickAction)}
									</div>
									<div className="heightGezi" title={Client.formatDateTime(i.modifyTime)} style={{width:headArr[9].w}}>
										{Client.formatDateTime(i.modifyTime)}
									</div>
									<div className="heightGezi flexCenter" style={{width:headArr[10].w}}>
										<button className="borderBtn" style={{minWidth:66,lineHeight:0}} onClick={()=>this.chakan(i)}>查看</button>
									</div>
									<div className="heightGezi" style={{width:headArr[11].w}}>
										<Link to={{pathname:'/editCreative',id:i.id}} onClick={()=>this.setCreativeId(i.id)}>
											编辑
										</Link>
									</div>
								</div>
							))
						}
						<div className='con-head'>
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
