import React from "react";
import Modal from 'react-modal';
import "../../../../styles/common.css";
import {Icon,Pagination} from "antd";
import {observer} from "mobx-react";
import AdvertiserManageStore from "../../../../mobx/dspManage/AdvertiserAudit/AdvertiserAudit-store";
const headArr = [
	{ name: 'ID', w: '25%' },
	{ name: '资质类型', w: '25%' },
	{ name: '文件名称', w: '25%' },
	{ name: '资质查看', w: '25%' },
]
const typeArr=[
	{name:'营业执照',value:'BUSINESSLICENSE'},
	{name:'ICP',value:'ICP'},
	{name:'身份证',value:'IDCARD'},
	{name:'组织结构代码',value:'ORGANIZATINCODE'},
	{name:'其他',value:'OTHER'},
]
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
export default class AptitudeModal extends React.Component {
	constructor() {
		super()
		this.state = {
			modalIsOpen: false,
			id:'',
			page:1,
			size:5
		};
		this.openModal = this.openModal.bind(this);
		this.closeModal = this.closeModal.bind(this);
	}
	openModal(id) {
		this.setState({
			modalIsOpen: true,
			id:id
		});
		AdvertiserManageStore.SeeQ(id,this.state.page,this.state.size)
	}
	closeModal() {
		this.setState({modalIsOpen: false});
	}
	onPageChange(e){
		this.setState({
			page:e
		})
		AdvertiserManageStore.SeeQ(this.state.id,e,this.state.size)
	}
	onShowSizeChange(c,p){
		this.setState({
			page:c,
			size:p
		})
		AdvertiserManageStore.SeeQ(this.state.id,c,p)
	}
	typePipei(type){
		for(let i=0;i<typeArr.length;i++){
			if(type==typeArr[i].value){
				return typeArr[i].name
			}
		}
	}
	render() {
		let {seeQArr,totals} = AdvertiserManageStore
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
								<span>广告主资质</span>
							</div>
							<div>
								<Icon type="close-circle" onClick={()=>this.closeModal()}/>
							</div>
						</div>
						<div style={{padding:10}}>
							<div className="contentBulk1" style={{padding:10}}>
								<div className="table-head">
									{
										headArr.map((i, k) => (
											<div key={k} style={{ width: i.w, float: 'left', textAlign: 'center' }}>
												{i.name}
											</div>
										))
									}
								</div>
								{seeQArr[0]==undefined?<div className="table-body">
									<div style={{ width:'100%'}} className='gezi'>
										该广告主无资质
									</div>
								</div>:null}
								{seeQArr.map((i, k) => (
									<div className="table-body" key={k} style={{ background: k % 2 == 0 ? '#fff' : '#fafafa' }}>
										<div style={{ width: headArr[0].w }} className='gezi'>
											{i.id}
										</div>
										<div style={{ width: headArr[1].w }} className='gezi'>
											{this.typePipei(i.quaType)}
										</div>
										<div style={{ width: headArr[2].w }} className='gezi'>
											{i.quaName}
										</div>
										<div style={{ width: headArr[3].w }} className='gezi'>
											{i.imgUrl==null?null:
											<span className="imgModal" onClick={()=>{
												window.open(i.imgUrl);
											}}>
												<span className='text-center'>
													点击查看资质
												</span>
												<img src={i.imgUrl} alt="" style={{width:100,height:30}} className="dim"/>
											</span>}
										</div>
									</div>
								))}
							</div>
							{seeQArr[0]==undefined?null:<div className='con-head'>
								<Pagination
									pageSizeOptions={['1', '2', '3', '4']}
									showSizeChanger
									defaultPageSize={this.state.size}
									current={this.state.page}
									onChange={this.onPageChange.bind(this)}
									onShowSizeChange={this.onShowSizeChange.bind(this)} defaultCurrent={1} total={totals}
								/>
							</div>}
						</div>
					</div>
				</Modal>
			</div>
		)
	}
}
