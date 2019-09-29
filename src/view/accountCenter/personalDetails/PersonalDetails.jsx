import React from "react";
import Layout from "../../../layout/Layout";
import Client from "../../../common/lead-api";
import UserStore from "../../../mobx/user-store";
import HintAlert from "../../common/HintAlert";
import {Input} from "antd";
export default class PersonalDetails extends React.Component {
	constructor(){
		super()
		this.state={
			email:'',
			oldPassword:'',
			newPassword1:'',
			newPassword2:'',
			typeArr:[],
			isshow:true,
			emailError:false,
			newPwError1:false,
			newPwError2:false,
			isConfirm:false,
		}
	}
	componentWillMount(){
		UserStore.getUserInfo(this.callback.bind(this));
	}
	callback(id,email){
		let that=this;
		Client.getRelation("leadUsers",id,"groups").then(res=>{
			let obj=res._embedded.leadUserGroups;
			that.setState({
				typeArr:obj,
				email:email
			})
		})
	}
	isEmail(email){Client.isEmail(email)?this.setState({emailError:false}):this.setState({emailError:true})}
	isPassword1(newPassword1){Client.isPassword(newPassword1)?this.setState({newPwError1:false}):this.setState({newPwError1:true});}
	isPassword2(newPassword2){Client.isPassword(newPassword2)?this.setState({newPwError2:false}):this.setState({newPwError2:true});}
	confirm(){
		let {email,oldPassword,newPassword1,newPassword2}=this.state;
		this.isEmail(email);
		this.isPassword1(newPassword1);
		this.isPassword2(newPassword2);
		this.setState({isConfirm: true});
		if(Client.isPassword(newPassword1)&&Client.isPassword(newPassword2)&&Client.isEmail(email)&&oldPassword!=''){
			if(newPassword1!=newPassword2){
				Client.showTank(false,'输入的2个新密码不一致');
			}else{
				Client.createObject('auth/changeUser',
					{email:email,oldPassword:oldPassword,newPassword1:newPassword1,newPassword2:newPassword2}).then(res=>{
					Client.showTank(true,'修改成功！');
				}).catch(res=>{
					console.log(res.responseJSON.message);
					Client.showTank(false,'修改失败！（'+res.responseJSON.message+'）');
				})
			}
		}else{
			Client.showTank(false,'请按要求填写');
		}
	}
	emailChange(e){
		if(this.state.isConfirm)this.isEmail(e.target.value);
		this.setState({email:e.target.value})
	}
	pwChange1(e){
		if(this.state.isConfirm)this.isPassword1(e.target.value);
		this.setState({newPassword1:e.target.value})
	}
	pwChange2(e){
		if(this.state.isConfirm)this.isPassword2(e.target.value);
		this.setState({newPassword2:e.target.value})
	}
	render() {
		let {userInfo}=UserStore
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
						<div className="accountListRow">
							<div className="form-left">
								<i className="red">*</i>&nbsp;账户名称:
							</div>
							<div className="form-right">
								{userInfo.userName}
							</div>
						</div>
						<div className="accountListRow">
							<div className="form-left">
								<i className="red">*</i>&nbsp;邮箱:
							</div>
							<div className="form-right">
								<input type="text" className={this.state.emailError?'borderError':'border1'}
									   style={{width:360,height:30}}
										onChange={e=>this.emailChange(e)}
										value={this.state.email}/>
								{this.state.emailError?(
									<HintAlert left={360} width={170} message="请输入正确的邮箱格式"/>
								):null}
							</div>
						</div>
						<div className="accountListRow">
							<div className="form-left">
								账户类型:
							</div>
							<div className="form-right">
								{this.state.typeArr.map(i=>i.name)}
							</div>
						</div>
						<div className="accountListRow">
							<div className="form-left">
								创建日期:
							</div>
							<div className="form-right">
								{Client.formatDateTime(userInfo.createTime)}
							</div>
						</div>
						<div className="accountListRow">
							<div className="form-left">
								原密码:
							</div>
							<div className="form-right">
								<Input onChange={e=>this.setState({oldPassword:e.target.value})}
									   value={this.state.oldPassword}
									   style={{width:360,height:30}}
									   type={this.state.isshow?'text':'password'}
									   className="border1"/>
							</div>
						</div>
						<div className="accountListRow">
							<div className="form-left">
								新密码:
							</div>
							<div className="form-right">
								<input onChange={e=>this.pwChange1(e)}
									   value={this.state.newPassword1} type="password"
									   style={{width:360,height:30}}
									   placeholder="请输入6-16位长度字母数字组合字符"
									   className={this.state.newPwError1?'borderError':'border1'}
								/>
								{this.state.newPwError1?(
									<HintAlert left={360} width={170} message="密码格式不正确"/>
								):null}
							</div>
						</div>
						<div className="accountListRow">
							<div className="form-left">
								确认密码:
							</div>
							<div className="form-right">
								<input onChange={e=>this.pwChange2(e)}
									   value={this.state.newPassword2} type="password"
									   style={{width:360,height:30}}
									   placeholder="请输入6-16位长度字母数字组合字符"
									   className={this.state.newPwError2?'borderError':'border1'}
								/>
								{this.state.newPwError2?(
									<HintAlert left={360} width={170} message="密码格式不正确"/>
								):null}
							</div>
						</div>
					</div>
					<div className="submit-content">
						<button className="cancelBtn">取消</button>
						<button className="confirmBtn" onClick={()=>this.confirm()}>确定</button>
					</div>
				</div>
			</div>
		)
	}
}
