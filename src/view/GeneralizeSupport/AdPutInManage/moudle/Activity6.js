import React from "react";
import {observer} from "mobx-react";
import newActivityStore from "../../../../mobx/generalizeSupport/AdPutInManage/new-activity-store";
import {Select} from "antd";
const Option = Select.Option;

@observer
export default class Activity6 extends React.Component {
	onChange(e){
		console.log(e)
		newActivityStore.actDealList=e
	}


	render() {
		let {dealArr,actDealList}=newActivityStore
		return (
			<div className="accountListRow" style={{height:30}}>
				<div className="form-left">
					<i className="red">*</i> 关联Deal：
				</div>
				<div className="form-right-multiple" style={{display:'block'}}>
					<Select mode="multiple"
							value={[...actDealList]}
							placeholder="请选择"
							style={{ width: 200 }}
							onChange={(e)=>this.onChange(e)}>
						{
							dealArr.map((i,k)=>(
								<Option value={i.id} key={k}>{i.dealName}</Option>
							))
						}
					</Select>
				</div>
			</div>
		)
	}
}
