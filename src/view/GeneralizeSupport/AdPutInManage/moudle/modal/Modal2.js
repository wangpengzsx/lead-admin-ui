import React from "react";
import Modal from 'react-modal';
import {Icon,Radio} from "antd";
const RadioGroup = Radio.Group;
import Client from '../../../../../common/lead-api'
import {observer} from "mobx-react";
const customStyles = {
	content : {
		top : '50%',
		left : '50%',
		right : 'auto',
		bottom : 'auto',
		marginRight : '-10%',
		transform : 'translate(-50%, -50%)',
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
		this.afterOpenModal = this.afterOpenModal.bind(this);
		this.closeModal = this.closeModal.bind(this);
	}

	componentWillMount() {
	}

	componentDidMount() {

	}
	onCycleChange(e){
		this.setState({cycleState:e.target.value})
	}
	openModal(id) {
		this.setState({modalIsOpen: true});

	}


	afterOpenModal() {

	}

	closeModal() {
		this.setState({modalIsOpen: false});
	}

	confirm(){
		this.closeModal()
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
								<span>设置投放应用版本</span>
							</div>
							<div>
								<Icon type="close-circle" onClick={()=>this.closeModal()}/>
							</div>
						</div>
						<div style={{padding:10}}>

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
