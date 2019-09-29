import React from "react";
import Modal from 'react-modal';
import {Icon} from "antd";
import adBillingStore from "../../../../mobx/mediaManage/otherMediaManage/ad-billing-store";
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
			proportion:'',
			nameError:false,
			appid:'',
			adtype:'',
			divideType:'',
			appValue:''
		};
		this.openModal = this.openModal.bind(this);
		this.closeModal = this.closeModal.bind(this);
	}
	openModal(appid,adtype,divideType,val) {
		val=val==null||val==0?'':val;
		this.setState({
			modalIsOpen: true,
			appid:appid,
			adtype:adtype,
			divideType:divideType,
			appValue:val
		});
	}
	closeModal() {
		this.setState({modalIsOpen: false});
	}
	confirm(){
		let {appid,adtype,divideType,appValue}=this.state
		if(divideType==null){
			adBillingStore.modificationBilling(appid,adtype,1,appValue,0,this.callback.bind(this));
		}else{
			if(divideType==1){
				adBillingStore.modificationBilling(appid,adtype,1,appValue,0,this.callback.bind(this));
			}else{
				adBillingStore.modificationBilling(appid,adtype,2,0,appValue,this.callback.bind(this));
			}
		}
	}
	callback(){
		this.setState({modalIsOpen: false});
		this.props.call()
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
								<span>广告权限设置</span>
							</div>
							<div>
								<Icon type="close-circle" onClick={()=>this.closeModal()}/>
							</div>
						</div>
						<div style={{padding:10}}>
							<div style={{width:'100%',height:30,marginBottom:10}}>
								<div className="form-left1">
									{this.state.divideType==null?'分成比例':(this.state.divideType==1?'分成比例':'cpm')}
								</div>
								<div className="form-right1">
									<input type="text" className="border1" value={this.state.appValue}
										   onChange={(e)=>this.setState({appValue:e.target.value})}
									/>
									{this.state.divideType==null?'%':(this.state.divideType==1?'%':'元')}
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
