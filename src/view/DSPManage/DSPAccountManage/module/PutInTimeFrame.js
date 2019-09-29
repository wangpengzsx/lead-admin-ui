import React from "react";
import {Radio} from "antd";
import dspManageStore from "../../../../mobx/dspManage/DSPManageStore/dsp-manage-store";
const RadioGroup = Radio.Group;
import {observer} from "mobx-react";
@observer
export default class PutInTimeFrame extends React.Component {
	constructor(props){
		super(props)
		this.state={
			cycleState:localStorage.getItem('timeDuanState')||'no',
			chooseTimeFrame:[],
			timeDuan:localStorage.getItem('timeDuan')?JSON.parse(localStorage.getItem('timeDuan')):[]
		}
	}
	onCycleChange(e){
		dspManageStore.state1=e.target.value
		if(e.target.value=='no'){
			dspManageStore.timeDuan=[]
		}
	}
	skip(){
		this.props.history.push({
			pathname:'/timeFrameCom1'
		})
	}
	duan(arr){
		let str='';
		for(let i=0;i<arr.length;i++){
			if(i==arr.length-1){
				str+=arr[i]
			}else{
				str+=arr[i]+','
			}
		}
		return str;
	}
	render() {
		let {state1,timeDuan}=dspManageStore;
		return (
			<div>
				<div className="accountListRow" >
					<div className="form-left">
						<i className="red">*</i>投放时段：
					</div>
					<div className="form-right-multiple" >
						<RadioGroup onChange={(e)=>this.onCycleChange(e)}
									value={state1}>
							<Radio value='no'>不限</Radio>
							<Radio value='yes'>设置投放时段</Radio>
						</RadioGroup>
						{state1=='yes'?(<a onClick={()=>{this.skip()}}>设置</a>):null}
					</div>
				</div>
				{state1=='yes'?timeDuan.map((i,k)=>(
					<div className="accountListRow" key={k}>
						<div className="form-left">
						</div>
						<div className="form-right-multiple" >
							{i.name} : {this.duan(i.duan)}
						</div>
					</div>
				)):null}
			</div>
		)
	}
}
