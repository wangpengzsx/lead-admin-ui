import React from "react";
import Modal from 'react-modal';
import {Icon} from "antd";
import GeneralizeManageStore from "../../../../mobx/generalizeSupport/generalize-manage-store";
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
		width:614,
		height:500,
		padding:0,
		borderColor:'#dbdee1',
		borderWidth:1,
	},
	overlay:{
		background:'rgba(0,0,0,.5)'
	}
};
const headArr =[{name: '创意id', w: '16.66%'},
	{name: '创意', w: '16.66%'},
	{name: '创意名称', w: '16.66%'},
	{name: '创意尺寸', w: '16.66%'},
	{name: '素材规格', w: '16.66%'},
	{name:'上传时间', w:'16.66%'},
]
Modal.setAppElement('#app')
@observer
export default class adCreativeModal extends React.Component {
	constructor() {
		super()
		this.state = {
			modalIsOpen: false
		};
		this.openModal = this.openModal.bind(this);
		this.closeModal = this.closeModal.bind(this);
	}
	openModal(id) {
		this.setState({modalIsOpen: true});
		GeneralizeManageStore.checkAdCreative({popuId:id})
	}
	closeModal() {
		this.setState({modalIsOpen: false});
	}
	render() {
		let {checkAdCreatives}=GeneralizeManageStore
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
								<span>查看关联创意</span>
							</div>
							<div>
								<Icon type="close-circle" onClick={()=>this.closeModal()}/>
							</div>
						</div>
						<div className="modal-top">
							该推广关联了 <span className="blueFont">{checkAdCreatives.length}</span>	个创意
						</div>
						<div className="contentBulk1" style={{border:'none'}}>
							<div className="table-head">
								{headArr.map((i,k)=>(
									<div key={k} style={{width:i.w,fontSize:12,float:'left',textAlign:'center'}}>
										{i.name}
									</div>
								))}
							</div>
							{checkAdCreatives.map((i,k)=>(
								<div className="table-body" key={k}>
									<div className="gezi" style={{width:headArr[0].w}}>
										{i.id}
									</div>
									<div className="gezi" style={{width:headArr[1].w}}>
									</div>
									<div className="gezi" style={{width:headArr[2].w}}>
										{i.name}
									</div>
									<div className="gezi" style={{width:headArr[3].w}}>
										{i.width}×{i.height}
									</div>
									<div className="gezi" style={{width:headArr[4].w}}>
										{i.creativeFormat}
									</div>
									<div className="gezi" style={{width:headArr[5].w}}>
										{i.createTime}
									</div>
								</div>
							))}
						</div>
						<div className="submit-flex-end" >
							<button className="modalCancelBtn" onClick={()=>this.closeModal()}>取消</button>
							<button className="confirmBtn" onClick={()=>this.closeModal()} >确定</button>
						</div>
					</div>
				</Modal>
			</div>
		)
	}
}
