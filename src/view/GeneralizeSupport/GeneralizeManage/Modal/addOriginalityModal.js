import React from "react";
import Modal from 'react-modal';
import {Icon,Pagination,Radio} from "antd";
import GeneralizeManageStore from "../../../../mobx/generalizeSupport/generalize-manage-store";
import {observer} from "mobx-react";
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
		width:614,
		height:446,
		padding:0,
		borderColor:'#dbdee1',
		borderWidth:1,
	},
	overlay:{
		background:'rgba(0,0,0,.5)'
	}
};
const headArr =[{name: '创意id', w: '16%'},
	{name: '创意', w: '16%'},
	{name: '创意名称', w: '16%'},
	{name: '创意尺寸', w: '16%'},
	{name: '素材规格', w: '16%'},
	{name:'上传时间', w:'16%'},
]
Modal.setAppElement('#app')
@observer
export default class addOriginalityModal extends React.Component {
	constructor() {
		super()
		this.state = {
			modalIsOpen: false,
			radioId:'',
			formId:'',
			spaceId:'',
			isApp:true,
			sizeId:'',
			searchText:'',
			clicks:'',
			page:1,
			size:10,
		};
		this.openModal = this.openModal.bind(this);
		this.closeModal = this.closeModal.bind(this);
	}
	openModal(fromId,sizeId,clicks,spaceId,isApp) {
		this.setState({
			formId:fromId,
			spaceId:spaceId,
			sizeId:sizeId,
			isApp:isApp,
			clicks:clicks
		})
		GeneralizeManageStore.getCreativeSpace({adFormId:fromId,adSizeId:sizeId,
			clickActions:clicks,creativeName:this.state.searchText,pageNo:this.state.page,pageSize:this.state.size})
		let arr=GeneralizeManageStore.spaceCreatives;
		for(let i=0; i<arr.length; i++){
			if(isApp){
				if(arr[i].adSpaceId){
					if(spaceId==arr[i].adSpaceId&&fromId==arr[i].adFormId){
						this.setState({
							radioId:arr[i].creativeId
						})
						break;
					}
				}
			}else{
				if(arr[i].appGroupId){
					if(spaceId==arr[i].appGroupId&&fromId==arr[i].adFormId){
						this.setState({
							radioId:arr[i].creativeId
						})
						break;
					}
				}
			}
		}
		this.setState({modalIsOpen: true});
	}
	closeModal() {
		this.setState({modalIsOpen: false,page:1});
	}
	searchUser(){
		GeneralizeManageStore.getCreativeSpace({adFormId:this.state.formId,adSizeId:this.state.sizeId,
			clickActions:this.state.clicks,creativeName:this.state.searchText,pageNo:this.state.page,pageSize:this.state.size})
	}
	radioChange(id){
		console.log(id);
		this.setState({
			radioId:id
		})
	}
	confirm(){
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
			arr[index].creativeId=this.state.radioId;
		}else{
			let data={}
			if(this.state.isApp){
				data={
					adSpaceId:this.state.spaceId,
					adFormId:this.state.formId,
					popuRatio:'',
					creativeId:this.state.radioId
				}
			}else{
				data={
					appGroupId:this.state.spaceId,
					adFormId:this.state.formId,
					popuRatio:'',
					creativeId:this.state.radioId
				}
			}
			arr.push(data)
		}
		GeneralizeManageStore.spaceCreatives=arr;
		this.closeModal();
	}
	   onPageChange(e){
		this.setState({
			page:e
		})
		setTimeout(()=>{
			GeneralizeManageStore.getCreativeSpace({adFormId:this.state.formId,adSizeId:this.state.sizeId,
				clickActions:this.state.clicks,creativeName:this.state.searchText,pageNo:this.state.page,pageSize:this.state.size})
		},300)
	}
	onShowSizeChange(page,size){
		this.setState({
			page:page,
			size:size
		})
		setTimeout(()=>{
			GeneralizeManageStore.getCreativeSpace({adFormId:this.state.formId,adSizeId:this.state.sizeId,
				clickActions:this.state.clicks,creativeName:this.state.searchText,pageNo:this.state.page,pageSize:this.state.size})
		},300)
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
			if(arr[index].popuRatio!=''){
				arr[index].creativeId='';
			}else{
				arr.splice(index,1)
			}
		}
		this.setState({
			radioId:''
		})
		GeneralizeManageStore.spaceCreatives=arr;
		this.closeModal()
	}
	render() {
		let {creativeArr,totalEle}=GeneralizeManageStore;
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
								<span>关联创意</span>
							</div>
							<div>
								<Icon type="close-circle" onClick={()=>this.closeModal()}/>
							</div>
						</div>
						<div className="con-head" style={{paddingRight:10}}>
							<div>
							</div>
							<div className="searchInput">
								<input type="text"
									   placeholder="请输入查询的名称和关键字"
									   onChange={(e)=>this.setState({searchText:e.target.value})}
									   className='searchInputText'/>
								<div className='searchInputButton' onClick={()=>this.searchUser()}></div>
							</div>
						</div>
						<div className='contentBulk1' style={{border:'none'}}>
							<div className="table-head" >
								<div  style={{width:'4%',fontSize:12,float:'left',textAlign:'center',height:29}}>
								</div>
								{headArr.map((i,k)=>(
									<div key={k} style={{width:i.w,fontSize:12,float:'left',textAlign:'center'}}>
										{i.name}
									</div>
								))}
							</div>
							<div  style={{width:'100%'}}>
								{creativeArr.map((i,k)=>(
									<div className="table-body" key={k}>
										<div className="geziwudian" style={{width:'4%',textOverflow:'none'}}>
											<Radio onChange={()=>this.radioChange(i.id)} checked={this.state.radioId==i.id}/>
										</div>
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
											{Client.formatDateTime(i.createTime)}
										</div>
									</div>
								))}
							</div>
						</div>
						<div className="con-foot" style={{paddingLeft:10}}>
							<Pagination pageSizeOptions={['10','20','50','100']}
										showSizeChanger
										defaultPageSize={this.state.size}
										onChange={this.onPageChange.bind(this)}
										onShowSizeChange={this.onShowSizeChange.bind(this)}
										defaultCurrent={this.state.page} total={totalEle} />
						</div>
						<div className="submit-flex-end">
							<button className="cancelBtn"  onClick={()=>this.cancel()}>取消</button>
							<button className="confirmBtn" onClick={()=>this.confirm()}>确定</button>
						</div>
					</div>
				</Modal>
			</div>
		)
	}
}
