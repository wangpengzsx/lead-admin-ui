import React from "react";
import Modal from 'react-modal';
import {Icon,Checkbox} from "antd";
import {observer} from "mobx-react";
import RefundStroe from "../../../../mobx/finance/apidsp/refund-stroe"
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
		width:700,
		padding:0,
	},
	overlay:{
		background:'rgba(0,0,0,.5)'
	}
};
Modal.setAppElement('#app')
@observer
export default class ChongzhiMadal extends React.Component {
	constructor() {
		super()
		this.state = {
			modalIsOpen: false,
			id:'',
			amount:'',
			remark:'',
			searchText:'',
			page:1,
			size:10,
			dspName:'',
			nameError:false,
			checked:false,
			balance:0,
			tuiError:false
		};
		this.openModal = this.openModal.bind(this);
		this.closeModal = this.closeModal.bind(this);
	}
	openModal(balance,name,id,searchText,page,size) {
		this.setState({balance:balance,dspName:name,modalIsOpen: true,id:id,searchText: searchText,page:page,size:size});
	}
	closeModal() {
		this.setState({modalIsOpen: false,checked:false,amount:'',remark:''});
	}
	confirm(){
		if(this.state.checked) {
			if(Client.isNumber1(this.state.amount)&&this.state.amount<=this.state.balance){
				RefundStroe.rechargeDsp({
					leadDsp: {id: this.state.id},
					adFinaceType: 'REFUND',
					description: this.state.remark,
					operationAmount: this.state.amount
				})
				this.closeModal();
				setTimeout(() => {
					RefundStroe.searchItem(this.state.searchText, this.state.page, this.state.size)
				}, 300)
			}else{
				Client.showTank(false,'请正确填写信息');
			}
		}else{
			Client.showTank(false,'请确认退款金额')
		}
	}
	isAccunt(value){
		if(Client.isNumber1(value)){
			this.setState({nameError:false})
			if(value>this.state.balance){
				this.setState({
					tuiError:true
				})
			}else{
				this.setState({
					tuiError:false
				})
			}
		}else{
			this.setState({nameError: true})
		}
	}
	changeAccunt(e){
		this.isAccunt(e.target.value);
		this.setState({amount:e.target.value})
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
								<span>退款</span>
							</div>
							<div>
								<Icon type="close-circle" onClick={()=>this.closeModal()}/>
							</div>
						</div>
						<div style={{padding:10}}>
							<div style={{width:'100%',height:30,marginBottom:10}}>
								<div className="form-left1">
									退款金额:
								</div>
								<div className="form-right1">
									<input type="text"   className={this.state.nameError||this.state.tuiError?'borderError':'border1'} name="avePv"
										   onChange={e=>this.changeAccunt(e)}/>
									{this.state.nameError||this.state.tuiError?(
										<HintAlert left={360} width={100} message={this.state.tuiError?'退款金额不能大于账户余额':"请输入数字"}/>
									):null}
								</div>
							</div>
							<div style={{width:'100%',height:90,marginBottom:10}}>
								<div className="form-left1">
									备注:
								</div>
								<div className="form-right1">
									<textarea type="text"  className="ant-input moreRow"
											  style={{width:360,height:90}}
											  onChange={e=>this.setState({remark:e.target.value})}/>
								</div>
							</div>
							<div style={{width:'100%',height:30,marginBottom:10}}>
								<div className="form-left1">
									<Checkbox checked={this.state.checked} onChange={()=>this.setState({checked:!this.state.checked})}/>
								</div>
								<div className="form-right1">
									<i className="color2">请再次确认，您即将为广告主{this.state.dspName}退款 {this.state.amount}元</i>
								</div>
							</div>
						</div>
						<div className="submit-content" >
							<button className="cancelBtn" onClick={()=>this.closeModal()}>取消</button>
							<button className="confirmBtn" onClick={()=>this.confirm()}>确定</button>
						</div>
					</div>
				</Modal>
			</div>
		)
	}
}
