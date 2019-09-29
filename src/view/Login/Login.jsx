import React from "react";
import "../../styles/login.css";
import {observer} from "mobx-react";
import Client from "../../common/lead-api";
import {Checkbox} from "antd";
@observer
export default class Login extends React.Component {
	constructor(props){
		super(props)
		this.state={
			name:localStorage.getItem('adxusername')?localStorage.getItem('adxusername'):'',
			password:localStorage.getItem('adxpassword')?localStorage.getItem('adxpassword'):'',
			captcha:'',
			aaa:location.protocol+'//'+location.host+'/lead-admin-api/auth/img/captcha.png',
			captchaState:false,
			message:'',
			checkState:localStorage.getItem('remember')=='true'?true:false
		}
	}
	login() {
		this.setState({
			message:''
		})
		let that=this;
		Client.login('auth/login', {
			username: this.state.name,
			password: this.state.password,
			captcha: this.state.captcha
		},function(res){
			localStorage.setItem("aaa", true);
			that.props.history.push({pathname: '/'});
		},function(err){
			if(err.responseJSON.data!=null)that.setState({captchaState:err.responseJSON.data.captcha})
			if(err.responseJSON.message=="验证码错误")that.setState({captchaState:true})
			Client.showTank(false,err.responseJSON.message)
		})
	}
	onCheckChange(e){
		if(e.target.checked){
			localStorage.setItem('adxusername',this.state.name);
			localStorage.setItem('adxpassword',this.state.password);
			localStorage.setItem('remember',e.target.checked);
		}else{
			localStorage.removeItem('adxusername');
			localStorage.removeItem('adxpassword');
			localStorage.setItem('remember',false);
		}
		this.setState({
			checkState:e.target.checked
		})
	}
	refresh(){
		this.setState({
			aaa:this.state.aaa+'?'+Math.random()
		})
	}
	render() {
		let that=this;
		document.onkeydown = function (e) {
			if (!e) e = window.event;
			if ((e.keyCode || e.which) == 13) {
				that.login();
			}
		}
		return (
			<div className="loginBack">
				<div className="content">
					<div className="loginLogo">
					</div>
					<div className="loginCenBox">
						<div className="login-top-box">
							<img src={require("../../image/fontLogo.png")} alt=""/>
						</div>
						<div className="login-user-box">
							<span className="left-font">用户名</span>
							<input type="text"
								   className="loginInput"
								   placeholder="用户名"
								   onChange={e=>this.setState({name:e.target.value})}
								   value={this.state.name}
							/>
						</div>
						<div className="login-user-box" >
							<span className="left-font">密</span>
							<span className="left-font">码</span>
							<input type="password"
								   ref="password"
								   className="loginInput"
								   placeholder="密码"
								   onChange={e=>this.setState({password:e.target.value})}
								   value={this.state.password}/>
						</div>
							{this.state.captchaState?(
								<div className="accountListRow" >
									<div className="login-btn-box">
										<input type="text" style={{width:143,height:32}}
											   placeholder="验证码"
											   ref="captcha"
											   className="loginInput"
											   onChange={e=>this.setState({captcha:e.target.value})}
											   value={this.state.captcha}/>
										<img src={this.state.aaa} alt=""/>
										<span onClick={()=>this.refresh()} className="refbtn">换一张</span>
									</div>
								</div>
							):(
								<div style={{width:'100%',height:10}}>
								</div>
							)}
						<div className="login-btn-box" style={{marginTop:20}}>
							<Checkbox style={{color:'#fff',fontSize:18}}
									  checked={this.state.checkState}
									  onChange={(e)=>{this.onCheckChange(e)}}>记住密码</Checkbox>
							<button type="primary" className="login-btn" onClick={()=>this.login()}>登录</button>
						</div>
						<div className="forget">忘记密码？
							<div className="qipao">
								如遗忘密码请邮件lufu1@lenovo.com进行密码找回
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
}
