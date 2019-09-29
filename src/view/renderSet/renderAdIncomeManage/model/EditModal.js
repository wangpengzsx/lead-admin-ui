import React from "react";
import Modal from 'react-modal';
import {Icon} from "antd";
import {observer} from "mobx-react";
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
const headArr=[
	{name:'日期',w:'11.11%'},
	{name:'第三方appid',w:'11.11%'},
	{name:'第三方广告位id',w:'11.11%'},
	{name:'收入',w:'11.11%'},
	{name:'展现数',w:'11.11%'},
	{name:'CPM',w:'11.11%'},
	{name:'点击数',w:'11.11%'},
	{name:'点击率',w:'11.11%'},
	{name:'CPC',w:'11.11%'},
];
Modal.setAppElement('#app')
@observer
export default class EditModal extends React.Component {
	constructor() {
		super()
		this.state = {
			modalIsOpen: false,
			obj:{},
			rowArr:[
				{name:'日期',value:''},
				{name:'第三方appid',value:''},
				{name:'第三方广告位id',value:''},
				{name:'收入',value:''},
				{name:'展现数',value:''},
				{name:'CPM',value:''},
				{name:'点击数',value:''},
				{name:'点击率',value:''},
				{name:'CPC',value:''}
			]}
		this.openModal = this.openModal.bind(this);
		this.closeModal = this.closeModal.bind(this);
	}
	openModal(i) {
		let arr=[
			{name:'日期',value:i.eventDate},
			{name:'第三方appid',value:i.otherAppId},
			{name:'第三方广告位id',value:i.otherSpaceId},
			{name:'收入',value:i.income},
			{name:'展现数',value:i.pv},
			{name:'CPM',value:i.cpm},
			{name:'点击数',value:i.cv},
			{name:'点击率',value:i.cvRatio},
			{name:'CPC',value:i.cpc}
		]
		this.setState({modalIsOpen: true,obj:i,rowArr:arr});
	}
	closeModal() {
		this.setState({modalIsOpen: false});
	}
	confirm(){
		let obj={
			id: this.state.obj.id,
			eventDate: this.state.rowArr[0].value,
			otherAppId: this.state.rowArr[1].value,
			otherSpaceId: this.state.rowArr[2].value,
			income: this.state.rowArr[3].value,
			pv: this.state.rowArr[4].value,
			cpm: this.state.rowArr[5].value,
			cv: this.state.rowArr[6].value,
			cvRatio: this.state.rowArr[7].value,
			cpc: this.state.rowArr[8].value,
		}
		Client.createObject('strategy/updateExcelInfo',obj).then(res=>{
			this.closeModal()
			this.props.call()
		})
	}
	onChange(e,k){
		let arr=this.state.rowArr;
		arr[k].value=e.target.value
		this.setState({rowArr: arr})
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
								<span>编辑</span>
							</div>
							<div>
								<Icon type="close-circle" onClick={()=>this.closeModal()}/>
							</div>
						</div>
						<div className="table-head">
							{headArr.map((i,k)=>{
								return(
									<div key={k} style={{width:i.w,float:'left',textAlign:'center',color:'#808080',lineHeight:'29px',height:'30px'}} title={i.name} className="gezi">
										{i.name}
									</div>
								)
							})}
						</div>
						<div className="table-body" >
							{this.state.rowArr.map((i,k)=>(
								<div className="gezi" style={{width:'11.1%'}} key={k}>
									<input
										value={i.value}
										className="border1"
										onChange={(e)=>this.onChange(e,k)}
										style={{width: '90%', height: 30}}
									/>
								</div>))}
						</div>
						<div className="submit-flex-end" >
							<button className="modalCancelBtn"  onClick={()=>this.closeModal()}>取消</button>
							<button className="confirmBtn" onClick={()=>this.confirm()}>确定</button>
						</div>
					</div>
				</Modal>
			</div>
		)
	}
}
