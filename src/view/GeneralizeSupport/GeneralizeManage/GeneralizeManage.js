import React from "react";
import Layout from "../../../layout/Layout";
import {Checkbox,Pagination,Switch} from "antd";
import GeneralizeManageStore from "../../../mobx/generalizeSupport/generalize-manage-store";
import {observer} from "mobx-react";
import Client from '../../../common/lead-api';
import AdSpaceModal from "./Modal/adSpaceModal";
import AdCreativeModal from "./Modal/adCreativeModal";
import {Link} from "react-router-dom";
const headArr=[
	{name:'推广名称',w:'8.6%'},
	{name:'推广状态',w:'8.6%'},
	{name:'推广类型',w:'8.6%'},
	{name:'投放周期',w:'8.6%'},
	{name:'排除天数/日期',w:'8.6%'},
	{name:'每日曝光上限',w:'8.6%'},
	{name:'每日点击上限',w:'8.6%'},
	{name:'投放广告位',w:'8.6%'},
	{name:'关联创意',w:'8.6%'},
	{name:'最后更新时间',w:'8.6%'},
	{name:'操作',w:'8.6%'},
]
@observer
export default class GeneralizeManage extends React.Component {
	constructor(){
		super()
		this.state={
			size:10,
			page:1,
			searchText:'',
			chooseIdArr:[]
		}
	}
	componentWillMount(){
		GeneralizeManageStore.searchGenerArr(this.state.searchText,this.state.page,this.state.size)
	}
	openModal(id){
		this._adSpaceModal.openModal(id)
	}
	openCreativeModal(id){
		this._adCreativeModal.openModal(id)
	}
	onAllChange(e){
		let {GenerArr}=GeneralizeManageStore;
		let arr=[];
		GenerArr.map(i=>arr.push(i.id));
		let arr1=this.state.chooseIdArr;
		if(e.target.checked){
			arr1=arr1.concat(arr);
			arr1=Client.removeDuplicatedItem(arr1);
		}else{
			for(let i=0;i<arr1.length; i++){
				for(let j=0;j<arr.length; j++){
					if(arr1[i]==arr[j]){
						arr1.splice(i,1)
					}
				}
			}
		}
		this.setState({
			chooseIdArr:arr1
		});
	}
	onChange(i){
		let arr=this.state.chooseIdArr;
		if(arr.indexOf(i)>-1){
			let index=arr.indexOf(i);
			if (index > -1) {
				arr.splice(index, 1);
			}
		}else{
			arr.push(i);
		}
		this.setState({
			chooseIdArr:arr
		});
	}
	onPageChange(i){
		this.setState({
			page:i
		})
		GeneralizeManageStore.searchGenerArr(this.state.searchText,i,this.state.size)
	}
	onShowSizeChange(current,pageSize){
		this.setState({
			size:pageSize,
			page:current
		})
		GeneralizeManageStore.searchGenerArr(this.state.searchText,current,pageSize)
	}
	isCheckd(CreativesArr){
		let arr=[]
		for(let i=0; i<CreativesArr.length; i++){
			arr.push(CreativesArr[i].id)
		}
		return Client.isContained(this.state.chooseIdArr,arr);
	}
	callback(){
		GeneralizeManageStore.searchGenerArr(this.state.searchText,this.state.page,this.state.size)
	}
	clickSearch(){
		this.callback();
	}
	openItem(){
		GeneralizeManageStore.changeLeadPlans({ids: this.state.chooseIdArr, field: "status", value: "OPEN"},this.callback.bind(this))
	}
	closeItem(){
		GeneralizeManageStore.changeLeadPlans({ids: this.state.chooseIdArr, field: "status", value: "CLOSED"},this.callback.bind(this))
	}
	removeItem(){
		GeneralizeManageStore.changeLeadPlans({ids: this.state.chooseIdArr, field: "status", value: "DELETED"},this.callback.bind(this))
	}
	onSwitchChange(state,id){
		GeneralizeManageStore.changeLeadPlans({ids: [id], field: "status", value: state=='OPEN'?"CLOSED":"OPEN"},this.callback.bind(this))
	}
	setGeneralizeId(id){
		localStorage.setItem('newGeneralizeActivity',id);
	}
	newSkip(){
		localStorage.removeItem('newGeneralizeActivity')
		this.props.history.push({pathname:'/newGeneralizeActivity'})
	}
	render() {
		let {GenerArr,total}=GeneralizeManageStore;
		return (
			<div>
				<Layout history={this.props.history}/>
				<div className="content">
					<AdSpaceModal ref={(e) => this._adSpaceModal = e}/>
					<AdCreativeModal ref={(e) => this._adCreativeModal = e}/>
					<div className="contentBulk1">
						<div className="con-head">
							<div>
								<button className="borderBtn"
										onClick={()=>{this.newSkip()}}>创建推广活动</button>
								<button className="borderBtn" onClick={()=>this.openItem()}>开启</button>
								<button className="borderBtn" onClick={()=>this.closeItem()}>关闭</button>
								<button className="borderBtn" onClick={()=>this.removeItem()}>删除</button>
							</div>
							<div className="searchInput">
								<input type="text"
									   placeholder="请输入查询的名称和关键字"
									   onChange={(e)=>this.setState({
										   searchText:e.target.value
									   })}
									   className='searchInputText'/>
								<div className='searchInputButton' onClick={()=>this.clickSearch()}></div>
							</div>
						</div>
						<div className="table-head">
							<div  style={{width:'5%',float:'left',textAlign:'center'}}>
								<Checkbox onChange={this.onAllChange.bind(this)}
								checked={this.isCheckd(GenerArr)}/>
							</div>
							{
								headArr.map((i,k)=>(
									<div key={k} style={{width:i.w,float:'left',textAlign:'center'}}>
										{i.name}
									</div>
								))
							}
						</div>
						{
							GenerArr.map((i,k)=>(
								<div key={k} className="table-body" style={{background:k%2==0?'#fff':'#fafafa'}}>
									<div style={{width:'5%'}} className="gezi">
										<Checkbox onChange={this.onChange.bind(this,i.id)}
												  checked={this.state.chooseIdArr.indexOf(i.id)>-1}/>
									</div>
									<div style={{width:headArr[0].w}} title={i.name} className="gezi">
										{i.name}
									</div>
									<div style={{width:headArr[1].w}} className="gezi">
										<Switch checkedChildren="开" unCheckedChildren="关" checked={i.status=='OPEN'} onChange={()=>this.onSwitchChange(i.status,i.id)}/>
									</div>
									<div style={{width:headArr[2].w}} className="gezi">
										{i.type=='GAME'?'游戏':'官网'}
									</div>
									<div style={{width:headArr[3].w}} title={Client.formatDate(i.planStart)+'~'+Client.formatDate(i.planEnd)} className="gezi">
										{Client.formatDate(i.planStart)+'~'+Client.formatDate(i.planEnd)}
									</div>
									<div style={{width:headArr[4].w}}
										 title={i.excludeDates.length+'/'+i.excludeDates.map((a,b)=>{return b==i.excludeDates.length-1?Client.formatDate(a):Client.formatDate(a)+','})}
										 className="gezi">
										{i.excludeDates.length}/{i.excludeDates.map((a,b)=>{return b==i.excludeDates.length-1?Client.formatDate(a):Client.formatDate(a)+','})}
									</div>
									<div style={{width:headArr[5].w}} title={i.maxShow} className="gezi">
										{i.maxShow}
									</div>
									<div style={{width:headArr[6].w}} title={i.maxClick} className="gezi">
										{i.maxClick}
									</div>
									<div style={{width:headArr[7].w}} className="gezi">
										<button className="borderBtn" style={{minWidth:66}} onClick={()=>this.openModal(i.id)}>查看</button>
									</div>
									<div style={{width:headArr[8].w}} className="gezi">
										<button className="borderBtn" style={{minWidth:66}} onClick={()=>this.openCreativeModal(i.id)}>查看</button>
									</div>
									<div style={{width:headArr[9].w}} className="gezi" title={Client.formatDateTime(i.modifyTime)}>
										{Client.formatDateTime(i.modifyTime)}
									</div>
									<div style={{width:headArr[10].w}} className="gezi">
										<Link to={{
											pathname: '/newGeneralizeActivity',
											id: i.id,
										}} onClick={()=>this.setGeneralizeId(i.id)}>编辑</Link>
									</div>
								</div>
							))
						}
						<div className='con-head'>
							<Pagination
								pageSizeOptions={['10','20','50','100']}
								showSizeChanger
								defaultPageSize={this.state.size}
								onChange={this.onPageChange.bind(this)}
								onShowSizeChange={this.onShowSizeChange.bind(this)} defaultCurrent={1} total={total} />
						</div>
					</div>
				</div>
			</div>
		)
	}
}
