import React from "react";
import {observer} from "mobx-react";
import newActivityStore from "../../../../mobx/generalizeSupport/AdPutInManage/new-activity-store";
import {Radio} from "antd";

@observer
export default class Activity12 extends React.Component {
	onChange(e){
		newActivityStore.dayPvState=e.target.value;
	}
	onInputChange(e){
		newActivityStore.dayPv=e.target.value;
	}

	render() {
		let {dayPvState,dayPv}=newActivityStore
		return (
			<div className="accountListRow" style={{height:30}}>
				<div className="form-left">
					<i className="red">*</i> 日曝光上限：
				</div>
				<div className="form-right-multiple" >
					<Radio.Group onChange={(e)=>this.onChange(e)} value={dayPvState}>
						<Radio value="NO">不限制</Radio>
						<Radio value="YES">设置日曝光上限</Radio>
					</Radio.Group>
					{dayPvState=='YES'?<input
						className="border1"
						value={dayPv}
						onChange={(e)=>this.onInputChange(e)}
						style={{ width: '100px'}}
					/>:null}
					{dayPvState=='YES'?<i className="color1">
						说明：此处填写PV值
					</i>:null}
				</div>
			</div>
		)
	}
}
