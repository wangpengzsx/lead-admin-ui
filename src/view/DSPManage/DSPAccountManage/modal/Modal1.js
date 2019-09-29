import React from "react";
import Modal from 'react-modal';
import {Icon,Radio} from "antd";
const RadioGroup = Radio.Group;
import {observer} from "mobx-react";
import dspManageStore from "../../../../mobx/dspManage/DSPManageStore/dsp-manage-store";
import Client from '../../../../common/lead-api'
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
	constructor(props) {
		super(props)
		this.state = {
			modalIsOpen: false,
			cycleState:'',
			parentType:'',
			textValue:''
		};
		this.openModal = this.openModal.bind(this);
		this.closeModal = this.closeModal.bind(this);
	}
	onCycleChange(e){
		this.setState({cycleState:e.target.value})
		this.props.onRadioChange(e)
	}
	openModal(id) {
		this.setState({modalIsOpen: true,parentType:id});
		if(id=='0'){
			this.setState({
				cycleState:dspManageStore.modalState4,
				textValue:dspManageStore.modalValue4,
			})
		}
		if(id=='2'){
			this.setState({
				cycleState:dspManageStore.modalState8,
				textValue:dspManageStore.modalValue8,
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
			this.props.onSubmit(this.state.cycleState,this.state.textValue)
			this.closeModal()
		}
	}
	cancel(){
		this.props.onCancel()
		this.closeModal()
	}
	onChange(e){
		this.setState({
			textValue: e.target.value
		})
		this.props.onInputChange(e)
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
								<span>
									{this.state.parentType=='0'?'设置媒体':null}
									{this.state.parentType=='1'?'设置应用版本':null}
									{this.state.parentType=='2'?'设置imei号':null}
								</span>
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
								{this.state.parentType=='0'?'appID':null}
								{this.state.parentType=='1'?'应用版本号':null}
								{this.state.parentType=='2'?'imei号':null}
								，多个信息以英文逗号 , 隔开
							</div>
							<div style={{padding:'10px 0'}}>
								<textarea className="ant-input moreRow" rows="10"
										  value={this.state.textValue}
										  onChange={(e)=>this.onChange(e)}
								></textarea>
							</div>
						</div>
						<div className="submit-flex-end" >
							<button className="modalCancelBtn" onClick={()=>this.cancel()}>取消</button>
							<button className="confirmBtn" onClick={()=>this.confirm()}>确定</button>
						</div>
					</div>
				</Modal>
			</div>
		)
	}
}
