import React from "react";
import "../../../../styles/common.css";
import {Radio} from "antd";
const RadioGroup = Radio.Group;
import Modal1 from "./modal/Modal1";
import newActivityStore from "../../../../mobx/generalizeSupport/AdPutInManage/new-activity-store";
import Client from "../../../../common/lead-api";
import {observer} from "mobx-react";

@observer
export default class PutInMedia extends React.Component {
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
		newActivityStore.mediaState=e.target.value;
	}
	skip(){
		this._modal.openModal()
	}



	render() {
		let {mediaState,mediaLabelValue}=newActivityStore;
		console.log(mediaLabelValue.length);
		return (
			<div>
				<div className="accountListRow" >
					<Modal1 ref={e=>this._modal = e}/>
					<div className="form-left">
						<i className="red">*</i>投放媒体：
					</div>
					<div className="form-right-multiple" >
						<RadioGroup onChange={(e)=>this.onCycleChange(e)}
									value={mediaState}>
							<Radio value='no'>不限</Radio>
							<Radio value='yes'>设置投放媒体</Radio>
						</RadioGroup>
						{mediaState=='yes'?(<a onClick={()=>{this.skip()}}>设置</a>):null}
					</div>
				</div>
				{mediaState=='yes'&&mediaLabelValue.length>0?(
					<div className="accountListRow" style={{height:30}}>
						<div className="form-left">
						</div>
						<div className="form-right-multiple" style={{display: 'inherit'}}>
							已设置投放媒体:{Client.arrStr(mediaLabelValue)}
						</div>
					</div>
				):null}






			</div>

		)
	}
}
