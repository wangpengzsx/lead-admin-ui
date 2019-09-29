import React from "react";
import {observer} from "mobx-react";
import newActivityStore from "../../../../mobx/generalizeSupport/AdPutInManage/new-activity-store";
import {Radio} from "antd";


@observer
export default class Activity3 extends React.Component {
	onChange(e){
		newActivityStore.actTerminal=e.target.value
	}

	render() {
		let {actTerminal} = newActivityStore;
		return (
			<div className="accountListRow" style={{height:30}}>
				<div className="form-left">
					<i className="red">*</i> 投放终端：
				</div>
				<div className="form-right-multiple" style={{display:'block'}}>
					<Radio.Group onChange={(e)=>this.onChange(e)} disabled={localStorage.getItem('adActivityId')?true:false} value={actTerminal}>
						<Radio value="APP">APP</Radio>
						<Radio value="PC" disabled={true}>PC</Radio>
					</Radio.Group>
				</div>
			</div>
		)
	}
}
