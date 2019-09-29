import React from "react";
import Modal from 'react-modal';
import {Icon,Radio} from "antd";
const RadioGroup = Radio.Group;
import omfManageStore from "../../../../mobx/finance/omfManage/omf-manage-store";
import {observer} from "mobx-react";
const customStyles = {
	content : {
		top                   : '50%',
		left                  : '50%',
		right                 : 'auto',
		bottom                : 'auto',
		marginRight           : '-10%',
		transform             : 'translate(-50%, -50%)',
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
export default class billingModal extends React.Component {
	constructor() {
		super()
		this.state = {
			modalIsOpen: false,
			id:'',
			date:'',
			isPass:1,
			title:''
		};
		this.openModal = this.openModal.bind(this);
		this.closeModal = this.closeModal.bind(this);
	}
	openModal(id,date,state,str) {
		let pass=0
		if(str=='财务'){
			pass=state;
		}else{
			if(state==3){
				pass=1
			}else if(state==4){
				pass=2
			}else{
				pass=1
			}
		}
		this.setState({
			modalIsOpen: true,
			id:id,
			date:date,
			title:str,
			isPass:pass
		});
	}
	closeModal() {
		this.setState({modalIsOpen: false});
	}
	confirm(){
		let pass=0
		if(this.state.title=='财务'){
			pass=this.state.isPass;
		}else{
			if(this.state.isPass==1){
				pass=3
			}else{
				pass=4
			}
		}
		omfManageStore.modificationAudit(this.state.id,this.state.date,pass,this.callback.bind(this));
	}
	callback(){
		this.setState({modalIsOpen: false});
		this.props.call()
	}
	onIsPassChange(e){
		this.setState({
			isPass:e.target.value
		})
	}
	render() {
		return(
			<div>
				<Modal
					isOpen={this.state.modalIsOpen}
					onRequestClose={this.closeModal}
					style={customStyles}
					contentLabel="Example Modal"
				>
					<div style={{width:'100%',height:'100%'}}>
						<div className='modalHeader'>
							<div>
								<span>{this.state.title}审核</span>
							</div>
							<div>
								<Icon type="close-circle" onClick={()=>this.closeModal()}/>
							</div>
						</div>
						<div style={{padding:10}}>
							<div style={{width:'100%',height:30,marginBottom:10}}>
								<div className="form-left1">
									审核：
								</div>
								<div className="form-right1">
									<RadioGroup onChange={(e)=>this.onIsPassChange(e)} value={this.state.isPass}>
										<Radio value={1}>通过</Radio>
										<Radio value={2}>拒绝</Radio>
									</RadioGroup>
								</div>
							</div>
						</div>
						<div className="submit-flex-end" >
							<button className="modalCancelBtn" onClick={()=>this.closeModal()}>取消</button>
							<button className="confirmBtn" onClick={()=>this.confirm()}>确定</button>
						</div>
					</div>
				</Modal>
			</div>
		)
	}
}
