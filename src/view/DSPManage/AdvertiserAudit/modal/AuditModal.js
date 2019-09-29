import React from "react";
import Modal from 'react-modal';
import {Icon,Input,Radio} from "antd";
const { TextArea } = Input;
const RadioGroup = Radio.Group;
import {observer} from "mobx-react";
import AdvertiserManageStore from "../../../../mobx/dspManage/AdvertiserAudit/AdvertiserAudit-store";
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
export default class AuditModal extends React.Component {
	constructor() {
		super()
		this.state = {
			modalIsOpen: false,
			id:'',
			value:'',
			description:''
		};
		this.openModal = this.openModal.bind(this);
		this.closeModal = this.closeModal.bind(this);
	}
	openModal(id,value,description) {
		this.setState({
			modalIsOpen: true,
			id:id,
			value:value,
			description:description
		});
	}
	closeModal() {
		this.setState({modalIsOpen: false});
	}
	onChange(e){
		this.setState({
			value:e.target.value
		})
	}
	confirm(){
		if(typeof this.state.id=='string'||typeof this.state.id=='number'){
			if(this.state.value=='ONLINE'){
				AdvertiserManageStore.creatingAdvertiser({ ids: [this.state.id], field: "lookState", value: this.state.value },
					this.callback.bind(this))
			}else{
				AdvertiserManageStore.creatingAdvertiser1(
					{ ids: [this.state.id], field: "lookState", value: this.state.value },
					{ ids: [this.state.id], field: "lookDescription", value: this.state.description },
					this.callback.bind(this))
			}
		}else if(typeof this.state.id=='object'){
			if(this.state.value=='ONLINE'){
				AdvertiserManageStore.creatingAdvertiser({ ids: this.state.id, field: "lookState", value: this.state.value },
					this.callback.bind(this))
			}else{
				AdvertiserManageStore.creatingAdvertiser1(
					{ ids: this.state.id, field: "lookState", value: this.state.value },
					{ ids: this.state.id, field: "lookDescription", value: this.state.description },
					this.callback.bind(this))
			}
		}
	}
	callback(){
		this.setState({modalIsOpen: false});
		this.props.call();
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
								<span>广告主审核</span>
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
									<RadioGroup onChange={(e)=>this.onChange(e)} value={this.state.value}>
										<Radio value="ONLINE">通过</Radio>
										<Radio value="AuditFail">拒绝</Radio>
									</RadioGroup>
								</div>
							</div>
							{this.state.value=="AuditFail"?
							<div style={{width:'100%',height:94,marginBottom:10}}>
								<div className="form-left1">
									拒绝原因：
								</div>
								<div className="form-right1">
									<TextArea rows={4}
											  onChange={e=>this.setState({description:e.target.value})}
											  value={this.state.description}
											  className='moreRow'
											  style={{width:360,height:94}}
									>
									</TextArea>
								</div>
							</div>:null}
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
