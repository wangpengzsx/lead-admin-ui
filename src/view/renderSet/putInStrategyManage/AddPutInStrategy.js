import React from "react";
import Layout from "../../../layout/Layout";
import Client from "../../../common/lead-api"
import {observer} from "mobx-react";
import Strategy1 from "./module/Strategy1";
import Strategy2 from "./module/Strategy2";
import Strategy3 from "./module/Strategy3";
import Strategy4 from "./module/Strategy4";
import Strategy5 from "./module/Strategy5";
import Strategy6 from "./module/Strategy6";
import PutInCycle from "./module/PutInCycle";
import PutInTimeFrame from "../../DSPManage/DSPAccountManage/module/PutInTimeFrame";
import TerritorySet from "../../DSPManage/DSPAccountManage/module/TerritorySet";
import EquipmentSet from "../../DSPManage/DSPAccountManage/module/EquipmentSet";
import PutInOrder from "./module/PutInOrder";
import addPutInStrategyStore from "../../../mobx/renderSet/PutInStrategyManage/add-putin-strategy-store"
import dspManageStore from "../../../mobx/dspManage/DSPManageStore/dsp-manage-store"
import flowSetStore from "../../../mobx/renderSet/PutInStrategyManage/flow-set-store"
@observer
export default class AddPutInStrategy extends React.Component {
	constructor(){
		super()
		this.state={
			excludeTime:[],
			cycleState:'no',
			putInTimeFrame:[]
		}
	}
	putInCycleCall(arr){
		this.setState({
			excludeTime:arr
		})
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
			let zongArr=localStorage.getItem('zongArr')?JSON.parse(localStorage.getItem('zongArr')):{};
			let timeId='a'+ parseInt(Math.random()*10000000)+i+'';
			if(zongArr.leadStrategyTimeList){
				for(let h=0;h<zongArr.leadStrategyTimeList.length;h++){
					if(arr[i].name==zongArr.leadStrategyTimeList[h].strategyWeek){
						timeId=zongArr.leadStrategyTimeList[h].id;
					}
				}
			}
			let obj={
				id:timeId,
				strategyWeek: arr[i].name,
				strategyzTime: str
			}
			daArr.push(obj);
		}
		return daArr;
	}
	matchJion(arr){
		let daArr=[];
		for(let i=0;i<arr.length;i++){
			let obj={
				adSpaceType:arr[i]
			}
			daArr.push(obj);
		}
		let zongArr=localStorage.getItem('zongArr')?JSON.parse(localStorage.getItem('zongArr')):{};
		for(let i=0;i<daArr.length;i++){
			if(zongArr.leadStrategyAdtypePrices){
				for(let j=0;j<zongArr.leadStrategyAdtypePrices.length;j++){
					if(daArr[i].adSpaceType==zongArr.leadStrategyAdtypePrices[j].adSpaceType){
						daArr[i]=zongArr.leadStrategyAdtypePrices[j]
					}
				}
			}
		}
		return daArr;
	}
	confirm() {
		let {value1,value2,value3,value4,modalState5,value5,modalState6,value6,state1,inputValue,endTime,startTime,excludeDates}=addPutInStrategyStore;
		let {timeDuan,choiceArr,excludeArr,equChoiceArr,equExcludeArr} = dspManageStore;
		if(value1=='请选择'||value2==''||value3=='请选择'||value4.length==0){
			Client.showTank(false,'请填写必填项')
		}else{
			let duanArr=timeDuan;
			let leadStrategy = {
				leadFallbackDsp: {id: value1},
				name:value2,
				leadApp:{id:value3.slice(0,1)=='@'?value3.slice(1):''},
				leadAppGroup:{id:value3.slice(0,1)=='#'?value3.slice(1):''},
				leadStrategyAdtypePrices:this.matchJion(value4),
				id: localStorage.getItem('strategyId')?localStorage.getItem('strategyId'):'',
				strategyStart: startTime,
				strategyEnd: endTime,
				excludeDates: excludeDates,
				choiceCity: choiceArr,
				excludeCity: excludeArr,
				choiceDevice:equChoiceArr,
				excludeDevice:equExcludeArr,
				leadStrategyTimeList: this.matchDuan(duanArr),
				choiceAppVersion:modalState5=='0'?value5:null,
				excludeAppVersion:modalState5=='0'?null:value5,
				choiceImei:modalState6=='0'?value6:null,
				excludeImei:modalState6=='0'?null:value6,
				state:0,
				isOrder:state1=='no'?1:0,
				maxOrder:inputValue
			}
			flowSetStore.saveOrUpdateStrategy(leadStrategy,this.callback.bind(this));
		}
	}
	callback(){
		this.props.history.push({pathname:'/putInStrategyManage'})
		this.clearStore()
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
	}
	render() {
		let {value1,value3}=addPutInStrategyStore;
		return (
			<div>
				<Layout history={this.props.history}/>
				<div className="content">
					<div className="list-haed">
						<span className="dah1">
							基础信息
						</span>
					</div>
					<div className="contentBulk" style={{padding:'10px'}}>
						<Strategy1/>
						<Strategy2/>
						{value1!='请选择'?<Strategy3/>:null}
						{value1!='请选择'&&value3!='请选择'?<Strategy4/>:null}
						<PutInCycle call={this.putInCycleCall.bind(this)} />
						<PutInTimeFrame history={this.props.history}
										cytate={this.state.cycleState}
										timeDuan={this.state.putInTimeFrame}/>
						<PutInOrder/>
						<TerritorySet history={this.props.history}/>
						<EquipmentSet history={this.props.history}/>
						<Strategy5/>
						<Strategy6/>
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
