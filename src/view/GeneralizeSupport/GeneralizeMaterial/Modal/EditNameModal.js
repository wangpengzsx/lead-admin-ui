import React from "react";
import Modal from 'react-modal';
import {Icon} from "antd";
import CreativesManageStore from "../../../../mobx/generalizeSupport/creatives-manage-store";
import {observer} from "mobx-react";
import HintAlert from "../../../common/HintAlert";
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
		borderColor:'#dbdee1',
		borderWidth:1,
		padding:0,
	},
	overlay:{
		background:'rgba(0,0,0,.5)'
	}
};
Modal.setAppElement('#app')
@observer
export default class EditNameModal extends React.Component {
	constructor() {
		super()
		this.state = {
			modalIsOpen: false,
			proportion:'',
			nameError:false,
			ids:[]
		};
		this.openModal = this.openModal.bind(this);
		this.closeModal = this.closeModal.bind(this);
	}
	openModal(ids) {
		this.setState({modalIsOpen: true,ids:ids});
	}
	closeModal() {
		this.setState({modalIsOpen: false});
	}
	confirm(){
		CreativesManageStore.changeCreativesArr({ids: this.state.ids, field: "name", value: this.state.proportion});
		this.closeModal();
		this.props.editChange();
	}
	nameChange(e){
		if(e.target.value==''){
			this.setState({
				nameError:true
			})
		}else {
			this.setState({
				nameError:false
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
								<span>修改创意名称</span>
							</div>
							<div>
								<Icon type="close-circle" onClick={()=>this.closeModal()}/>
							</div>
						</div>
						<div style={{padding:10}}>
							<div style={{width:'100%',height:30,marginBottom:10}}>
								<div className="form-left1">
									修改创意名称:
								</div>
								<div className="form-right1">
									<input type="text"  className={this.state.nameError?'borderError':'border1'}
										   name="avePv"
										   onChange={e=>this.nameChange(e)}/>
									{this.state.nameError?(
										<HintAlert left={360} width={170} message="创意名称不能为空"/>
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
