import React ,{Component}from "react";
import {Checkbox} from 'antd';
import EditAccountStore from "../../../mobx/accountCenter/edit-account-store"
import {observer} from "mobx-react";
import {Link} from "react-router-dom";
import Layout from "../../../layout/Layout";
import Client from "../../../common/lead-api";
import HintAlert from "../../common/HintAlert";
const headArr=[{name:'账户类型',w:'30%'},
	{name:'创建时间',w:'30%'},
	{name:'最后更新时间',w:'30%'}];
@observer
export default class EditAccount extends Component {
	constructor(props){
		super(props)
		this.state={
			accountName:'',
			email:'',
			chooseIdArr:[],
			userId:'',
			nameError:false,
			emailError:false,
			emailFormatError:false,
			isConfirm:false
		}
	}
	componentWillMount(){
		Client.getNullArgument('leadUsers/'+localStorage.getItem('editAccount')).then(res=>{
			this.setState({
				userId:res.id,
				accountName:res.userName,
				email:res.email
			})
		})
		EditAccountStore.getAccountType(localStorage.getItem('editAccount'),this.callback.bind(this));
		EditAccountStore.getleadUserGroups()
	}
	callback(group){
		let arr=[];
		group.map(i=>arr.push(i.id));
		this.setState({
			chooseIdArr:arr
		})
	}
	onAllChange(e){
		let {leadUserGroups}=EditAccountStore;
		let arr=[];
		if(e.target.checked){
			for(let i=0; i<leadUserGroups.length; i++){
				arr.push(leadUserGroups[i].id);
			}
		}else{
			arr=[];
		}
		this.setState({
			chooseIdArr:arr
		})
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
	confirm(){
		this.setState({isConfirm:true})
		this.isName(this.state.accountName);
		this.isEmail(this.state.email);
		if(this.state.accountName!=''&&this.state.email!=''&&Client.isEmail(this.state.email)){
			EditAccountStore.modifyUser(localStorage.getItem('editAccount'),this.state.accountName,this.state.email);
			EditAccountStore.choosetype(localStorage.getItem('editAccount'),this.state.chooseIdArr);
			setTimeout(()=>{
				this.props.history.push({pathname:'/accountManage'});
			},300)

		}else{
			Client.showTank(false,'请按要求填写');
		}
	}
	isName(name){
		name==''?this.setState({nameError:true}): this.setState({nameError:false})
	}
	nameChange(e){
		if(this.state.isConfirm)this.isName(e.target.value);
		this.setState({accountName:e.target.value})
	}
	isEmail(email){
		if(email==''){
			this.setState({emailError:true})
		}else{
			this.setState({emailError:false})
			Client.isEmail(email)? this.setState({emailFormatError:false}):this.setState({emailFormatError:true})
		}
	}
	emailChange(e){
		if(this.state.isConfirm)this.isEmail(e.target.value);
		this.setState({email:e.target.value})
	}
	render() {
		let {leadUserGroups}=EditAccountStore;
		return (
			<div>
				<Layout history={this.props.history}/>
				<div className="content">
					<div className="list-haed">
						<span className="dah1">
							基础信息
						</span>
						<span className="xiaoh1">
							请填写基础信息，带 <i className="red">*</i> 的为必填项
						</span>
					</div>
					<div className="contentBulk">
						<div>
							<div style={{width:'100%',height:30,marginBottom:10}}>
								<div className="form-left">
									<i className="red">*</i>&nbsp;账户名称:
								</div>
								<div className="form-right">
									<input type="text"
										   className={this.state.nameError?'borderError':'border1'}
										   style={{width:360,height:30}}
										   onChange={e=>this.nameChange(e)}
										   value={this.state.accountName}
									/>
									{this.state.nameError?(
										<HintAlert left={360} width={170} message="账户名称不能为空"/>
									):null}
								</div>
							</div>
							<div style={{width:'100%',height:30}}>
								<div className="form-left">
									<i className="red">*</i>&nbsp;邮箱:
								</div>
								<div className="form-right">
									<input type="text"
										   className={this.state.emailError||this.state.emailFormatError?"borderError":"border1"}
										   style={{width:360,height:30}}
										   onChange={e=>this.emailChange(e)}
										   value={this.state.email}/>
									{this.state.emailError?(
										<HintAlert left={360} width={170} message="邮箱不能为空"/>
									):null}
									{this.state.emailFormatError?(
										<HintAlert left={360} width={170} message="邮箱的格式不对"/>
									):null}
								</div>
							</div>
						</div>
					</div>
					<div className="list-haed">
						<span className="dah1">
							账户类型设定
						</span>
						<span className="xiaoh1">
							请填写基础信息，带 <i className="red">*</i> 的为必填项
						</span>
					</div>
					<div className="contentBulk">
						<div className="table-head">
							<div  style={{width:'10%',float:'left',textAlign:'center'}}>
								<Checkbox onChange={this.onAllChange.bind(this)} checked={this.state.chooseIdArr.length==leadUserGroups.length}/>
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
							<div className="table-body" key={k} style={{background:k%2==0?'#fff':'#fafafa'}}>
								<div  style={{width:'10%'}} className='gezi'>
									<Checkbox onChange={this.onChange.bind(this,i.id)} checked={this.state.chooseIdArr.indexOf(i.id)>-1}/>
								</div>
								<div  style={{width:'30%'}} className='gezi'>
									{i.name}
								</div>
								<div  style={{width:'30%'}} className='gezi'>
									{Client.formatDateTime(i.createTime)}
								</div>
								<div  style={{width:'30%'}} className='gezi'>
									{Client.formatDateTime(i.modifyTime)}
								</div>
							</div>
						))}
						<div className="submit-content">
							<Link to={{pathname:'/accountManage'}}>
								<button className="cancelBtn">取消</button>
							</Link>
							<button className="confirmBtn" onClick={this.confirm.bind(this)}>
								确定
							</button>
						</div>
					</div>
				</div>
			</div>
		)
	}
}
