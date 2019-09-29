import React from "react";
import Modal from 'react-modal';
import {Icon,Radio} from "antd";
const RadioGroup = Radio.Group;
import adPermissionStore from "../../../../mobx/mediaManage/otherMediaManage/ad-permission-store";
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
export default class permissionModal extends React.Component {
	constructor() {
		super()
		this.state = {
			modalIsOpen: false,
			id:'',
			proportion:'',
			nameError:false,
			openVal:0,
			bannerVal:0
		};
		this.openModal = this.openModal.bind(this);
		this.closeModal = this.closeModal.bind(this);
	}
	openModal(id) {
		this.setState({modalIsOpen: true,id:id});
		Client.getleadArr('leadApps/search/spec', {query:'id==*'+id+'*',page:0,size:1,sort:'name'})
			.then(res=>{
				this.setState({
					openVal:res._embedded.leadApps[0].hasOpen,
					bannerVal:res._embedded.leadApps[0].hasNative
				})
			})
	}
	closeModal() {
		this.setState({modalIsOpen: false});
	}
	confirm(){
		adPermissionStore.modifyApp1(this.state.id,{hasOpen:this.state.openVal,hasNative:this.state.bannerVal},this.callback.bind(this));
	}
	callback(){
		this.setState({modalIsOpen: false});
	}
	onOpenChange(e){
		this.setState({
			openVal:e.target.value
		})
	}
	onBannerChange(e){
		this.setState({
			bannerVal:e.target.value
		})
	}
	render() {
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
								<span>广告权限设置</span>
							</div>
							<div>
								<Icon type="close-circle" onClick={()=>this.closeModal()}/>
							</div>
						</div>
						<div style={{padding:10}}>
							<div style={{width:'100%',height:30,marginBottom:10}}>
								<div className="form-left1">
									开屏广告:
								</div>
								<div className="form-right1">
									<RadioGroup onChange={(e)=>this.onOpenChange(e)} value={this.state.openVal}>
										<Radio value={0}>关闭</Radio>
										<Radio value={1}>开启</Radio>
									</RadioGroup>
								</div>
							</div>
							<div style={{width:'100%',height:30,marginBottom:10}}>
								<div className="form-left1">
									信息流广告:
								</div>
								<div className="form-right1">
									<div className="form-right1">
										<RadioGroup onChange={(e)=>this.onBannerChange(e)} value={this.state.bannerVal}>
											<Radio value={0}>关闭</Radio>
											<Radio value={1}>开启</Radio>
										</RadioGroup>
									</div>
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
