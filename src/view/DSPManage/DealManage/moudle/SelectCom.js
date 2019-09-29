import React from "react";
import {Select} from "antd";
import newAgentStore from "../../../../mobx/dspManage/DSPManageStore/new-agent-store"
import {observer} from "mobx-react";
const Option=Select.Option;
@observer
export default class SelectCom extends React.Component {
	constructor(){
		super()
		this.state={
			value:''
		}
	}
	componentWillMount(){
		newAgentStore.getnewAgent(100,1,'')
	}
	onChange(e){
		this.props.call(e)
	}
	render() {
		let {newAgentArr}=newAgentStore;
		return (
			<div className="accountListRow" style={{height:30}}>
				<div className="form-left">
					<i className="red">*</i> {this.props.label}：
				</div>
				<div className="form-right-multiple" style={{display:'block'}}>
					<Select value={this.props.value} style={{ width: 120 }} onChange={(e)=>this.onChange(e)}>
						{newAgentArr.map((i,k)=>(
							<Option value={i.id} key={k}>{i.name}</Option>
						))}
					</Select>
				</div>
			</div>
		)
	}
}
