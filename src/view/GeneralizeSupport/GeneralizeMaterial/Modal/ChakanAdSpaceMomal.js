import React from "react";
import Modal from 'react-modal';
import {Icon} from "antd";
import {observer} from "mobx-react";
import UploadOrginality from "../../../../mobx/generalizeSupport/upload-originality-store";
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
export default class ChakanAdSpaceMomal extends React.Component {
	constructor() {
		super()
		this.state = {
			modalIsOpen: false
		};
		this.openModal = this.openModal.bind(this);
		this.closeModal = this.closeModal.bind(this);
	}
	openModal(formId,sizeId) {
		this.setState({modalIsOpen: true});
		UploadOrginality.getAdSpace({adFormId:formId,spaceSizeId:sizeId})
	}
	closeModal() {
		this.setState({modalIsOpen: false});
	}
	render() {
		let {SpaceFormListInfo}=UploadOrginality
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
							该推广投放 <span className="blueFont">{SpaceFormListInfo.length}</span>	个广告位
						</div>
						<div className="contentBulk1" style={{border:'none'}}>
							<div className="table-head">
								{headArr.map((i,k)=>(
									<div key={k} style={{width:i.w,fontSize:12,float:'left',textAlign:'center'}}>
										{i.name}
									</div>
								))}
							</div>
							{SpaceFormListInfo.map((i,k)=>(
								<div className="table-body" key={k}>
									<div className="gezi" style={{width:headArr[0].w}}>
										{i.AD_SPACE_NAME}
									</div>
									<div className="gezi" style={{width:headArr[1].w}}>
										{i.APP_NAME}
									</div>
									<div className="gezi" style={{width:headArr[2].w}}>
										{i.AD_TYPE}
									</div>
									<div className="gezi" style={{width:headArr[3].w}}>
										{i.WIDTH}×{i.HEIGHT}
									</div>
									<div className="gezi" style={{width:headArr[4].w}}>
										{i.CREATIVE_FORMAT}
									</div>
									<div className="gezi" style={{width:headArr[5].w}}>
										{i.FLOOR_PRICE}
									</div>
									<div className="gezi" style={{width:headArr[6].w}}>
										{i.AVE_PV}
									</div>
								</div>
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
