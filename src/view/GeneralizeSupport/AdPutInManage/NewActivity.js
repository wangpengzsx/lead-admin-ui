import React from "react";
import Layout from "../../../layout/Layout";
import Activity1 from "./moudle/Activity1";
import Activity2 from "./moudle/Activity2";
import Activity3 from "./moudle/Activity3";
import Activity4 from "./moudle/Activity4";
import Activity5 from "./moudle/Activity5";
import Activity6 from "./moudle/Activity6";
import Activity7 from "./moudle/Activity7";
import Activity8 from "./moudle/Activity8";
import PutInMedia from "./moudle/PutInMedia";
import PutInAppVersion from "./moudle/PutInAppVersion";
import Activity9 from "./moudle/Activity9";
import Activity10 from "./moudle/Activity10";
import Activity11 from "./moudle/Activity11";
import Activity12 from "./moudle/Activity12";
import Activity13 from "./moudle/Activity13";
import PutInCycle from "./moudle/PutInCycle";
import PutInTimeFrame from "../../DSPManage/DSPAccountManage/module/PutInTimeFrame";
import TerritorySet from "../../DSPManage/DSPAccountManage/module/TerritorySet";
import EquipmentSet from "../../DSPManage/DSPAccountManage/module/EquipmentSet";
import Strategy6 from "../../renderSet/putInStrategyManage/module/Strategy6";
import {observer} from "mobx-react";
import newActivityStore from "../../../mobx/generalizeSupport/AdPutInManage/new-activity-store";
import addPutInStrategyStore from "../../../mobx/renderSet/PutInStrategyManage/add-putin-strategy-store";
import dspManageStore from "../../../mobx/dspManage/DSPManageStore/dsp-manage-store";
import Client from "../../../common/lead-api";
@observer
export default class NewActivity extends React.Component {
	constructor(){
		super()
		this.state={
			name:'',
			cycleState:'no',
			putInTimeFrame:[]
		}
	}
	cancel(){
		this.props.history.push({pathname:'/activityList'})
	}
	matchDuan(arr){
		let daArr=[];
		for(let i=0;i<arr.length;i++){
			let str='';
			for(let j=0;j<arr[i].DuanArr.length;j++){
				if(j==arr[i].DuanArr.length-1){
					str+=arr[i].DuanArr[j]
				}else{
					str+=arr[i].DuanArr[j]+','
				}
			}
			let obj={
				activeWeek: arr[i].name,
				activeTime: str
			}
			daArr.push(obj);
		}
		return daArr;
	}
	submit(){
		let {
			 actName,//广告活动名称
			 actTerminal,//投放终端
			 adType,//投放广告类型
			 dealType,//交易类型
			 actDealList,//关联deal
			 dayBudgetState,//日预算状态
			 dayBudget,//日预算值
			 useUpType,//预算消耗形式
			 networkState,//网络环境
			 network,//网络环境
			 operatorState,//运营商
			 operators,//运营商
			 activePrice,//出价
			 dayPvState,//日曝光上限
			 dayPv,//日曝光上限
			 dayCvState,//日点击上限
			 dayCv,//日点击上限
			 mediaState,//媒体状态
			 mediaValue,//媒体值
		}=newActivityStore;
		let {
			 dateState,//投放周期状态
	 		 startTime,
	    	 endTime,
			 modalState6,//imei黑白名单
		}=addPutInStrategyStore;
		let imeiValue=addPutInStrategyStore.value6;//imeivalue
		let {
			state1,//投放时段状态
			timeDuan,//投放时段
			choiceArr,//选择投放地域
			excludeArr,//排除投放地域
			equChoiceArr,//选择投放设备
			equExcludeArr,//排除投放设备
		}=dspManageStore;
		/*console.log(
			"广告活动名称:"+actName+"\n",
			"投放终端:"+actTerminal+'\n',//
			"投放广告类型:"+adType+'\n',//
			"交易类型:"+dealType+'\n',//
			"关联deal:"+actDealList+'\n',//
			"日预算状态:"+dayBudgetState+'\n',//
			"日预算值:"+dayBudget+'\n',//
			"预算消耗形式:"+useUpType+'\n',//
			"网络环境状态:"+networkState+'\n',//
			"网络环境值:"+network+'\n',//
			"运营商状态:"+operatorState+'\n',//
			"运营商值:"+operators+'\n',//
			"出价:"+activePrice+'\n',//
			"日曝光上限状态:"+dayPvState+'\n',//
			"日曝光上限值:"+dayPv+'\n',//
			"日点击上限状态:"+dayCvState+'\n',//
			"日点击上限值:"+dayCv+'\n',//
			"媒体状态:"+mediaState+'\n',//
			"媒体值:"+mediaValue+'\n',//
			"投放周期状态:"+dateState+'\n',//
			"投放周期开始时间:"+startTime+'\n',
			"投放周期结束时间:"+endTime+'\n',
			"imei黑白名单:"+modalState6+'\n',//
			"imei值:"+imeiValue+'\n',//
			"投放时段状态:"+state1+'\n',//
			"投放时段:"+timeDuan+'\n',//
			"选择投放地域:"+choiceArr+'\n',//
			"排除投放地域:"+excludeArr+'\n',//
			"选择投放设备:"+equChoiceArr+'\n',//
			"排除投放设备:"+equExcludeArr,//
		)*/
		let dealArr=[];
		[...actDealList].map(i=>dealArr.push({leadDeal:{id:i}}));
		let mediaArr=[];
		for(let i=0;i<mediaValue.length;i++){
			if(mediaValue[i].slice(0,1)=='@'){
				mediaArr.push({app:{id:mediaValue[i].slice(1)}})
			}else{
				mediaArr.push({appGroup:{id:mediaValue[i].slice(1)}})
			}
		}
		let obj={
			leadPlan:{id:localStorage.getItem('findPlanId')},
			name:actName,
			terminal:actTerminal,
			adSpaceType:adType,
			transactionType:dealType,
			leadActiveDealList:dealArr,
			dayBudget:dayBudgetState=='NO'?'':dayBudget,
			useUpType:useUpType,
			isCycle:dateState=='no'?0:1,
			startTime:dateState=='no'?'':startTime,
			endTime:dateState=='no'?'':endTime,
			leadActiveTimeList:this.matchDuan(timeDuan),
			isMedia:mediaState=='no'?0:1,
			leadActiveMediaList:mediaState=='no'?[]:mediaArr,
			choiceCity:choiceArr,
			excludeCity:excludeArr,
			choiceDevice:equChoiceArr,
			excludeDevice:equExcludeArr,
			choiceImei:modalState6=='0'?imeiValue:null,
			excludeImei:modalState6=='0'?null:imeiValue,
			network:networkState=='NO'?'':Client.arrStr(network),
			operators:operatorState=='NO'?'':Client.arrStr(operators),
			activePrice:activePrice,
			dayPv:dayPvState=='NO'?'':dayPv,
			dayCv:dayCvState=='NO'?'':dayCv,
			activeState:0
		}
		if(localStorage.getItem('adActivityId')){
			obj.id=localStorage.getItem('adActivityId')
		}
		if(actName!==''&&adType!==''&&dealType!==''&&activePrice!==''){
			if(dealType=='PD'||dealType=='PDB'){
				if(obj.leadActiveDealList.length>0){
					this.saveActivity(activePrice,obj)
				}else{
					Client.showTank(false,'请关联deal')
				}
			}else{
				this.saveActivity(activePrice,obj)
			}
		}else{
			Client.showTank(false,'请填写必填项')
		}
	}
	saveActivity(activePrice,obj){
		if(Client.isNumber(activePrice)){
			Client.createObject('adv/saveActive',obj).then(res=>{
				if(res.status==200){
					this.props.history.push({pathname:'/activityList'})
				}else{
					Client.showTank(false,res.message)
				};
			})
		}else{
			Client.showTank(false,'出价请填写数字')
		}
	}
	render() {
		let {dealType} = newActivityStore
		return (
			<div>
				<Layout history={this.props.history}/>
				<div className="content">
					<div className="list-haed">
						<span className="dah1">
							基础信息
						</span>
					</div>
					<div className="contentBulk">
						<Activity1/>{/*广告活动名称*/}
						{localStorage.getItem('adActivityId')?<Activity2/>:null}{/*广告活动id*/}
						<Activity3/>{/*投放终端*/}
						<Activity4/>{/*投放广告类型*/}
						<Activity5/>{/*交易类型*/}
						{dealType=='RTB'||dealType==''?null:<Activity6/>}{/*关联deal*/}
					</div>
					<div className="list-haed">
						<span className="dah1">
							预算和时间
						</span>
					</div>
					<div className="contentBulk">
						<Activity7/>{/*日预算*/}
						<Activity8/>{/*预算消耗形式*/}
						<PutInCycle/>{/*投放周期*/}
						<PutInTimeFrame history={this.props.history}
										cytate={this.state.cycleState}
										timeDuan={this.state.putInTimeFrame}/>{/*投放时段*/}
					</div>
					<div className="list-haed">
						<span className="dah1">
							我的广告在哪些媒体上曝光
						</span>
					</div>
					<div className="contentBulk">
						<PutInMedia/>{/*投放媒体*/}
						{/*<PutInAppVersion/>*/}{/*投放应用版本*/}
					</div>
					<div className="list-haed">
						<span className="dah1">
							哪些用户可以看到我的广告
						</span>
					</div>
					<div className="contentBulk">
						<TerritorySet history={this.props.history}/>{/*投放地域*/}
						<EquipmentSet history={this.props.history}/>{/*投放设备*/}
						<Strategy6/>{/*投放imei*/}
						<Activity9/>{/*网络环境*/}
						<Activity10/>{/*运营商*/}
					</div>
					<div className="list-haed">
						<span className="dah1">
							出价
						</span>
					</div>
					<div className="contentBulk">
						<Activity11/>{/*出价*/}
						<Activity12/>{/*日曝光上限*/}
						<Activity13/>{/*日点击上限*/}
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
