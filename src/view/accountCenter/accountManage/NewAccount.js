import React ,{Component}from "react";
import {Checkbox} from 'antd';
import NewAccountStore from "../../../mobx/accountCenter/new-account-store"
import {observer} from "mobx-react";
import {Link} from "react-router-dom";
import Layout from "../../../layout/Layout";
import Client from "../../../common/lead-api";
import HintAlert from "../../common/HintAlert";
const headArr=[{name:'账户类型',w:'30%'},
	{name:'创建时间',w:'30%'},
	{name:'最后更新时间',w:'30%'}];
@observer
export default class NewAccount extends Component {
	constructor(props){
		super(props)
		this.state={
			accountName:'',
			email:'',
			chooseIdArr:[],
			nameError:false,
			emailError:false,
			emailFormatError:false,
			isConfirm:false,
		}
	}
	componentWillMount(){
		NewAccountStore.getleadUserGroups()
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
		this.setState({isConfirm: true});
		this.isName(this.state.accountName);
		this.isEmail(this.state.email);
		if(Client.isPassword1(this.state.accountName)&&this.state.email!=''&&Client.isEmail(this.state.email)){
			NewAccountStore.createUser(this.state.accountName,this.state.email,this.callback.bind(this));
		}else{
			Client.showTank(false,'请按要求填写');
		}
	}
	callback(id){
		NewAccountStore.choosetype(id,this.state.chooseIdArr);
		this.props.history.push({pathname:'/accountManage'});
	}
	isName(name){
		Client.isPassword1(name)?this.setState({nameError:false}):this.setState({nameError:true})
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
			Client.isEmail(email)?this.setState({emailFormatError:false}):this.setState({emailFormatError:true})
		}
	}
	emailChange(e){
		if(this.state.isConfirm)this.isEmail(e.target.value);
		this.setState({email:e.target.value})
	}
	render() {
		let {leadUserGroups}=NewAccountStore;
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
						<div >
							<div style={{width:'100%',height:30,marginBottom:10}}>
								<div className="form-left">
									<i className="red">*</i>&nbsp;账户名称:
								</div>
								<div className="form-right">
									<input style={{width:360,height:30}}
										   type="text"
										   className={this.state.nameError?'borderError':'border1'}
										   onChange={e=>this.nameChange(e)}/>
									{this.state.nameError?(
										<HintAlert left={360} width={270} message="请输入6-16位长度字母或数字字符"/>
									):null}
								</div>
							</div>
							<div style={{width:'100%',height:30}}>
								<div className="form-left">
									<i className="red">*</i>&nbsp;邮箱:
								</div>
								<div className="form-right">
									<input style={{width:360,height:30}}
										   type="text"
										   className={this.state.emailError||this.state.emailFormatError?"borderError":"border1"}
										   onChange={e=>this.emailChange(e)}/>
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
								<Checkbox onChange={this.onChange}/>
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
									<Checkbox onChange={this.onChange.bind(this,i.id)}/>
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
					</div>
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
		)
	}
}
