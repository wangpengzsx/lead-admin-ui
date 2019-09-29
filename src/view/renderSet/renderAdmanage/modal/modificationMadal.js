import React from "react";
import Modal from 'react-modal';
import {Icon} from "antd";
import RenderSetStore from '../../../../mobx/renderSet/render-set-store';
import {observer} from "mobx-react";
import HintAlert from "../../../common/HintAlert";
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
export default class modificationMadal extends React.Component {
	constructor() {
		super()
		this.state = {
			modalIsOpen: false,
			id:'',
			proportion:'',
			nameError:false
		};
		this.openModal = this.openModal.bind(this);
		this.closeModal = this.closeModal.bind(this);
	}
	openModal(id) {
		this.setState({modalIsOpen: true,id:id});
	}
	closeModal() {
		this.setState({modalIsOpen: false});
	}
	nameChange(e){
		if(!Client.isNumber1(e.target.value)||e.target.value>100||e.target.value<10){
			this.setState({
				nameError:true
			})
		}else{
			this.setState({
				nameError:false
			})
		}
		this.setState({proportion:e.target.value})
	}
	confirm(){
		if(this.state.nameError){
			alert('请按要求填写')
		}else{
			RenderSetStore.changeLeadFallbackDsps({ids: [this.state.id], field: "ratio", value:this.state.proportion });
			setTimeout(()=>{
				RenderSetStore.getLeadFallbackDsps();
			},300)
			this.closeModal();
		}
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
								<span>查看投放广告位</span>
							</div>
							<div>
								<Icon type="close-circle" onClick={()=>this.closeModal()}/>
							</div>
						</div>
						<div style={{padding:10}}>
							<div style={{width:'100%',height:30,marginBottom:10}}>
								<div className="form-left1">
									设置切量比例:
								</div>
								<div className="form-right1">
									<input type="text"
										   className={this.state.nameError?'borderError':'border1'}
										   style={{width:360,height:30}}
										   onChange={e=>this.nameChange(e)}
										   value={this.state.proportion}/>%
									{this.state.nameError?(
										<HintAlert left={360} width={200} message="必须为数字且小于100、大于10"/>
									):null}
								</div>
							</div>
							<div style={{width:'100%',height:30,marginBottom:10}}>
								<div className="form-left1">
								</div>
								<div className="form-right1">
									<i className="color1">说明：切量比例不低于10%，所有打底广告平台切量比例相加为100%</i>
								</div>
							</div>
						</div>
						<div className="submit-flex-end" >
							<button className="modalCancelBtn" >取消</button>
							<button className="confirmBtn" onClick={()=>this.confirm()}>确定</button>
						</div>
					</div>
				</Modal>
			</div>
		)
	}
}
