import React from "react";
import {Select} from "antd";
const Option=Select.Option;
import {observer} from "mobx-react";
import filterStrategyStore from '../../../../mobx/dspManage/DSPManageStore/filter-strategy-store'
import generalizeManageStore from '../../../../mobx/generalizeSupport/generalize-manage-store'
@observer
export default class MediaSelect extends React.Component {
	constructor(){
		super()
		this.state={
			value:''
		}
	}
	onTypeChange(e){
		filterStrategyStore.value3=e
	}
	render() {
		let {appArr}=generalizeManageStore
		let {value3}= filterStrategyStore
		return (
			<div className="accountListRow" style={{height:30}}>
				<div className="form-left">
					<i className="red">*</i>适用媒体：
				</div>
				<div className="form-right-multiple" style={{display:'block'}}>
					<Select
						placeholder="请选择媒体"
						maxTagCount={1}
						value={value3}
						onChange={this.onTypeChange.bind(this)}
						style={{ width: '200px' ,marginLeft:10}}
					>
						{appArr.map((i, k) => (
							<Option value={i.APP_ID?'@'+i.APP_ID:'$'+i.APP_GROUP_ID} key={k}>{i.NAME}</Option>
						))}
					</Select>
				</div>
			</div>
		)
	}
}
