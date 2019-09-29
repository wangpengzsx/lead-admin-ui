import React from "react";
import {observer} from "mobx-react";
import newActivityStore from "../../../../mobx/generalizeSupport/AdPutInManage/new-activity-store";
import {Radio} from "antd";

@observer
export default class Activity8 extends React.Component {
	onChange(e){
		newActivityStore.useUpType=e.target.value;
	}

	render() {
		let {useUpType}=newActivityStore
		return (
			<div className="accountListRow" style={{height:60}}>
				<div className="form-left">
					<i className="red">*</i> 预算消耗形式：
				</div>
				<div className="form-right-multiple" style={{height:60}}>
					<Radio.Group onChange={(e)=>this.onChange(e)} value={useUpType} style={{lineHeight:'30px'}}>
						<Radio value="QUICK">尽速</Radio><i className="color1">在可投放时段内尽可能获得更多的展现，建议与精准定向配合使用</i><br/>
						<Radio value="UNIFORM">标准</Radio><i className="color1">预算均匀地分配到每日可投放时段中</i>
					</Radio.Group>
				</div>
			</div>
		)
	}
}
