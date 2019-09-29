import React from "react";
import Modal from 'react-modal';
import {Icon,Radio} from "antd";
import Client from '../../../../common/lead-api'
import {observer} from "mobx-react";
import addPutInStrategyStore from "../../../../mobx/renderSet/PutInStrategyManage/add-putin-strategy-store"
const RadioGroup = Radio.Group;
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
export default class Modal1 extends React.Component {
	constructor() {
		super()
		this.state = {
			modalIsOpen: false,
			cycleState:0,
			parentType:'',
			textValue:''
		};
		this.openModal = this.openModal.bind(this);
		this.closeModal = this.closeModal.bind(this);
	}
	onCycleChange(e){
		this.setState({cycleState:e.target.value})
	}
	openModal(id) {
		this.setState({modalIsOpen: true,parentType:id});
		if(id=='0'){
			this.setState({
				cycleState:addPutInStrategyStore.modalState5,
				textValue:addPutInStrategyStore.value5
			})
		}else{
			this.setState({
				cycleState:addPutInStrategyStore.modalState6,
				textValue:addPutInStrategyStore.value6
			})
		}
	}
	closeModal() {
		this.setState({modalIsOpen: false});
	}
	confirm(){
		if(this.state.cycleState==''){
			Client.showTank(false,'请选择黑白名单')
		}else{
			if(this.state.parentType=='0'){
				addPutInStrategyStore.modalState5=this.state.cycleState;
				addPutInStrategyStore.value5=this.state.textValue;
			}else{
				addPutInStrategyStore.modalState6=this.state.cycleState;
				addPutInStrategyStore.value6=this.state.textValue;
			}
			this.closeModal()
		}
	}
	onChange(e){
		this.setState({
			textValue: e.target.value
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
								<span>{this.state.parentType=='0'?'设置投放应用版本':'设置投放imei'}</span>
							</div>
							<div>
								<Icon type="close-circle" onClick={()=>this.closeModal()}/>
							</div>
						</div>
						<div style={{padding:10}}>
							<div style={{padding:'10px 0'}}>
								<RadioGroup onChange={(e)=>this.onCycleChange(e)}
											value={this.state.cycleState}>
									<Radio value="0">白名单</Radio>
									<Radio value="1">黑名单</Radio>
								</RadioGroup>
							</div>
							<div >
								请输入
								{this.state.parentType=='0'?'应用版本':'imei'}
								号，多个信息以英文逗号 , 隔开
							</div>
							<div style={{padding:'10px 0'}}>
								<textarea className="ant-input moreRow" rows="10"
										  value={this.state.textValue}
										  onChange={(e)=>this.onChange(e)}
								></textarea>
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
