import React from "react";
import {observer} from "mobx-react";
@observer
export default class Activity2 extends React.Component {
	render() {
		return (
			<div className="accountListRow" style={{height:30}}>
				<div className="form-left">
					<i className="red">*</i> 广告活动id：
				</div>
				<div className="form-right-multiple" style={{display:'block'}}>
					{localStorage.getItem('adActivityId')}
				</div>
			</div>
		)
	}
}
