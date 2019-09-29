import React from "react";
import Layout from "../../../layout/Layout";
import {Checkbox,Pagination,Switch} from "antd";
import PutInStateModal from "./modal/PutInStateModal"
import newActivityStore from "../../../mobx/generalizeSupport/AdPutInManage/new-activity-store";
import activityStore from "../../../mobx/generalizeSupport/AdPutInManage/activity-store";
import addPutInStrategyStore from "../../../mobx/renderSet/PutInStrategyManage/add-putin-strategy-store";
import dspManageStore from "../../../mobx/dspManage/DSPManageStore/dsp-manage-store";
import {observer} from "mobx-react";
import Client from "../../../common/lead-api";
import Clipboard from "clipboard";
const headArr=[
	{name:'广告活动名称',w:'5.93%'},
	{name:'活动状态',w:'5.93%'},
	{name:'投放状态',w:'5.93%'},
	{name:'广告活动id',w:'5.93%'},
	{name:'花费',w:'5.93%'},
	{name:'投放终端',w:'5.93%'},
	{name:'投放广告类型',w:'5.93%'},
	{name:'交易类型',w:'5.93%'},
	{name:'日预算',w:'5.93%'},
	{name:'投放周期',w:'5.93%'},
	{name:'出价',w:'5.93%'},
	{name:'日曝光上限',w:'5.93%'},
	{name:'日点击上限',w:'5.93%'},
	{name:'投放媒体',w:'5.93%'},
	{name:'最后更新时间',w:'5.93%'},
	{name:'操作',w:'5.93%'},
]
@observer
export default class ActivityList extends React.Component {
	constructor(){
		super()
		this.state={
			page:1,
			size:10,
			name:'',
			ids:[]
		}
	}
	onInputChange(e){
		this.setState({
			name:e.target.value
		})
	}
	searchApp(){
		this.callback()
	}
	componentWillMount(){
		localStorage.removeItem('adActivityId');
		localStorage.removeItem('findActivityId');
		this.clearStore();
		let {size,page,name}=this.state;
		activityStore.getActivityArr(size,page,name,localStorage.getItem('findPlanId'))
	}
	componentDidMount(){
		var clipboard = new Clipboard('.geziChild');
		clipboard.on('success', function(e) {
			Client.showTank(true,'复制成功')
		});
	}
	onAllChange(e){
		let {activityArr}=activityStore;
		let arr = [];
		if (e.target.checked) {
			activityArr.map(i => arr.push(i.id))
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
	openItem(){
		this.updateActiveState(0)
	}
	closeItem(){
		this.updateActiveState(1)
	}
	removeItem(){
		this.updateActiveState(-1)
		this.setState({ids:[]})
	}
	onSwitchChange(state,id){
		activityStore.updateActiveState(state,[id],this.callback.bind(this))
	}
	updateActiveState(state){
		activityStore.updateActiveState(state,this.state.ids,this.callback.bind(this))
	}
	callback(){
		let {size,page,name}=this.state;
		activityStore.getActivityArr(size,page,name,localStorage.getItem('findPlanId'))
	}
	onPageChange(page){
		this.setState({
			page
		})
		setTimeout(()=>{
			this.callback()
		},300)
	}
	onShowSizeChange(page,size){
		this.setState({
			size,page
		})
		setTimeout(()=>{
			this.callback()
		},300)
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
	edit(id){
		localStorage.setItem('adActivityId',id)
		Client.getNullArgument('adv/getActiveInfo?id='+id).then(res=>{
			let dealArr=[];
			res.leadActiveDealList.map(i=>{dealArr.push(i.leadDeal.id)})
			newActivityStore.actName=res.name;
			newActivityStore.actTerminal=res.terminal;
			newActivityStore.adType=res.adSpaceType;
			newActivityStore.dealType=res.transactionType;
			if(res.transactionType){
				Client.getNullArgument("leadDeals/search/findAllByDealType?dealType="+res.transactionType).then(res=>{
					newActivityStore.dealArr=res._embedded.leadDeals
				})
			}
			newActivityStore.actDealList=dealArr;
			newActivityStore.dayBudgetState=res.dayBudget==0?'NO':'YES';
			newActivityStore.dayBudget=res.dayBudget;
			newActivityStore.useUpType=res.useUpType;
			addPutInStrategyStore.dateState=res.isCycle==0?'no':'yes';
			if(res.startTime!=''&&res.startTime!=null){
				addPutInStrategyStore.startTime=res.startTime.slice(0,10)
			}
			if(res.endTime!=''&&res.endTime!=null){
				addPutInStrategyStore.endTime=res.endTime.slice(0,10)
			}
			if(res.leadActiveTimeList.length>0)dspManageStore.state1='yes';
			let arr=[];
			for(let i=0;i<res.leadActiveTimeList.length;i++){
				let DuanArr=res.leadActiveTimeList[i].activeTime.split(',');
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
					name:res.leadActiveTimeList[i].activeWeek,
					DuanArr:res.leadActiveTimeList[i].activeTime.split(','),
					duan:ccc

				}
				arr.push(obj);
			}
			dspManageStore.timeDuan=arr
			let appArr=[],nameArr=[];
			for(let i=0;i<res.leadActiveMediaList.length;i++){
				if(res.leadActiveMediaList[i].app){
					appArr.push('@'+res.leadActiveMediaList[i].app.id);
					nameArr.push(res.leadActiveMediaList[i].app.appName);
				}else{
					appArr.push('#'+res.leadActiveMediaList[i].appGroup.id);
					nameArr.push(res.leadActiveMediaList[i].appGroup.name);
				}
			}
			if(res.leadActiveMediaList.length>0){
				newActivityStore.mediaState='yes'
				newActivityStore.mediaValue=appArr
				newActivityStore.mediaLabelValue=nameArr
			}else{
				newActivityStore.mediaState='no'
			}
			if(res.choiceCity.length>0||res.excludeCity.length>0){
				dspManageStore.state2='yes'
			}else{
				dspManageStore.state2='no'
			}
			if(res.choiceDevice.length>0||res.excludeDevice.length>0){
				dspManageStore.state7='yes'
			}else{
				dspManageStore.state7='no'
			}
			dspManageStore.choiceArr=res.choiceCity
			dspManageStore.excludeArr=res.excludeCity
			dspManageStore.equChoiceArr=res.choiceDevice
			dspManageStore.equExcludeArr=res.excludeDevice
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
			if(res.network==''||res.network==null){
				newActivityStore.networkState='NO';
			}else{
				newActivityStore.networkState='YES';
				newActivityStore.network=res.network.split(',')
			}
			if(res.operators==''||res.operators==null){
				newActivityStore.operatorState='NO';
			}else{
				newActivityStore.operatorState='YES';
				newActivityStore.operators=res.operators.split(',')
			}
			newActivityStore.activePrice=res.activePrice;
			res.dayPv==0?newActivityStore.dayPvState='NO':newActivityStore.dayPvState='YES'
			newActivityStore.dayPv=res.dayPv;
			res.dayCv==0?newActivityStore.dayCvState='NO':newActivityStore.dayCvState='YES'
			newActivityStore.dayCv=res.dayCv;
			this.props.history.push({pathname:'/newActivity'})
		})

	}
	skip(id){
		localStorage.setItem('findActivityId',id)
		this.props.history.push({pathname:'/creativityList'})
	}
	newActivity(){
		this.props.history.push({pathname:'/newActivity'})
	}
	clearStore(){
		newActivityStore.actName= '';
		newActivityStore.actTerminal= 'APP';
		newActivityStore.adType= '';
		newActivityStore.dealType= '';
		newActivityStore.actDealList= '';
		newActivityStore.dayBudgetState= 'NO';
		newActivityStore.dayBudget= '';
		newActivityStore.useUpType= 'QUICK';
		newActivityStore.networkState= 'NO';
		newActivityStore.network= [];
		newActivityStore.operatorState= 'NO';
		newActivityStore.operators= [];
		newActivityStore.activePrice= '';
		newActivityStore.dayPvState= 'NO';
		newActivityStore.dayPv= '';
		newActivityStore.dayCvState= 'NO';
		newActivityStore.dayCv= '';
		newActivityStore.mediaState= 'no';
		newActivityStore.mediaValue= [];
		newActivityStore.mediaLabelValue= [];
		addPutInStrategyStore.modalState6= '';
		addPutInStrategyStore.value6='';
		addPutInStrategyStore.dateState= 'no';
		addPutInStrategyStore.startTime= '';
		addPutInStrategyStore.endTime= '';
		dspManageStore.state1 = 'no';//时段单选状态
		dspManageStore.timeDuan = [];//时段选择数组
		dspManageStore.state2 = 'no';//地域单选状态
		dspManageStore.choiceArr = [];//地域选择数组
		dspManageStore.excludeArr = [];//地域排除数组
		dspManageStore.state7 = 'no';//设备单选状态
		dspManageStore.equChoiceArr = [];//设备选择数组
		dspManageStore.equExcludeArr = [];//设备排除数组
	}
	mediaName(arr){
		let nameArr=[]
		for(let i=0;i<arr.length;i++){
			if(arr[i].app){
				nameArr.push(arr[i].app.appName)
			}else{
				nameArr.push(arr[i].appGroup.name)
			}
		}
		return nameArr.length>0?Client.arrStr(nameArr):'不限制';
	}
	putInState(id){
		this._putInStateModal.openModal(id)
	}
	render() {
		let {activityArr,total}=activityStore;
		return (
			<div>
				<PutInStateModal ref={e=>this._putInStateModal=e}/>
				<Layout history={this.props.history}/>
				<div className="content">
					<div className="contentBulk1">
						<div className="con-head">
							<div>
								<button className="borderBtn" onClick={()=>{this.newActivity()}}>创建广告活动</button>
								<button className="borderBtn" onClick={()=>this.openItem()}>开启</button>
								<button className="borderBtn" onClick={()=>this.closeItem()}>关闭</button>
								<button className="borderBtn" onClick={()=>this.removeItem()}>删除</button>
							</div>
							<div className="searchInput">
								<input type="text"
									   placeholder="请输入查询的名称和关键字"
									   onChange={(e)=>this.onInputChange(e)}
									   className='searchInputText'/>
								<div className='searchInputButton' onClick={()=>this.searchApp()}></div>

							</div>
						</div>
						<div style={{ width: '100%', overflowX: 'scroll' }}>
							<div className="table-head" style={{width:'120%'}}>
								<div  style={{width:'5%',float:'left',textAlign:'center'}}>
									<Checkbox onChange={this.onAllChange.bind(this)} checked={this.state.ids.length==activityArr.length}/>
								</div>
								{
									headArr.map((i,k)=>(
										<div key={k} style={{width:i.w,float:'left',textAlign:'center'}}>
											{i.name}
										</div>
									))
								}
							</div>
							{activityArr.map((i,k)=>(
								<div className="table-body" key={k} style={{background:k%2==0?'#fff':'#fafafa',width:'120%'}}>
									<div  style={{width:'5%'}} className='gezi'>
										<Checkbox onChange={this.onOneChange.bind(this,i.id)} checked={this.state.ids.indexOf(i.id)>-1}/>
									</div>
									<div  style={{width:headArr[0].w}} className='gezi'>{/*广告活动名称*/}
										<span className="modification" onClick={()=>{this.skip(i.id)}}>
										{i.name}
									</span>
									</div>
									<div  style={{width:headArr[1].w}} className='gezi'>{/*活动状态*/}
										<Switch checkedChildren="开" unCheckedChildren="关" checked={i.activeState==0} onChange={()=>this.onSwitchChange(i.activeState==0?1:0,i.id)}/>
									</div>
									<div  style={{width:headArr[2].w}} className='gezi'>{/*投放状态*/}
										<button className="borderBtn" style={{minWidth:66}} onClick={()=>this.putInState(i.id)}>查看</button>
									</div>
									<div style={{width:headArr[3].w}} title={i.id} className='gezi'>{/*广告活动id*/}
										{i.id}
										<button id={i.id}  data-clipboard-text={i.id} className="geziChild">
											复制
										</button>
									</div>
									<div  style={{width:headArr[4].w}} className='gezi'>{/*花费*/}

									</div>
									<div  style={{width:headArr[5].w}} className='gezi'>{/*投放终端*/}
										{i.terminal}
									</div>
									<div  style={{width:headArr[6].w}} className='gezi'>{/*投放广告类型*/}
										{i.adSpaceType}
									</div>
									<div  style={{width:headArr[7].w}} className='gezi'>{/*交易类型*/}
										{i.transactionType}
									</div>
									<div  style={{width:headArr[8].w}} className='gezi'>{/*日预算*/}
										{i.dayBudget==0?'不限制':i.dayBudget}
									</div>
									<div  style={{width:headArr[9].w}}
										  title={i.isCycle==0?null:Client.formatDate(i.startTime)+'~'+Client.formatDate(i.endTime)}
										  className='gezi'>{/*投放周期*/}
										{i.isCycle==0?'不限制':Client.formatDate(i.startTime)+'~'+Client.formatDate(i.endTime)}
									</div>
									<div  style={{width:headArr[10].w}} title={i.activePrice} className='gezi'>{/*出价*/}
										{i.activePrice}
									</div>
									<div  style={{width:headArr[11].w}} className='gezi'>{/*日曝光上限*/}
										{i.dayPv==0?'不限制':i.dayPv}
									</div>
									<div  style={{width:headArr[12].w}} className='gezi'>{/*日点击上限*/}
										{i.dayCv==0?'不限制':i.dayCv}
									</div>
									<div  style={{width:headArr[13].w}}
										  title={this.mediaName(i.leadActiveMediaList)}
										  className='gezi'>{/*投放媒体*/}
										{this.mediaName(i.leadActiveMediaList)}
									</div>
									<div  style={{width:headArr[14].w}} title={Client.formatDateTime(i.modifyTime)} className='gezi'>{/*最后更新时间*/}
										{Client.formatDateTime(i.modifyTime)}
									</div>
									<div  style={{width:headArr[15].w}} className='gezi'>{/*操作*/}
										<span className="modification" onClick={()=>{this.edit(i.id)}}>编辑</span>
									</div>
								</div>
							))}
						</div>

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
