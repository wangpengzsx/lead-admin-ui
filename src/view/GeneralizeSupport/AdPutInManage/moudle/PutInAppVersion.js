import React from "react";
import "../../../../styles/common.css";
import {Radio} from "antd";
import Modal2 from "./modal/Modal2";
const RadioGroup = Radio.Group;

export default class PutInAppVersion extends React.Component {
	constructor(props){
		super(props)
		this.state={
			cycleState:'no',
		}
	}
	componentWillMount(){
		console.log(this.props.timeDuan);
	}
	onCycleChange(e){
		this.setState({
			cycleState:e.target.value
		})
	}
	skip(){
		this._modal.openModal();
	}

	render() {
		return (
			<div>
				<div className="accountListRow" >
					<Modal2 ref={e=>this._modal = e}/>
					<div className="form-left">
						<i className="red">*</i>投放应用版本：
					</div>
					<div className="form-right-multiple" >
						<RadioGroup onChange={(e)=>this.onCycleChange(e)}
									value={this.state.cycleState}>
							<Radio value='no'>不限</Radio>
							<Radio value='yes'>设置投放应用版本</Radio>
						</RadioGroup>
						{this.state.cycleState=='yes'?(<a onClick={()=>{this.skip()}}>设置</a>):null}
					</div>
				</div>
			</div>

		)
	}
}
