import React from "react";
import Layout from "../../../layout/Layout";
import {Select,Input,Radio} from "antd";
import AppManageStore from "../../../mobx/mediaManage/appManage/app-manage-store";
import HintAlert from "../../common/HintAlert";
import Client from "../../../common/lead-api";
import {observer} from "mobx-react";
const RadioGroup = Radio.Group;
const {TextArea}=Input;
const Option = Select.Option;
const plainOptions = ['App', 'PC'];
@observer
export default class EditApp extends React.Component {
	constructor(props){
		super(props)
		this.state={
			appName:'',
			packageName:'',
			appKeyWord:'',
			description:'',
			radioValue:'App',
			isConfirm:false
		}
	}
	componentWillMount(){
		Client.getNullArgument('leadApps/'+localStorage.getItem('editApp')).then(res=>{
			this.setState({
				appName:res.appName,
				packageName:res.packageName,
				appKeyWord:res.appKeyWord,
				description:res.description,
			})
		})
		AppManageStore.getAppCategories1();
		Client.getleadArr('leadApps/search/spec',{resource:0,query:'id=='+localStorage.getItem('editApp')}).then(res=>{
			AppManageStore.childId=res.content[0].appCategory.id;
			AppManageStore.parentId=res.content[0].appCategory.parent.id;
			AppManageStore.getChildAppCategories1(res.content[0].appCategory.parent.id);
		})
	}
	submit(){
		this.setState({isConfirm:true});
		this.isBao(this.state.packageName);
		this.isName(this.state.appName);
		let {childId}=AppManageStore;
		if(Client.isAppBao(this.state.packageName)&&this.state.appName!=''){
			AppManageStore.modifyApp(localStorage.getItem('editApp'),{appKeyWord:this.state.appKeyWord,
				appName:this.state.appName,
				appType:0,
				description:this.state.description,
				os:this.state.radioValue=='App'?'Android':'PC',
				packageName:this.state.packageName,
				state:0},childId,this.callback.bind(this))
		}else{
			Client.showTank(false,'请按要求填写信息');
		}
	}
	callback(){
		this.props.history.push({pathname:'/appManage'})
	}
	handleChange(value){
		AppManageStore.getChildAppCategories(value);
		AppManageStore.parentId=value;
	}
	handleSubChange(value){
		AppManageStore.childId=value;
	}
	isName(name){
		name==''? this.setState({nameError:true}): this.setState({nameError:false})
	}
	nameChange(e){
		if(this.state.isConfirm)this.isName(e.target.value);
		this.setState({appName:e.target.value})
	}
	isBao(bao){
		Client.isAppBao(bao)? this.setState({baoError:false}):this.setState({baoError:true})
	}
	baoChange(e){
		if(this.state.isConfirm)this.isBao(e.target.value);
		this.setState({packageName:e.target.value})
	}
	onRadioChange(e){
		this.setState({
			radioValue:e.target.value
		})
	}
	render() {
		let{parentArr,parentId,childArr,childId}=AppManageStore;
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
								<i className="red">*</i>&nbsp; 应用名称:
							</div>
							<div className="form-right">
								<input style={{width:360,height:30}}
									   type="text" className={this.state.nameError?'borderError':'border1'}
									   value={this.state.appName}
									   onChange={e=>this.nameChange(e)}/>
								{this.state.nameError?(
									<HintAlert left={360} width={170} message="应用名称不能为空"/>
								):null}
								<i className="color1">应用名称应与应用市场中的名称保持一致</i>
							</div>
						</div>
						<div className="accountListRow">
							<div className="form-left">
								<i className="red">*</i>&nbsp; 应用包名:
							</div>
							<div className="form-right">
								<input type="text" className={this.state.baoError?'borderError':'border1'}
									   style={{width:360,height:30}}
									   value={this.state.packageName}
									   onChange={e=>this.baoChange(e)}/>
								{this.state.baoError?(
									<HintAlert left={360} width={170} message={this.state.packageName==''?'应用包名不能为空':"应用包名格式不正确"}/>
								):null}
								<i className="color1">包名禁止输入中文字符及其他特殊字符</i>
							</div>
						</div>
						<div className="accountListRow">
							<div className="form-left">
								<i className="red">*</i>&nbsp; 应用类型:
							</div>
							<div className="form-right">
								<Select value={parentId} style={{ width: 170 ,marginRight:20}} onChange={this.handleChange.bind(this)}>
									{parentArr.map((i,k)=>(
										<Option value={i.id} key={k}>{i.name}</Option>
									))}
								</Select>
								<Select  value={childId} style={{ width: 170 }} onChange={this.handleSubChange.bind(this)}>
									{childArr.map((i,k)=>(
										<Option value={i.id} key={k}>{i.name}</Option>
									))}
								</Select>
								<i className="color1">应用类型影响广告匹配度，务必正确填写</i>
							</div>
						</div>
						<div className="accountListRow">
							<div className="form-left">
								<i className="red">*</i>&nbsp; 终端:
							</div>
							<div className="form-right">
								<RadioGroup options={plainOptions} onChange={(e)=>this.onRadioChange(e)} value={this.state.radioValue} />
							</div>
						</div>
						{this.state.radioValue=='App'?(
							<div className="accountListRow">
								<div className="form-left">
									操作系统:
								</div>
								<div className="form-right">
									Android
								</div>
							</div>
						):null}
						<div className="accountListRow">
							<div className="form-left">
								应用关键词:
							</div>
							<div className="form-right">
								<Input type="text"  className="border1"
									   value={this.state.appKeyWord}
									   style={{width:360,height:30}}
									   onChange={e=>this.setState({appKeyWord:e.target.value})}/>
								<i className="color1">应用关键词能提升广告匹配度，多个关键词以，分隔</i>
							</div>
						</div>
						<div className="accountListRow" style={{height:94}}>
							<div className="form-left">
								应用简介:
							</div>
							<div className="form-right">
								<TextArea  rows={4}
										  onChange={e=>this.setState({description:e.target.value})}
										  value={this.state.description}
										  className='moreRow'
										  style={{width:360,height:94}}
								>
								</TextArea>
							</div>
						</div>
					</div>
					<div className="submit-content">
						<button className="cancelBtn" onClick={()=>this.props.history.push({pathname:'/appManage'})}>取消</button>
						<button className="confirmBtn" onClick={()=>this.submit()}>确定</button>
					</div>
				</div>
			</div>
		)
	}
}
