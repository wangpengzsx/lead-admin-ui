import React from "react";
import TimeDicker from "../../../renderSet/putInStrategyManage/component/TimeDicker";
import {Radio} from "antd";
const RadioGroup = Radio.Group;
import moment from 'moment';
import addPutInStrategyStore from "../../../../mobx/renderSet/PutInStrategyManage/add-putin-strategy-store"
import {observer} from "mobx-react";




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
						{
							this.state.cycleState=='yes'?(<TimeDicker callb={this.callback.bind(this)}/>):null
						}

					</div>
				</div>
			</div>

		)
	}
}
