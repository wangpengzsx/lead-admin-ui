import React from "react";
import {observer} from "mobx-react";
import newActivityStore from "../../../../mobx/generalizeSupport/AdPutInManage/new-activity-store"


@observer
export default class Activity1 extends React.Component {
	constructor(){
		super()
		this.state={
			value:''
		}
	}
	componentWillMount(){

	}
	onChange(e){
		newActivityStore.actName=e.target.value;
	}
	render() {
		let {actName}=newActivityStore
		return (
			<div className="accountListRow" style={{height:30}}>
				<div className="form-left">
					<i className="red">*</i> 广告活动名称：
				</div>
				<div className="form-right-multiple" style={{display:'block'}}>
					<input
						className="border1"
						value={actName}
						onChange={(e)=>this.onChange(e)}
						style={{ width: '300px'}}
					/>
				</div>
			</div>
		)
	}
}
