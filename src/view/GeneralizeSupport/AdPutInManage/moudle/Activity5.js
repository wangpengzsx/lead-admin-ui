import React from "react";
import {observer} from "mobx-react";
import newActivityStore from "../../../../mobx/generalizeSupport/AdPutInManage/new-activity-store";
import {Radio} from "antd";
import Client from "../../../../common/lead-api";

@observer
export default class Activity5 extends React.Component {
	onChange(e){
		newActivityStore.dealType = e.target.value;
		newActivityStore.actDealList = [];
		Client.getNullArgument("leadDeals/search/findAllByDealType?dealType="+e.target.value).then(res=>{
			newActivityStore.dealArr = res._embedded.leadDeals
		})
	}

	render() {
		let {dealType}=newActivityStore;
		return (
			<div className="accountListRow" style={{height:30}}>
				<div className="form-left">
					<i className="red">*</i> 交易类型：
				</div>
				<div className="form-right-multiple" style={{display:'block'}}>
					<Radio.Group onChange={(e)=>this.onChange(e)} disabled={localStorage.getItem('adActivityId')?true:false} value={dealType}>
						<Radio value="RTB">RTB</Radio>
						<Radio value="PD">PD</Radio>
						<Radio value="PDB">PDB</Radio>
					</Radio.Group>
				</div>
			</div>
		)
	}
}
