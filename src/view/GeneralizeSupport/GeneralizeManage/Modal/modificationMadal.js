import React from "react";
import Modal from 'react-modal';
import {Icon} from "antd";
import GeneralizeManageStore from "../../../../mobx/generalizeSupport/generalize-manage-store";
import {observer} from "mobx-react";
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
		borderColor:'#dbdee1',
		borderWidth:1,
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
export default class modificationMadal extends React.Component {
	constructor() {
		super()
		this.state = {
			modalIsOpen: false,
			proportion:'',
			formId:'',
			spaceId:'',
			isApp:true,
			nameError:false
		};
		this.openModal = this.openModal.bind(this);
		this.closeModal = this.closeModal.bind(this);
	}
	openModal(formId,spaceId,isApp,value) {
		this.setState({modalIsOpen: true});
		this.setState({
			formId:formId,
			spaceId:spaceId,
			isApp:isApp,
			proportion:value
		})
	}
	closeModal() {
		this.setState({modalIsOpen: false});
	}
	nameChange(e){
		if(!Client.isNumber1(e.target.value)||e.target.value>100){
			this.setState({
				nameError:true
			})
		}else{
			this.setState({
				nameError:false
			})
		}
		this.setState({proportion:e.target.value})
	}
	confirm(){
		if(this.state.nameError){
			alert('请按规则填写')
		}else{
			let arr=GeneralizeManageStore.spaceCreatives;
			let aaa=false,index=0;
			for(let i=0; i<arr.length; i++){
				if(this.state.isApp){
					if(arr[i].adSpaceId){
						if(this.state.spaceId==arr[i].adSpaceId&&this.state.formId==arr[i].adFormId){
							aaa=true;
							index=i;
							break;
						}
					}
				}else{
					if(arr[i].appGroupId){
						if(this.state.spaceId==arr[i].appGroupId&&this.state.formId==arr[i].adFormId){
							aaa=true;
							index=i;
							break;
						}
					}
				}
			}
			if(aaa){
				arr[index].popuRatio=this.state.proportion;
			}else{
				let data={}
				if(this.state.isApp){
					data={
						adSpaceId:this.state.spaceId,
						adFormId:this.state.formId,
						popuRatio:this.state.proportion,
						creativeId:''
					}
				}else{
					data={
						appGroupId:this.state.spaceId,
						adFormId:this.state.formId,
						popuRatio:this.state.proportion,
						creativeId:''
					}
				}
				arr.push(data)
			}
			GeneralizeManageStore.spaceCreatives=arr;
			this.closeModal();
		}
	}
	cancel(){
		let arr=GeneralizeManageStore.spaceCreatives;
		let aaa=false,index=0;
		for(let i=0; i<arr.length; i++){
			if(this.state.isApp){
				if(arr[i].adSpaceId){
					if(this.state.spaceId==arr[i].adSpaceId&&this.state.formId==arr[i].adFormId){
						aaa=true;
						index=i;
						break;
					}
				}
			}else{
				if(arr[i].appGroupId){
					if(this.state.spaceId==arr[i].appGroupId&&this.state.formId==arr[i].adFormId){
						aaa=true;
						index=i;
						break;
					}
				}
			}
		}
		if(aaa){
			if(arr[index].creativeId!=''){
				arr[index].popuRatio='';
			}else{
				arr.splice(index,1);
			}
		}
		GeneralizeManageStore.spaceCreatives=arr;
		this.closeModal();
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
								<span>设置切量比例</span>
							</div>
							<div>
								<Icon type="close-circle" onClick={()=>this.closeModal()}/>
							</div>
						</div>
						<div style={{padding:10}}>
							<div style={{width:'100%',height:30,marginBottom:10}}>
								<div className="form-left1">
									设置切量比例:
								</div>
								<div className="form-right1">
									<input type="text"
										   className={this.state.nameError?'borderError':'border1'}
										   style={{width:360,height:30}}
										   onChange={e=>this.nameChange(e)}
										   value={this.state.proportion}/>%
									{this.state.nameError?(
										<HintAlert left={360} width={170} message="必须为数字且小于100"/>
									):null}
								</div>
							</div>
							<div style={{width:'100%',height:30,marginBottom:10}}>
								<div className="form-left1">
								</div>
								<div className="form-right1">
									<i className="color1">说明：切量比例不低于10%，所有打底广告平台切量比例相加为100%</i>
								</div>
							</div>
						</div>
						<div className="submit-flex-end" >
							<button className="modalCancelBtn"  onClick={()=>this.cancel()}>取消</button>
							<button className="confirmBtn" onClick={()=>this.confirm()}>确定</button>
						</div>
					</div>
				</Modal>
			</div>
		)
	}
}
