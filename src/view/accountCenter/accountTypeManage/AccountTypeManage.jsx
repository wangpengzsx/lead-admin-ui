import React from "react";
import {Checkbox} from 'antd';
import {observer} from "mobx-react";
import EditAccountStore from "../../../mobx/accountCenter/edit-account-store";
import EditAccountTypeStore from "../../../mobx/accountCenter/edit-account-type-store";
import {Pagination} from 'antd';
import {Link} from "react-router-dom";
import LeadApi from "../../../common/lead-api";
import Layout from "../../../layout/Layout";
const headArr=[{name:'账户类型',w:'24%'},
	{name:'创建时间',w:'24%'},
	{name:'最后更新时间',w:'24%'},
	{name:'操作',w:'24%'}];
@observer
export default class AccountTypeManage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			chooseIdArr:[],
			page:1,
			size:10,
			searchName:'',
			paddleId:''
		};
	}
	componentWillMount(){
		EditAccountStore.getleadUserGroups(this.state.size,this.state.page)
	}
	onAllChange(e){
		if(e.target.checked){
			let {leadUserGroups}=EditAccountStore;
			let arr=[];
			leadUserGroups.map(i=>arr.push(i.id));
			this.setState({
				chooseIdArr:arr
			})
		}else{
			this.setState({
				chooseIdArr:[]
			})
		};
	}
	onChange(i){
		let arr=this.state.chooseIdArr;
		if(arr.indexOf(i)>-1){
			let index=arr.indexOf(i);
			if (index > -1) {
				arr.splice(index, 1);
			}
		}else{
			arr.push(i)
		}
		this.setState({
			chooseIdArr:arr
		})
	}
	removeItem(){
		this.state.chooseIdArr.map(i=>EditAccountTypeStore.deleteItem(i))
		let that=this;
		setTimeout(()=>{
			EditAccountStore.getleadUserGroups(this.state.size,this.state.page)
			that.setState({
				chooseIdArr:[]
			})
		},300)
	}
	searchName(){
		EditAccountStore.searchUserGroups(this.state.searchName);
	}
	onPageChange(i){
		this.setState({
			page:i
		})
		EditAccountStore.getleadUserGroups(this.state.size,i)
	}
	onShowSizeChange(current, pageSize) {
		this.setState({
			page:current,
			size:pageSize
		})
		EditAccountStore.getleadUserGroups(pageSize,current)
	}
	setAccountTypeId(id){
		localStorage.setItem('editAccountType',id);
	}
	render() {
		let {leadUserGroups,total}=EditAccountStore;
		return (
			<div>
				<Layout history={this.props.history}/>
				<div className="content">
					<div className="contentBulk1">
						<div className="con-head">
							<div>
								<button className='borderBtn'onClick={()=>{this.props.history.push({pathname:'/newAccountType'})}}>
									创建
								</button>
								<button className='borderBtn' onClick={()=>this.removeItem()}>删除</button>
							</div>
							<div className="searchInput">
								<input type="text"
									   placeholder="请输入查询的名称和关键字"
									   onChange={(e)=>this.setState({searchName:e.target.value})}
									   className='searchInputText'/>
								<div className='searchInputButton' onClick={()=>this.searchName()}></div>
							</div>
						</div>
						<div className="table-head">
							<div  style={{width:'4%',float:'left',textAlign:'center'}}>
								<Checkbox onChange={this.onAllChange.bind(this)}
										  checked={this.state.chooseIdArr.length==leadUserGroups.length}/>
							</div>
							{
								headArr.map((i,k)=>(
									<div key={k} style={{width:i.w,float:'left',textAlign:'center'}}>
										{i.name}
									</div>
								))
							}
						</div>
						{leadUserGroups.map((i,k)=>(
							<div className="table-body" key={k}
								 style={{background:k%2==0?'#fff':'#fafafa'}}
								>
								<div  style={{width:'4%'}} className='gezi'>
									<Checkbox onChange={this.onChange.bind(this,i.id)} checked={this.state.chooseIdArr.indexOf(i.id)>-1}/>
								</div>
								<div  style={{width:headArr[0].w}} title={i.name} className='gezi'>
									{i.name}
								</div>
								<div  style={{width:headArr[1].w}} title={LeadApi.formatDateTime(i.createTime)} className='gezi'>
									{LeadApi.formatDateTime(i.createTime)}
								</div>
								<div  style={{width:headArr[2].w}} title={LeadApi.formatDateTime(i.modifyTime)} className='gezi'>
									{LeadApi.formatDateTime(i.modifyTime)}
								</div>
								<div style={{width:headArr[3].w}} className='gezi'>
									<Link to={{
										pathname:'/editAccountType',
										id:i.id,
										name:i.name,
										description:i.description,
									}} onClick={()=>{this.setAccountTypeId(i.id)}}>
										编辑
									</Link>
								</div>
							</div>
						))}
						<div className='con-foot'>
							<Pagination
								pageSizeOptions={['10','20','50','100']}
								showSizeChanger
								defaultPageSize={this.state.size}
								onChange={this.onPageChange.bind(this)}
								onShowSizeChange={this.onShowSizeChange.bind(this)}
								defaultCurrent={this.state.page} total={total} />
						</div>
					</div>
				</div>
			</div>
		)
	}
}
