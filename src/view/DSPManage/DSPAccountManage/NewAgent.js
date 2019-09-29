import React from "react";
import Layout from "../../../layout/Layout";
import { Input, Radio, Select } from "antd";
const Option = Select.Option;
const RadioGroup = Radio.Group;
import city from "./js/city";
import HintAlert from "../../common/HintAlert";
import Client from "../../../common/lead-api";
const types = ['APIDSP外部代理商', '联想DSP代理商']
export default class NewAgent extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			name: '',
			value: '',
			number: '',
			pwd: '',
			companyName: '',
			email: '',
			phone: '',
			contacts: '',
			provincesArr: [],
			provincesIndex: 0,
			citysArr: [],
			province: '',
			city: '',
			bidUrl: '',
			resultUrl: '',
			phoneError: false,
			clickTargetURL: "",
			clickURL: "",
			urlError: false,
			urlErrors: false,
			emailError: false,
			chineseError: false,
			isConfirm: false,
			nameError: false,
			pwdError: false,
			comError: false,
			contactsError: false,
			addressError: false,
			radioValue: ''
		}
	}
	submit() {
		this.setState({ isConfirm: true })
		this.isChinese(this.state.number)
		this.isEmails(this.state.email)
		this.isPhone(this.state.phone)
		this.isUrl(this.state.bidUrl)
		this.isresUrl(this.state.resultUrl)
		this.isName(this.state.name)
		this.isPwd(this.state.pwd)
		this.isCom(this.state.companyName)
		this.iscontacts(this.state.contacts)
		this.isaddress(this.state.city)
		let { name, radioValue, value, number, pwd, companyName, email, phone, contacts, city, bidUrl, resultUrl,province } = this.state
		if (name && radioValue&&province &&number!='' && pwd && companyName && Client.isEmail(email) && Client.isPhone(phone) && contacts && city && Client.isUrl(bidUrl) && Client.isUrl(resultUrl)) {
			Client.createObject('dsp/saveOrUpdateDsp',
				{
					name: name,
					value: value,
					type: radioValue == "1" ? "1" : "2",
					number: number,
					pwd: pwd,
					companyName: companyName,
					email: email,
					phone: phone,
					contacts: contacts,
					city: city,
					bidUrl: bidUrl,
					resultUrl: resultUrl,
					province:province,

				})
				.then(res => {
					if (res.status == 200) {
						this.callback()
						Client.showTank(true, res.message);
					} else {
						Client.showTank(false, res.message);
					}
				}).catch(res => {
					Client.showTank(false, res.message);
				})
		} else {
			Client.showTank(false, '请按要求填写信息');
		}
	}
	callback() {
		this.props.history.push({ pathname: '/DSPAccountManage' })
	}
	componentWillMount() {
		this.setState({
			provincesArr: city.provinces
		})
	}
	onChange = (e) => {
		this.setState({
			value: e.target.value,
		});
	}
	handleChange(e) {
		let index = this.state.provincesArr.indexOf(e);
		this.setState({
			citysArr: city.citys[index],
			province: e
		})
	}
	handleCityChange(e) {
		this.setState({
			city: e
		})
	}
	onRadioChange(e) {
		if (e.target.value == "APIDSP外部代理商") {
			e.target.value = "1"
		} else {
			e.target.value = "2"
		}
		this.setState({
			radioValue: e.target.value
		})
	}
	random() {
		var text = "";
		var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
		for (var i = 0; i < 6; i++)
			text += possible.charAt(Math.floor(Math.random() * possible.length));
		this.setState({
			pwd: text
		})
		return text;
	}
	isName(name) {
		name == '' ? this.setState({ nameError: true }) : this.setState({ nameError: false })
	}
	nameChange(e) {
		if (this.state.isConfirm) this.isName(e.target.value);
		this.setState({ name: e.target.value })
	}
	isPwd(pwd) {
		pwd == '' ? this.setState({ pwdError: true }) : this.setState({ pwdError: false })
	}
	pwdChange(e) {
		if (this.state.isConfirm) this.isPwd(e.target.value);
		this.setState({ pwd: e.target.value })
	}
	isCom(com) {
		com == '' ? this.setState({ comError: true }) : this.setState({ comError: false })
	}
	comChange(e) {
		if (this.state.isConfirm) this.isCom(e.target.value);
		this.setState({ companyName: e.target.value })
	}
	iscontacts(con) {
		con == '' ? this.setState({ contactsError: true }) : this.setState({ contactsError: false })
	}
	conChange(e) {
		if (this.state.isConfirm) this.iscontacts(e.target.value);
		this.setState({ contacts: e.target.value })
	}
	isaddress(addr) {
		addr == '' ? this.setState({ addressError: true }) : this.setState({ addressError: false })
	}
	addrChange(e) {
		if (this.state.isConfirm) this.isaddress(e.target.value);
		this.setState({ city: e.target.value })
	}
	isChinese(number) {
		number!=="" ? this.setState({ chineseError: false }) : this.setState({ chineseError: true })
	}
	numberChange(e) {
		if (this.state.isConfirm) this.isChinese(e.target.value);
		this.setState({ number: e.target.value })
	}
	isEmails(email) {
		Client.isEmail(email) ? this.setState({ emailError: false }) : this.setState({ emailError: true })
	}
	emailChange(e) {
		if (this.state.isConfirm) this.isEmails(e.target.value);
		this.setState({ email: e.target.value })
	}
	isPhone(phone) {
		Client.isPhone(phone) ? this.setState({ phoneError: false }) : this.setState({ phoneError: true })
	}
	phoneChange(e) {
		if (this.state.isConfirm) this.isPhone(e.target.value);
		this.setState({ phone: e.target.value })
	}
	isUrl(url) {
		Client.isUrl(url) ? this.setState({ urlError: false }) : this.setState({ urlError: true })
	}
	urlChange(e) {
		if (this.state.isConfirm) this.isUrl(e.target.value);
		this.setState({ bidUrl: e.target.value })
	}
	isresUrl(resurl) {
		Client.isUrl(resurl) ? this.setState({ urlErrors: false }) : this.setState({ urlErrors: true })
	}
	urlChanges(e) {
		if (this.state.isConfirm) this.isresUrl(e.target.value);
		this.setState({ resultUrl: e.target.value })
	}
	render() {
		return (
			<div>
				<Layout history={this.props.history} />
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
								<i className="red">*</i>&nbsp; 代理商名称:
							</div>
							<div className="form-right">
								<Input type="text" className={this.state.nameError ? 'borderError' : 'border1'}
									style={{ width: 360, height: 30 }}
									value={this.state.name}
									onChange={e => this.nameChange(e)} />
								{this.state.nameError ? (
									<HintAlert left={360} width={170} message="代理商名称不能为空" />
								) : null}
								<i className="color1">该名称为代理商登录账户名</i>
							</div>
						</div>
						<div className="accountListRow">
							<div className="form-left">
								<i className="red">*</i>&nbsp; 代理商类型:
							</div>
							<div className="form-right">
								<RadioGroup options={types} onChange={(e) => this.onRadioChange(e)} />
							</div>
						</div>
						<div className="accountListRow">
							<div className="form-left">
								<i className="red">*</i>&nbsp; 管理员账号:
							</div>
							<div className="form-right">
								<form>
									<input type="text"
										className={this.state.chineseError ? 'borderError' : 'border1'}
										style={{ width: 360, height: 30 }}
										value={this.state.number}
										onChange={e => this.numberChange(e)}
									/>
									{this.state.chineseError ? (
										<HintAlert left={360} width={170} message={"账号不能为空"} />
									) : null}
								</form>
								<i className="color1">该账户名用于登录DSP后台，确认后不可修改</i>
							</div>
						</div>
						<div className="accountListRow">
							<div className="form-left">
								<i className="red">*</i>&nbsp; 初始登陆密码:
							</div>
							<div className="form-right">
								<Input type="text" className="border1"
									id="pwd"
									style={{ width: 360, height: 30 }}
									value={this.state.pwd}
									onChange={e => this.pwdChange(e)}
								/>
								<button
									id="initpwd"
									style={{ background: "orange", color: "#fff", border: "none", outline: "none", padding: "5px" }}
									onClick={() => { this.random() }}
								>点击生成</button>
							</div>
						</div>
						<div className="accountListRow">
							<div className="form-left">
								<i className="red">*</i>&nbsp; 公司名称:
							</div>
							<div className="form-right">
								<Input type="text" className={this.state.comError ? 'borderError' : 'border1'}
									style={{ width: 360, height: 30 }}
									value={this.state.companyName}
									onChange={e => this.comChange(e)} />
								{this.state.comError ? (
									<HintAlert left={360} width={170} message="公司名称不能为空" />
								) : null}
								<i className="color1">公司名称需与公司营业执照名称一致</i>
							</div>
						</div>
						<div className="accountListRow">
							<div className="form-left">
								<i className="red">*</i>&nbsp; E-mail:
							</div>
							<div className="form-right">
								<form>
									<input type="text"
										className={this.state.emailError ? 'borderError' : 'border1'}
										style={{ width: 360, height: 30 }}
										value={this.state.email}
										onChange={e => this.emailChange(e)}
									/>
									{this.state.emailError ? (
										<HintAlert left={360} width={170} message={this.state.email == '' ? "邮箱不能为空" : "请正确填写邮箱"} />
									) : null}
								</form>
							</div>
						</div>
						<div className="accountListRow">
							<div className="form-left">
								<i className="red">*</i>&nbsp; 手机:
							</div>
							<div className="form-right">
								<form>
									<input type="text"
										id="phone"
										className={this.state.phoneError ? 'borderError' : 'border1'}
										style={{ width: 360, height: 30 }}
										value={this.state.phone}
										onChange={e => this.phoneChange(e)}
									/>
									{this.state.phoneError ? (
										<HintAlert left={360} width={170} message={this.state.phone == '' ? "手机号不能为空" : "请正确填写手机号"} />
									) : null}
								</form>
							</div>
						</div>
						<div className="accountListRow">
							<div className="form-left">
								<i className="red">*</i>&nbsp; 联系人:
							</div>
							<div className="form-right">
								<Input type="text" className={this.state.contactsError ? 'borderError' : 'border1'}
									style={{ width: 360, height: 30 }}
									value={this.state.contacts}
									onChange={e => this.conChange(e)} />
								{this.state.contactsError ? (
									<HintAlert left={360} width={170} message="联系人不能为空" />
								) : null}
							</div>
						</div>
						<div className="accountListRow">
							<div className="form-left">
								<i className="red">*</i>&nbsp; 地域:
							</div>
							<div className="form-right">
								<Select defaultValue="请选择省份" style={{ width: 120 }} onChange={this.handleChange.bind(this)}>
									{this.state.provincesArr.map((i, k) => (
										<Option value={i} key={k}>{i}</Option>
									))}
								</Select>
								&nbsp;省&nbsp;
								<Select defaultValue="请选择城市" style={{ width: 120 }} onChange={this.handleCityChange.bind(this)}>
									{this.state.citysArr.map((i, k) => (
										<Option value={i} key={k}>{i}</Option>
									))}
								</Select>
								&nbsp;市
							</div>
						</div>
						<div className="accountListRow">
							<div className="form-left">
								<i className="red">*</i>&nbsp; 公司地址:
							</div>
							<div className="form-right">
								<Input type="text" className="border1"
									style={{ width: 360, height: 30 }}
									value={this.state.city}
									onChange={e => this.addrChange(e)} />
							</div>
						</div>
						<div className="accountListRow">
							<div className="form-left">
								<i className="red">*</i>&nbsp; 竞价地址:
							</div>
							<div className="form-right">
								<input type="text" className={this.state.urlError ? 'borderError' : 'border1'}
									style={{ width: 360, height: 30 }}
									value={this.state.bidUrl}
									onChange={e => this.urlChange(e)}
								/>
								{this.state.urlError ? (
									<HintAlert left={360} width={170}
										message={this.state.bidUrl == '' ? "竞价地址不能为空" : "  请输入正确格式  如：http://www.aaa.com"} />
								) : null}
							</div>
						</div>
						<div className="accountListRow">
							<div className="form-left">
								<i className="red">*</i>&nbsp; 结果告知地址:
							</div>
							<div className="form-right">
								<input type="text" className={this.state.urlErrors ? 'borderError' : 'border1'}
									style={{ width: 360, height: 30 }}
									value={this.state.resultUrl}
									onChange={e => this.urlChanges(e)}
								/>
								{this.state.urlErrors ? (
									<HintAlert left={360} width={170}
										message={this.state.resultUrl == '' ? "结果告知地址不能为空" : "请输入正确格式 如：http://www.aaa.com"} />
								) : null}
							</div>
						</div>
					</div>
					<div className="submit-content">
						<button className="cancelBtn" onClick={() => this.props.history.push({ pathname: '/DSPAccountManage' })}>取消</button>
						<button className="confirmBtn" onClick={() => this.submit()}>确定</button>
					</div>
				</div>
			</div>
		)
	}
}
