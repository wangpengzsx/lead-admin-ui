import React from "react";
import {Radio} from "antd";
const RadioGroup = Radio.Group;
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
		localStorage.setItem('timeDuanState',e.target.value);
		if(e.target.value=='no'){
			localStorage.setItem('timeDuan',JSON.stringify([]));
			this.setState({
				timeDuan:[]
			})
		}
		this.setState({
			cycleState:e.target.value
		})
	}
	skip(){
		this.props.history.push({
			pathname:'/timeFrameCom'
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
		return (
			<div>
				<div className="accountListRow" >
					<div className="form-left">
						<i className="red">*</i>投放时段：
					</div>
					<div className="form-right-multiple" >
						<RadioGroup onChange={(e)=>this.onCycleChange(e)}
									value={this.state.cycleState}>
							<Radio value='no'>不限</Radio>
							<Radio value='yes'>设置投放时段</Radio>
						</RadioGroup>
						{this.state.cycleState=='yes'?(<a onClick={()=>{this.skip()}}>设置</a>):null}
					</div>
				</div>
				{this.state.cycleState=='yes'?this.state.timeDuan.map((i,k)=>(
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
