import React from "react";
import {observer} from "mobx-react";
import newActivityStore from "../../../../mobx/generalizeSupport/AdPutInManage/new-activity-store";
import {Radio} from "antd";

@observer
export default class Activity4 extends React.Component {
	onChange(e){
		newActivityStore.adType=e.target.value;
	}

	render() {
		let {adType}=newActivityStore;
		return (
			<div className="accountListRow" style={{height:30}}>
				<div className="form-left">
					<i className="red">*</i> 投放广告类型：
				</div>
				<div className="form-right-multiple" style={{display:'block'}} >
					<Radio.Group onChange={(e)=>this.onChange(e)} disabled={localStorage.getItem('adActivityId')?true:false} value={adType}>
						<Radio value="OPENSCREEN">开屏</Radio>
						<Radio value="BANNER">banner</Radio>
						<Radio value="POPUP">插屏</Radio>
						<Radio value="NATIVE">信息流</Radio>
						<Radio value="VIDEO">激励视频</Radio>
					</Radio.Group>
				</div>
			</div>
		)
	}
}
