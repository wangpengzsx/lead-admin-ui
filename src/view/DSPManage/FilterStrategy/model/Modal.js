import React from "react";
import Modal from 'react-modal';
import {Icon} from "antd";
import {observer} from "mobx-react";
import filterStrategyStore from '../../../../mobx/dspManage/DSPManageStore/filter-strategy-store'
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
			textValue:filterStrategyStore.value6
		};
		this.openModal = this.openModal.bind(this);
		this.closeModal = this.closeModal.bind(this);
	}
	openModal() {
		this.setState({modalIsOpen: true});
	}
	closeModal() {
		this.setState({modalIsOpen: false});
	}
	confirm(){
		filterStrategyStore.value6=this.state.textValue
		this.closeModal()
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
								<span>设置过滤关键词</span>
							</div>
							<div>
								<Icon type="close-circle" onClick={()=>this.closeModal()}/>
							</div>
						</div>
						<div style={{padding:10}}>
							<div >
								请输入需要过滤的关键词，多个关键词以英文逗号 , 隔开
								（关键词将会在创意名称及分类中生效）
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
