import React from "react";
import {observer} from "mobx-react";
import newActivityStore from "../../../../mobx/generalizeSupport/AdPutInManage/new-activity-store"


@observer
export default class Activity11 extends React.Component {
	constructor(){
		super()
		this.state={
			value:''
		}
	}
	componentWillMount(){

	}
	onChange(e){
		newActivityStore.activePrice=e.target.value;
	}
	render() {
		let {activePrice}=newActivityStore
		return (
			<div className="accountListRow" style={{height:30}}>
				<div className="form-left">
					<i className="red">*</i> 出价：
				</div>
				<div className="form-right-multiple" style={{display:'block'}}>
					<input
						className="border1"
						value={activePrice}
						onChange={(e)=>this.onChange(e)}
						style={{ width: '300px'}}
					/>
					元/CPM
					<i className="color1">说明：PD、PDB交易方式价格以Deal为准</i>
				</div>
			</div>
		)
	}
}
