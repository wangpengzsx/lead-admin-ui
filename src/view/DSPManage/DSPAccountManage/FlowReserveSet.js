import React from "react";
import Layout from "../../../layout/Layout";
import PutInTimeFrame from "./module/PutInTimeFrame";
import TerritorySet from "./module/TerritorySet";
import Media1 from "./module/Media1";
import Media2 from "./module/Media2";
import Media3 from "./module/Media3";
import EquipmentSet from "./module/EquipmentSet";
import LimiSet from "./module/LimiSet";
import dspManageStore from "../../../mobx/dspManage/DSPManageStore/dsp-manage-store";
import {observer} from "mobx-react";
@observer
export default class FlowReserveSet extends React.Component {
	constructor(props){
		super(props)
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
				pretargetingWeek: arr[i].name,
				pretargetingTime: str,
			}
			daArr.push(obj);
		}
		return daArr;
	}
	submit(){
		let {
			timeDuan,
			choiceArr,
			excludeArr,
			value3,
			modalState4,
			modalValue4,
			value5,
			modalState6,
			modalValue6,
			equChoiceArr,
			equExcludeArr,
			modalState8,
			modalValue8}=dspManageStore
		let obj={
			id:localStorage.getItem('preId'),
			leadDsp:{id:parseInt(localStorage.getItem('dspId'))},
			choiceCity:choiceArr,
			excludeCity:excludeArr,
			terminal:value3.join(),
			whiteMedia:modalState4==0?modalValue4:null,
			blackMedia:modalState4==1?modalValue4:null,
			adTypes:value5.join(),
			whiteAppVersion:modalState6==0?modalValue6:null,
			blackAppVersion:modalState6==1?modalValue6:null,
			choiceDevice:equChoiceArr,
			excludeDevice:equExcludeArr,
			whiteImei:modalState8==0?modalValue8:null,
			blackImei:modalState8==1?modalValue8:null,
			leadPretargetingTimeList:this.matchDuan(timeDuan)
		}
		dspManageStore.saveAndUpdatePretargeting(obj,this.callback.bind(this))
	}
	callback(){
		this.props.history.push({pathname: '/DSPAccountManage'})
		this.clearStore()
	}
	clearStore(){
		dspManageStore.state1 = 'no';//时段单选状态
		dspManageStore.timeDuan = [];//时段选择数组
		dspManageStore.state2 = 'no';//地域单选状态
		dspManageStore.choiceArr = [];//地域选择数组
		dspManageStore.excludeArr = [];//地域排除数组
		dspManageStore.initChoiceArr = [];//地域初始化选择数组
		dspManageStore.initExcludeArr = [];//地域初始化排除数组
		dspManageStore.value3 = [];
		dspManageStore.state4 = 'no';//
		dspManageStore.modalState4 = '';//
		dspManageStore.modalValue4 = '';//
		dspManageStore.state5 = 'no';
		dspManageStore.value5 = [];
		dspManageStore.state6 = 'no';//
		dspManageStore.modalState6 = '';//
		dspManageStore.modalValue6 = '';//
		dspManageStore.state7 = 'no';//设备单选状态
		dspManageStore.equChoiceArr = [];//设备选择数组
		dspManageStore.equExcludeArr = [];//设备排除数组
		dspManageStore.initEquChoiceArr = [];//设备初始化选择数组
		dspManageStore.initEquExcludeArr = [];//设备初始化排除数组
		dspManageStore.state8 = 'no';//
		dspManageStore.modalState8 = '';//
		dspManageStore.modalValue8 = '';//
	}
	cancel(){
		this.props.history.push({pathname: '/DSPAccountManage'})
		this.clearStore()
	}
	render() {
		return (
			<div>
				<Layout history={this.props.history}/>
				<div className="content">
					<div className="list-haed">
						<span className="dah1">
							流量预定向设置
						</span>
						<span className="xiaoh1">
							请勾选响应定向条件，如不需定向可跳过改设置
						</span>
					</div>
					<div className="contentBulk">
						<div className="head-box head-box-loyout">
							基础定向
						</div>
						<TerritorySet history={this.props.history}/>
						<PutInTimeFrame history={this.props.history}/>
						<div className="head-box head-box-loyout">
							媒体定向
						</div>
						<Media1/>
						<Media2/>
						<Media3/>
						<div className="head-box head-box-loyout">
							设备定向
						</div>
						<EquipmentSet history={this.props.history}/>
						<LimiSet/>
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
