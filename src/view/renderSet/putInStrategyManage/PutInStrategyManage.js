import React from "react";
import {Checkbox,Switch,Pagination} from 'antd';
import Layout from "../../../layout/Layout";
import LabelSelect from "./component/LabelSelect";
import LabelSelect1 from "./component/LabelSelect1";
import {observer} from "mobx-react";
import putInStrategyStore from "../../../mobx/renderSet/PutInStrategyManage/putIn-strategy-store";
import addPutInStrategyStore from "../../../mobx/renderSet/PutInStrategyManage/add-putin-strategy-store"
import dspManageStore from "../../../mobx/dspManage/DSPManageStore/dsp-manage-store"
import Client from "../../../common/lead-api"
const typeArr = [
	{name:'全部',value:''},
	{name: 'banner广告', value: 'BANNER'},
	{name: '插屏广告', value: 'POPUP'},
	{name: '开屏广告', value: 'OPENSCREEN'},
	{name: '原生广告', value: 'NATIVE'},
	{name: '视频广告', value: 'VIDEO'}
]
const stateArr = [
	{name:'全部',value:''},
	{name:'开启',value:'0'},
	{name:'关闭',value:'1'},
]
const headArr=[
	{name:'广告投放平台',w:'10.6%'},
	{name:'投放策略名称',w:'10.6%'},
	{name:'状态',w:'10.6%'},
	{name:'广告映射关系设置',w:'10.6%'},
	{name:'固定出价设置',w:'10.6%'},
	{name:'投放媒体',w:'10.6%'},
	{name:'投放广告类型',w:'10.6%'},
	{name:'最后修改时间',w:'10.6%'},
	{name:'操作',w:'10.6%'},
];
@observer
export default class PutInStrategyManage extends React.Component {
	constructor(props){
		super(props)
		this.state={
			adValue:localStorage.getItem('fallbackId')?localStorage.getItem('fallbackId'):'',
			mediaValue:'',
			typeValue:'',
			stateValue:'',
			page:localStorage.getItem('putInPage')?parseInt(localStorage.getItem('putInPage')):1,
			pageSize:10,
			choiceArr:[]
		}
	}
	componentWillMount(){
		localStorage.removeItem('strategyId')
		putInStrategyStore.getFallbackArr();
		putInStrategyStore.getMediaArr();
		putInStrategyStore.getStratgyArr(this.state.adValue,'','','','',this.state.page,this.state.pageSize)
	}
	selectCallback(e,c){
		this.setState({[e]:c})
	}
	query(){
		setTimeout(()=>{
			let {adValue,mediaValue,stateValue,typeValue,page,pageSize}=this.state;
			if(mediaValue.slice(0,1)=='@'){
				putInStrategyStore.getStratgyArr(adValue,mediaValue.slice(1),'',stateValue,typeValue,page,pageSize)
			}else if(mediaValue.slice(0,1)=='#'){
				putInStrategyStore.getStratgyArr(adValue,'',mediaValue.slice(1),stateValue,typeValue,page,pageSize)
			}else{
				putInStrategyStore.getStratgyArr(adValue,'','',stateValue,typeValue,page,pageSize)
			}
		},300)
	}
	clickQuery(){
		this.setState({
			page:1
		})
		this.query();
	}
	createStrategy(){
		this.props.history.push({pathname:'/AddPutInStrategy'})
		localStorage.setItem('pathname','/AddPutInStrategy');
		this.clearStore();
	}
	clearStore(){
		addPutInStrategyStore.value1= '请选择';
		addPutInStrategyStore.value2= '';
		addPutInStrategyStore.value3= '请选择';
		addPutInStrategyStore.value4= [];
		addPutInStrategyStore.state1= 'no';
		addPutInStrategyStore.inputValue= '';
		addPutInStrategyStore.state5= 'no';
		addPutInStrategyStore.modalState5= '';
		addPutInStrategyStore.value5= '';
		addPutInStrategyStore.state6= 'no';
		addPutInStrategyStore.modalState6= '';
		addPutInStrategyStore.value6= '';
		addPutInStrategyStore.dateState= 'no';
		addPutInStrategyStore.startTime= '';
		addPutInStrategyStore.endTime= '';
		addPutInStrategyStore.excludeDates= [];
		dspManageStore.state1 = 'no';//时段单选状态
		dspManageStore.timeDuan = [];//时段选择数组
		dspManageStore.state2 = 'no';//地域单选状态
		dspManageStore.choiceArr = [];//地域选择数组
		dspManageStore.excludeArr = [];//地域排除数组
		dspManageStore.initChoiceArr = [];//地域初始化选择数组
		dspManageStore.initExcludeArr = [];//地域初始化排除数组
		dspManageStore.state7 = 'no';//设备单选状态
		dspManageStore.equChoiceArr = [];//设备选择数组
		dspManageStore.equExcludeArr = [];//设备排除数组
		dspManageStore.initEquChoiceArr = [];//设备初始化选择数组
		dspManageStore.initEquExcludeArr = [];//设备初始化排除数组
		putInStrategyStore.disableArr=[];
	}
	openItem(){
		Client.getNullArgument('strategy/updateState?ids='+this.state.choiceArr.join()+'&state='+0).then(res=>{
			this.query()
		})
	}
	closeItem(){
		Client.getNullArgument('strategy/updateState?ids='+this.state.choiceArr.join()+'&state='+1).then(res=>{
			this.query()
		})
	}
	deleteItem(){
		Client.getNullArgument('strategy/updateState?ids='+this.state.choiceArr.join()+'&state='+-1).then(res=>{
			this.query()
		})
	}
	onAllChange(e){
		let {stratgyArr}=putInStrategyStore
		let arr=[];
		stratgyArr.map(i=>{arr.push(i.id)})
		let arr1=[];
		if(e.target.checked){
			arr1=arr;
		}else{
			arr1=[];
		}
		this.setState({
			choiceArr:arr1
		})
	}
	onOneChange(id){
		let arr=this.state.choiceArr;
		if(arr.indexOf(id)>-1){
			let index=arr.indexOf(id);
			if (index > -1) {
				arr.splice(index, 1);
			}
		}else{
			arr.push(id);
		}
		this.setState({
			choiceArr:arr
		})
	}
	onSwitchChange(e,id){
		if(e){
			Client.getNullArgument('strategy/updateState?ids='+id+'&state='+0).then(res=>{
				this.query()
			})
		}else{
			Client.getNullArgument('strategy/updateState?ids='+id+'&state='+1).then(res=>{
				this.query()
			})
		}
	}
	skipAdMap(id){
		this.props.history.push('/adMapSet')
		localStorage.setItem('strategyId1',id);
	}
	skipBid(id){
		this.props.history.push('/fixedBidSet')
		localStorage.setItem('strategyId1',id);
	}
	onPageChange(e){
		localStorage.setItem('putInPage',e)
		this.setState({
			page:e
		})
		this.query()
	}
	onShowSizeChange(e,c){
		this.setState({
			page:e,
			pageSize:c
		})
		this.query()
	}
	strSlice(str){
		return str.slice(0,5)+'~'+str.slice(str.length-5)
	}
	aaa(j){
		return this.add(j)+":00~"+this.add(j+1)+":00"
	}
	add(j){
		if(j<10){
			j="0"+j;
		}
		return j;
	}
	skipflow(id){
		Client.searchType('strategy/findAllById?id='+id).then(res=>{
			localStorage.setItem('zongArr',JSON.stringify(res));
			if(res.strategyStart!=''&&res.strategyEnd!=''&&res.strategyStart!=null&&res.strategyEnd!=null){
				addPutInStrategyStore.dateState='yes';
			}else{
				addPutInStrategyStore.dateState='no';
			}
			if(res.strategyStart!=''&&res.strategyStart!=null){
				addPutInStrategyStore.startTime=res.strategyStart.slice(0,10)
			}
			if(res.strategyEnd!=''&&res.strategyEnd!=null){
				addPutInStrategyStore.endTime=res.strategyEnd.slice(0,10)
			}
			let DateArr=[];
			for(let i=0;i<res.excludeDates.length;i++){
				DateArr.push(res.excludeDates[i].slice(0,10))
			}
			addPutInStrategyStore.excludeDates=DateArr
			addPutInStrategyStore.value1=res.leadFallbackDsp.id
			addPutInStrategyStore.value2=res.name
			if(res.leadApp){
				addPutInStrategyStore.value3='@'+res.leadApp.id
				putInStrategyStore.getAdTypeList(res.leadFallbackDsp.id,res.leadApp.id,'',res.id)
			}else{
				addPutInStrategyStore.value3='#'+res.leadAppGroup.id
				putInStrategyStore.getAdTypeList(res.leadFallbackDsp.id,'',res.leadAppGroup.id,res.id)
			}
			if(res.choiceCity.length>0||res.excludeCity.length>0){
				dspManageStore.state2='yes'
			}else{
				dspManageStore.state2='no'
			}
			dspManageStore.choiceArr=res.choiceCity;
			dspManageStore.excludeArr=res.excludeCity;
			if(res.choiceDevice.length>0||res.excludeDevice.length>0){
				dspManageStore.state7='yes'
			}else{
				dspManageStore.state7='no'
			}
			dspManageStore.equChoiceArr=res.choiceDevice;
			dspManageStore.equExcludeArr=res.excludeDevice;
			if(res.choiceAppVersion){
				addPutInStrategyStore.modalState5='0'
				addPutInStrategyStore.value5=res.choiceAppVersion
				addPutInStrategyStore.state5='yes'
			}
			if(res.excludeAppVersion){
				addPutInStrategyStore.modalState5='1'
				addPutInStrategyStore.value5=res.excludeAppVersion;
				addPutInStrategyStore.state5='yes'
			}
			if(!res.choiceAppVersion&&!res.excludeAppVersion){
				addPutInStrategyStore.state5='no'
				addPutInStrategyStore.modalState5=''
				addPutInStrategyStore.value5=''
			}
			if(res.choiceImei){
				addPutInStrategyStore.state6='yes'
				addPutInStrategyStore.modalState6='0'
				addPutInStrategyStore.value6=res.choiceImei
			}
			if(res.excludeImei){
				addPutInStrategyStore.state6='yes'
				addPutInStrategyStore.modalState6='1'
				addPutInStrategyStore.value6=res.excludeImei
			}
			if(!res.choiceImei&&!res.excludeImei){
				addPutInStrategyStore.state6='no'
				addPutInStrategyStore.modalState6=''
				addPutInStrategyStore.value6=''
			}
			let arr1=[];
			for(let i=0;i<res.leadStrategyAdtypePrices.length;i++){
				arr1.push(res.leadStrategyAdtypePrices[i].adSpaceType)
			}
			addPutInStrategyStore.value4=arr1;
			if(res.leadStrategyTimeList.length>0){
				dspManageStore.state1='yes'
			}else{
				dspManageStore.state1='no'
			}
			let arr=[];
			for(let i=0;i<res.leadStrategyTimeList.length;i++){
				let DuanArr=res.leadStrategyTimeList[i].strategyzTime.split(',');
				let ccc=[];
				let str='';
				let duanArr=[];
				for(let j=0;j<24;j++){
					duanArr.push({name:j,start:j,end:j+1,state:false,tDuan:this.aaa(j)})
				}
				for(let j=0;j<DuanArr.length;j++){
					for(let h=0;h<duanArr.length;h++){
						if(DuanArr[j]==duanArr[h].name){
							duanArr[h].state=true
						}
					}
				}
				for(let j=0;j<duanArr.length;j++){
					if(duanArr[j+1]){
						if(duanArr[j].state==true&&duanArr[j].end==duanArr[j+1].start){
							str+=duanArr[j].tDuan
						}
					}else{
						if(duanArr[j].state==true&&j==23){
							str+=duanArr[j].tDuan
						}
					}
					if(duanArr[j].state==false||j==23){
						if(str!=''){
							str=this.strSlice(str);
							ccc.push(str);
						}
						str='';
					}
				}
				let obj={
					name:res.leadStrategyTimeList[i].strategyWeek,
					DuanArr:res.leadStrategyTimeList[i].strategyzTime.split(','),
					duan:ccc
				}
				arr.push(obj);
			}
			dspManageStore.timeDuan=arr
			if(res.isOrder==0){
				addPutInStrategyStore.state1='yes'
			}else{
				addPutInStrategyStore.state1='no'
			}
			addPutInStrategyStore.inputValue= res.maxOrder
			localStorage.setItem('strategyId',res.id);
			this.props.history.push({pathname:'/AddPutInStrategy'})
			localStorage.setItem('pathname','/AddPutInStrategy');
		})
	}
	callState(i){
		if(i.app_id){
			if(i.app_state==0){
				if(i.app_type=='THIRD'){
					return false
				}else{
					return true;
				}
			}else{
				return false;
			}
		}else{
			if(i.group_state==0){
				return true;
			}else{
				return false;
			}
		}
	}
	render() {
		let {fallArr,mediaArr,stratgyArr,total}=putInStrategyStore
		return (
			<div>
				<Layout history={this.props.history}/>
				<div className="content">
					<div className="contentBulk3" style={{ paddingTop: 10 }}>
						<LabelSelect1 typeArr={fallArr} value={this.state.adValue} call={this.selectCallback.bind(this,'adValue')} label="广告平台名称"/>
						<LabelSelect typeArr={mediaArr} value={this.state.mediaValue} call={this.selectCallback.bind(this,'mediaValue')} label="投放媒体"/>
						<LabelSelect typeArr={typeArr} value={this.state.typeValue} call={this.selectCallback.bind(this,'typeValue')} label="投放广告类型"/>
						<LabelSelect typeArr={stateArr} value={this.state.stateValue} call={this.selectCallback.bind(this,'stateValue')} label="投放策略状态"/>
					</div>
					<div style={{ paddingBottom: 10 }}>
						<button className="filtrateBtn" onClick={() => { this.clickQuery() }}>
							查询
						</button>
					</div>
					<div className="contentBulk1" style={{marginTop:10,width:'100%'}}>
						<div className="con-head">
							<div>
								<button className="borderBtn" onClick={()=>this.createStrategy()}>创建投放策略</button>
								<button className="borderBtn" onClick={()=>this.openItem()}>开启</button>
								<button className="borderBtn" onClick={()=>this.closeItem()}>关闭</button>
								<button className="borderBtn" onClick={()=>this.deleteItem()}>删除</button>
							</div>
						</div>
						<div className="table-head">
							<div  style={{width:'4%',float:'left',textAlign:'center'}}>
								<Checkbox checked={this.state.choiceArr.length==stratgyArr.length} onChange={this.onAllChange.bind(this)}/>
							</div>
							{headArr.map((i,k)=>{
								return(
									<div key={k} style={{width:i.w,float:'left',textAlign:'center',color:'#808080',lineHeight:'29px',height:'30px'}} title={i.name} className="gezi">
										{i.name}
									</div>
								)
							})}
						</div>
						{stratgyArr.map((i,k)=>(
							<div className="table-body" key={k}>
								<div className="gezi" style={{width:'4%'}}>
									<Checkbox
										checked={this.state.choiceArr.indexOf(i.id)>-1}
										onChange={()=>this.onOneChange(i.id)}/>
								</div>
								<div className="gezi" style={{width:'10.6%'}}>{/*广告投放平台名称*/}
									{i.fallback_name}
								</div>
								<div className="gezi" style={{width:'10.6%'}}>{/*投放策略名称*/}
									{i.name}
								</div>
								<div className="gezi" style={{width:'10.6%'}}>
									<Switch checkedChildren="开"
											unCheckedChildren="关"
											defaultChecked
											onChange={(e)=>this.onSwitchChange(e,i.id)}
											checked={i.state==0}/>
								</div>
								<div className="gezi" style={{width:'10.6%'}}>{/*广告映射关系设置*/}
									<span className="modification"
										  onClick={()=>this.skipAdMap(i.id)}>点击设置</span>
								</div>
								<div className="gezi" style={{width:'10.6%'}}>{/*固定出价设置*/}
									<span className="modification"
										  onClick={()=>this.skipBid(i.id)}>点击设置</span>
								</div>
								<div className="gezi" style={{width:'10.6%'}}>{/*投放媒体*/}
									{i.app_name==null?i.group_name:i.app_name}
								</div>
								<div className="gezi" style={{width:'10.6%'}} title={Client.adTypeArrEffect(i.adtype)}>{/*投放广告类型*/}
									{Client.adTypeArrEffect(i.adtype)}
								</div>
								<div className="gezi" style={{width:'10.6%'}} title={Client.formatDateTime(i.modify_time)}>{/*最后修改时间*/}
									{Client.formatDateTime(i.modify_time)}
								</div>
								<div className="gezi" style={{width:'10.6%'}}>{/*操作*/}
									<span className={this.callState(i)?"modification":'noClick'} onClick={()=>this.callState(i)?this.skipflow(i.id):null}>
										编辑
									</span>
								</div>
							</div>
						))}
						<div className="con-foot">
							<Pagination pageSizeOptions={['10','20','50','100']}
										showSizeChanger
										defaultPageSize={this.state.pageSize}
										onChange={this.onPageChange.bind(this)}
										onShowSizeChange={this.onShowSizeChange.bind(this)}
										current={this.state.page}
										defaultCurrent={this.state.page} total={total} />
						</div>
					</div>
				</div>
			</div>
		)
	}
}
