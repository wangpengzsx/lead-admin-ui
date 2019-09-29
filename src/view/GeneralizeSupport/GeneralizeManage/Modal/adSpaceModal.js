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
		borderColor:'#dbdee1',
		borderWidth:1,
		width:614,
		height:500,
		padding:0,
	},
	overlay:{
		background:'rgba(0,0,0,.5)'
	}
};
const headArr =[{name: '广告位名称', w: '14.28%'},
	{name: '所属应用', w: '14.28%'},
	{name: '广告形式', w: '14.28%'},
	{name: '创意尺寸', w: '14.28%'},
	{name: '素材规格', w: '14.28%'},
	{name:'广告位底价', w:'14.28%'},
	{name:'广告位日均pv', w:'14.28%'},
]
Modal.setAppElement('#app')
@observer
export default class adSpaceModal extends React.Component {
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
		GeneralizeManageStore.checkAdSpace({popuId:id})
	}
	closeModal() {
		this.setState({modalIsOpen: false});
	}
	render() {
		let {checkAdSpaces}=GeneralizeManageStore
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
								<span>查看投放广告位</span>
							</div>
							<div>
								<Icon type="close-circle" onClick={()=>this.closeModal()}/>
							</div>
						</div>
						<div className="modal-top">
							该推广投放 <span className="blueFont">{checkAdSpaces.length}</span>	个广告位
						</div>
						<div className='contentBulk1' style={{border:'none'}}>
							<div className="table-head">
								{headArr.map((i,k)=>(
									<div key={k} style={{width:i.w,fontSize:12,float:'left',textAlign:'center'}}>
										{i.name}
									</div>
								))}
							</div>
							{checkAdSpaces.map((i,k)=>(
								i.adSpace?
								<div className="table-body" key={k}>
									<div className="gezi" style={{width:headArr[0].w}}>
										{i.adSpace.adSpaceName}
									</div>
									<div className="gezi" style={{width:headArr[1].w}}>
										{i.adSpace.appName}
									</div>
									<div className="gezi" style={{width:headArr[2].w}}>
										{i.adForm.adType}
									</div>
									<div className="gezi" style={{width:headArr[3].w}}>
										{i.adSpace.width}*{i.adSpace.height}
									</div>
									<div className="gezi" style={{width:headArr[4].w}}>
										{i.adForm.creativeFormat}
									</div>
									<div className="gezi" style={{width:headArr[5].w}}>
										{i.adSpace.floorPrice}
									</div>
									<div className="gezi" style={{width:headArr[6].w}}>
										{i.adSpace.avePv}
									</div>
								</div>:null
							))}
						</div>
						<div className="submit-flex-end" >
							<button className="modalCancelBtn"  onClick={()=>this.closeModal()}>取消</button>
							<button className="confirmBtn"  onClick={()=>this.closeModal()}>确定</button>
						</div>
					</div>
				</Modal>
			</div>
		)
	}
}
