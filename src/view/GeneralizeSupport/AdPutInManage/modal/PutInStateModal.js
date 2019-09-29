import React from "react";
import Modal from 'react-modal';
import {Icon} from "antd";
import {observer} from "mobx-react";
import Client from "../../../../common/lead-api";
const customStyles = {
	content: {
		top: '50%',
		left: '50%',
		right: 'auto',
		bottom: 'auto',
		marginRight: '-10%',
		transform: 'translate(-50%, -50%)',
		background: '#fff',
		position: 'fixed',
		width: 750,
		padding: 0,
	},
	overlay: {
		background: 'rgba(0,0,0,.5)'
	}
};
Modal.setAppElement('#app')
@observer
export default class PutInStateModal extends React.Component {
	constructor() {
		super()
		this.state = {
			putIntState:'',
		};
		this.openModal = this.openModal.bind(this);
		this.closeModal = this.closeModal.bind(this);
	}
	openModal(id) {
		Client.getNullArgument('adv/getPutState?activeId='+id).then(res=>{
			if(res.status==200){
				this.setState({
					putIntState:res.message
				})
			}else{
				Client.showTank(false,res.message)
			}
		})
		this.setState({modalIsOpen: true});
	}
	closeModal() {
		this.setState({modalIsOpen: false});
	}
	confirm() {
		this.closeModal()
	}
	render() {
		return (
			<div>
				<Modal
					isOpen={this.state.modalIsOpen}
					onRequestClose={this.closeModal}
					style={customStyles}
					contentLabel="Example Modal"
				>
					<div style={{width: '100%', height: '100%'}}>
						<div className='modalHeader'>
							<div>
								<span>查看投放状态</span>
							</div>
							<div>
								<Icon type="close-circle" onClick={() => this.closeModal()}/>
							</div>
						</div>
						<div className="accountListRow" style={{height:50,paddingTop:10}}>
							<div className="form-left" >
								该广告活动:
							</div>
							<div className="form-right-multiple" style={{display:'block',lineHeight:'30px',color:'#48bfeb'}}>
								{this.state.putIntState}
							</div>
						</div>
						<div className="submit-flex-end">
							<button className="confirmBtn" onClick={() => this.confirm()}>确定</button>
						</div>
					</div>
				</Modal>
			</div>
		)
	}
}
