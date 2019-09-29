import React from "react";
import Modal from 'react-modal';
import {Icon,Radio} from "antd";
const RadioGroup = Radio.Group;
import adBillingStore from "../../../../mobx/mediaManage/otherMediaManage/ad-billing-store";
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
		width:750,
		padding:0,
	},
	overlay:{
		background:'rgba(0,0,0,.5)'
	}
};
Modal.setAppElement('#app')
@observer
export default class billingModal extends React.Component {
	constructor() {
		super()
		this.state = {
			modalIsOpen: false,
			id:'',
			proportion:'',
			nameError:false,
			divideType:1,
			appValue:'',
			choiceArr:[]
		};
		this.openModal = this.openModal.bind(this);
		this.closeModal = this.closeModal.bind(this);
	}
	openModal(arr) {
		this.setState({
			modalIsOpen: true,
			choiceArr:arr
		});
	}
	closeModal() {
		this.setState({modalIsOpen: false});
	}
	confirm(){
		let arr=this.state.choiceArr;
		let arr1=[]
		for(let i=0;i<arr.length;i++){
			arr1.push({
				appId:arr[i].split('@')[0],
				adType:arr[i].split('@')[1],
				divideType:this.state.divideType,
				ratio:this.state.divideType==1?this.state.appValue:0,
				cpm:this.state.divideType==2?this.state.appValue:0,
			})
		}
		adBillingStore.modificationBillingPiliang(arr1,this.callback.bind(this));
	}
	callback(){
		this.setState({modalIsOpen: false});
		this.props.call()
	}
	onOpenChange(e){
		this.setState({
			divideType:e.target.value
		})
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
								<span>批量设置</span>
							</div>
							<div>
								<Icon type="close-circle" onClick={()=>this.closeModal()}/>
							</div>
						</div>
						<div style={{padding:10}}>
							<div style={{width:'100%',height:30,marginBottom:10}}>
								<div className="form-left1">
									第三方媒体计费设置
								</div>
								<div className="form-right1" style={{flexDirection:'row',display: 'flex'}}>
									<RadioGroup onChange={(e)=>this.onOpenChange(e)}  value={this.state.divideType}>
										<Radio value={1}>分成比例</Radio>
										<Radio value={2}>CPM</Radio>
									</RadioGroup>
									<input type="text" className="border1"
										   style={{width:200}}
										   onChange={(e)=>this.setState({appValue:e.target.value})}
										   value={this.state.appValue}/>
									{this.state.divideType==1?'%':'元'}
								</div>
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
