import React from "react";
import Modal from 'react-modal';
import {Icon,Radio} from "antd";
import {observer} from "mobx-react";
import Client from "../../../../common/lead-api";
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
			value:''
		};
		this.openModal = this.openModal.bind(this);
		this.closeModal = this.closeModal.bind(this);
	}
	openModal(id,type) {
		this.setState({
			modalIsOpen: true,
			id:id,
			value:type
		});
	}
	closeModal() {
		this.setState({modalIsOpen: false});
	}
	confirm(){
		Client.getNullArgument('media/updateAppType?appId='+this.state.id+'&appType='+this.state.value).then(res=>{
			if(res.status==200){
				this.closeModal()
				this.props.call()
			}
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
								<span>媒体类型设置</span>
							</div>
							<div>
								<Icon type="close-circle" onClick={()=>this.closeModal()}/>
							</div>
						</div>
						<div style={{padding:10}}>
							<div style={{width:'100%',height:30,marginBottom:10}}>
								<div className="form-left1">
									媒体类型
								</div>
								<div className="form-right1">
									<Radio.Group onChange={(e)=>this.setState({value:e.target.value})} value={this.state.value}>
										<Radio value="LENOVO">自有媒体</Radio>
										<Radio value="THIRD">第三方媒体</Radio>
									</Radio.Group>
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
