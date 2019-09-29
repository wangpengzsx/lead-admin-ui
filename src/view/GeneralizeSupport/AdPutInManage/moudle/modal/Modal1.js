import React from "react";
import Modal from 'react-modal';
import {Icon,Radio,Checkbox} from "antd";
const RadioGroup = Radio.Group;
import Client from '../../../../../common/lead-api'
import GeneralizeManageStore from "../../../../../mobx/generalizeSupport/generalize-manage-store";
import newActivityStore from "../../../../../mobx/generalizeSupport/AdPutInManage/new-activity-store"

import {observer} from "mobx-react";
const customStyles = {
	content : {
		top : '50%',
		left : '50%',
		right : 'auto',
		bottom : 'auto',
		marginRight : '-10%',
		transform : 'translate(-50%, -50%)',
		background:'#fff',
		position:'fixed',
		width:750,
		padding:0,
	},
	overlay:{
		background:'rgba(0,0,0,.5)'
	}
};

Modal.setAppElement('#app')
@observer
export default class Modal1 extends React.Component {
	constructor() {
		super()
		this.state = {
			modalIsOpen: false,
			cycleState:0,
			parentType:'',
			textValue:'',
			ids:[]

		};


		this.openModal = this.openModal.bind(this);
		this.afterOpenModal = this.afterOpenModal.bind(this);
		this.closeModal = this.closeModal.bind(this);
	}

	componentWillMount() {
		GeneralizeManageStore.getAppArr()
	}

	componentDidMount() {

	}
	onCycleChange(e){
		this.setState({cycleState:e.target.value})
	}
	openModal() {
		this.setState({modalIsOpen: true});
	}


	afterOpenModal() {

	}

	closeModal() {
		this.setState({modalIsOpen: false});
	}
	confirm(){
		this.closeModal();
	}
	cancel(){
		this.closeModal();
		newActivityStore.mediaValue=[];
		newActivityStore.mediaLabelValue=[];
	}
	onCheckChange(e,name){
		let arr=newActivityStore.mediaValue;
		if(arr.indexOf(e.target.value)>-1){
			let index=arr.indexOf(e.target.value);
			if (index > -1) {
				arr.splice(index, 1);
			}
		}else{
			arr.push(e.target.value);
		}
		newActivityStore.mediaValue=arr;
		let arr1=newActivityStore.mediaLabelValue;
		if(arr1.indexOf(name)>-1){
			let ind=arr1.indexOf(name);
			if (ind > -1) {
				arr1.splice(ind, 1);
			}
		}else{
			arr1.push(name);
		}
		console.log(arr1);
		newActivityStore.mediaLabelValue=arr1;
	}

	render() {
		let {appArr}=GeneralizeManageStore;
		let {mediaValue}=newActivityStore;
		return(
			<div>

				<Modal
					isOpen={this.state.modalIsOpen}
					onAfterOpen={this.afterOpenModal}
					onRequestClose={this.closeModal}
					style={customStyles}
					contentLabel="Example Modal"
				>
					<div style={{width:'100%',height:'100%'}}>
						<div className='modalHeader'>
							<div>
								<span>设置投放媒体</span>
							</div>
							<div>
								<Icon type="close-circle" onClick={()=>this.closeModal()}/>
							</div>
						</div>
						<div style={{padding:10}}>
							{appArr.map((i,k)=>(
								<div key={k} style={{height:30,float:'left'}}>
									<Checkbox onChange={(e)=>this.onCheckChange(e,i.NAME)}
											  value={i.APP_ID?'@'+i.APP_ID:'#'+i.APP_GROUP_ID}
											  checked={mediaValue.indexOf(i.APP_ID?'@'+i.APP_ID:'#'+i.APP_GROUP_ID)>-1}
											  style={{marginRight:20}}>{i.NAME}</Checkbox>
								</div>

							))}


						</div>
						<div className="submit-flex-end" >
							<button className="modalCancelBtn" onClick={()=>this.cancel()}>取消</button>
							<button className="confirmBtn" onClick={()=>this.confirm()}>确定</button>
						</div>
					</div>
				</Modal>
			</div>
		)
	}
}
