import React from "react";
import TimeDicker from "../component/TimeDicker";
import {Radio,DatePicker} from "antd";
import locale from 'antd/lib/date-picker/locale/zh_CN';
import Client from "../../../../common/lead-api";
import moment from 'moment';
import addPutInStrategyStore from "../../../../mobx/renderSet/PutInStrategyManage/add-putin-strategy-store"
import {observer} from "mobx-react";
const RadioGroup = Radio.Group;
@observer
export default class PutInCycle extends React.Component {
	constructor(){
		super()
		this.state={
			cycleState:addPutInStrategyStore.dateState,
			planStart: moment('2019-03-02','YYYY-MM-DD'),
			planEnd: moment('2019-03-03','YYYY-MM-DD'),
			excludeDates:addPutInStrategyStore.excludeDates,
			chooseMoment:null,
			visible:false
		}
	}
	onCycleChange(e){
		addPutInStrategyStore.dateState=e.target.value
		if(e.target.value=='no'){
			addPutInStrategyStore.startTime='';
			addPutInStrategyStore.endTime='';
			addPutInStrategyStore.excludeDates=[];
			this.setState({
				excludeDates:[],
				planStart:moment().startOf('day'),
				planEnd:moment().startOf('day'),
			})
		}
		this.setState({
			cycleState:e.target.value
		})
	}
	callback(a,b){
		addPutInStrategyStore.startTime=a.format('YYYY-MM-DD');
		addPutInStrategyStore.endTime=b.format('YYYY-MM-DD')
		this.setState({
			planStart:a,
			planEnd:b
		})
		let arr=this.state.excludeDates;
		let arr1=[]
		for(let i=0;i<arr.length;i++){
			let hm=new Date(arr[i]).getTime()
			if(hm<b&&hm>a){
				arr1.push(arr[i]);
			}
		}
		addPutInStrategyStore.excludeDates=arr1;
		this.setState({
			excludeDates:arr1
		})
	}
	disabledDate(current){
		if(this.state.planStart&&this.state.planEnd){
			return current && current < this.state.planStart.startOf('day')||current > this.state.planEnd.endOf('day')
		}else{
			return false;
		}
	}
	onPanelChange(a){
		this.setState({
			chooseMoment:a.format('YYYY-MM-DD')
		})
	}
	onOk(){
		console.log(this.state.excludeDates);
		let arr=this.state.excludeDates;

		if(arr.indexOf(this.state.chooseMoment)>-1){
			Client.showTank(false,'选择排除日期重复')

		}else{
			arr.push(this.state.chooseMoment);
		}
		this.props.call(arr);
		addPutInStrategyStore.excludeDates=arr;
		this.setState({
			excludeDates:arr,
		})
	}
	remove(i){
		let arr=this.state.excludeDates;
		var index = arr.indexOf(i);
		if (index > -1) {
			arr.splice(index, 1);
		}
		addPutInStrategyStore.excludeDates=arr;
		this.setState({
			excludeDates:arr
		})
	}
	render() {
		return (
			<div>
				<div className="accountListRow" >
					<div className="form-left">
						<i className="red">*</i>投放周期：
					</div>
					<div className="form-right-multiple" >
						<RadioGroup onChange={(e)=>this.onCycleChange(e)}
									value={this.state.cycleState}>
							<Radio value='no'>不限</Radio>
							<Radio value='yes'>设置投放周期</Radio>
						</RadioGroup>
						{this.state.cycleState=='yes'?(<TimeDicker callb={this.callback.bind(this)}/>):null}
					</div>
				</div>
				{this.state.planStart!=null&&this.state.planEnd!=null&&this.state.cycleState=='yes'?(
					<div className="accountListRow" >
						<div className="form-left">
						</div>
						<div className="form-right" style={{flexDirection:'row',display: 'flex',paddingLeft:'192px'}}>
							<DatePicker
								className="qwe"
								showTime
								disabledDate={this.disabledDate.bind(this)}
								onChange={this.onPanelChange.bind(this)}
								value={null}
								placeholder={'选择排除日期'}
								locale={locale}
								onOk={this.onOk.bind(this)}

							/>
						</div>
					</div>
				):null}
				{this.state.cycleState=='yes'? this.state.excludeDates.map((i,k)=>(
					<div className="accountListRow" key={k} >
						<div className="form-left">
						</div>
						<div className="form-right" style={{paddingLeft:'192px'}}>
							<div className="paichu">
								<span>
									已排除：{i}
								</span>
								<span className="cha" onClick={()=>this.remove(i)}>
									×
								</span>
							</div>
						</div>
					</div>
				)):null}
			</div>
		)
	}
}
