import React from "react";
import {observer} from "mobx-react";
import newActivityStore from "../../../../mobx/generalizeSupport/AdPutInManage/new-activity-store";
import {Radio} from "antd";

@observer
export default class Activity13 extends React.Component {
	onChange(e){
		newActivityStore.dayCvState=e.target.value;
	}
	onInputChange(e){
		newActivityStore.dayCv=e.target.value;
	}

	render() {
		let {dayCvState,dayCv}=newActivityStore
		return (
			<div className="accountListRow" style={{height:30}}>
				<div className="form-left">
					<i className="red">*</i> 日点击上限：
				</div>
				<div className="form-right-multiple" >
					<Radio.Group onChange={(e)=>this.onChange(e)} value={dayCvState}>
						<Radio value="NO">不限制</Radio>
						<Radio value="YES">设置日点击上限</Radio>
					</Radio.Group>
					{dayCvState=='YES'?<input
						className="border1"
						value={dayCv}
						onChange={(e)=>this.onInputChange(e)}
						style={{ width: '100px'}}
					/>:null}

				</div>
			</div>
		)
	}
}
