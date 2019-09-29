import React from "react";
import Modal from 'react-modal';
import {Icon} from "antd";
import {observer} from "mobx-react";
import Client from "../../../../common/lead-api";
import HintAlert from "../../../common/HintAlert";
import CreativesManageStore from "../../../../mobx/generalizeSupport/creatives-manage-store";
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
		width:800,
		padding:0,
		borderColor:'#dbdee1',
		borderWidth:1,
	},
	overlay:{
		background:'rgba(0,0,0,.5)'
	}
};
Modal.setAppElement('#app')
@observer
export default class EditUrlModal extends React.Component {
	constructor() {
		super()
		this.state = {
			modalIsOpen: false,
			proportion:'',
			urlError:false,
			ids:[]
		};
		this.openModal = this.openModal.bind(this);
		this.closeModal = this.closeModal.bind(this);
	}
	openModal(ids) {
		this.setState({modalIsOpen: true,ids:ids,proportion:''});
	}
	closeModal() {
		this.setState({modalIsOpen: false,urlError:false});
	}
	confirm(){
		if(Client.isUrl(this.state.proportion)){
			CreativesManageStore.changeCreativesArr({ids: this.state.ids, field: "clickTargetURL", value: this.state.proportion});
			this.closeModal();
			this.props.editChange();
			this.setState({urlError:false})
		}else {
			this.setState({urlError:true})
		}
	}
	urlChange(e){
		if(Client.isUrl(e.target.value)){
			this.setState({
				urlError:false
			})
		}else {
			this.setState({
				urlError:true
			})
		}
		this.setState({proportion:e.target.value})
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
								<span>修改创意到达地址</span>
							</div>
							<div>
								<Icon type="close-circle" onClick={()=>this.closeModal()}/>
							</div>
						</div>
						<div style={{padding:10}}>
							<div style={{width:'100%',height:30,marginBottom:10}}>
								<div className="form-left1">
									修改创意到达地址:
								</div>
								<div className="form-right1">
									<input type="text"
										   className={this.state.urlError?'borderError':'border1'}
										   name="avePv"
										   value={this.state.proportion}
										   onChange={e=>this.urlChange(e)}/>
									{this.state.urlError?(
										<HintAlert left={360} width={170} message="地址的格式不正确"/>
									):null}
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
