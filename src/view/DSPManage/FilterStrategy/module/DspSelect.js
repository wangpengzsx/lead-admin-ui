import React from "react";
import {Select} from "antd";
const Option=Select.Option;
import {observer} from "mobx-react";
import filterStrategyStore from '../../../../mobx/dspManage/DSPManageStore/filter-strategy-store'
@observer
export default class DspSelect extends React.Component {
	constructor(){
		super()
	}
	onTypeChange(e){
		filterStrategyStore.value2=e
	}
	render() {
		let {dspArr,value2}=filterStrategyStore
		return (
			<div className="accountListRow" style={{height:30}}>
				<div className="form-left">
					<i className="red">*</i>适用DSP平台：
				</div>
				<div className="form-right-multiple" style={{display:'block'}}>
					<Select
						placeholder="请选择DSP平台"
						maxTagCount={1}
						value={value2}
						onChange={this.onTypeChange.bind(this)}
						style={{ width: '200px' ,marginLeft:10}}
					>
						{dspArr.map((i, k) => (
								<Option value={i.id} key={k}>{i.name}</Option>
						))}
					</Select>
				</div>
			</div>
		)
	}
}
