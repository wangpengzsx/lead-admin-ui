import React from "react";
import {Checkbox,Icon,Input} from 'antd';
import {observer} from "mobx-react";
import AccountTypeStore from '../../../mobx/accountCenter/account-type-store';
import NewAccountTypeStore from '../../../mobx/accountCenter/new-account-type-store';
import Client from "../../../common/lead-api";
import HintAlert from "../../common/HintAlert";
import Layout from "../../../layout/Layout";
const chooseArr=[
	{name:'账户管理',checked:false,selected:false,sub:[{name:'账户管理',checked:false},{name:'账户类型管理',checked:false}]},
	{name:'账户管理',checked:false,selected:false,sub:[{name:'账户管理',checked:false},{name:'账户类型管理',checked:false}]}
];
const { TextArea } = Input;
@observer
export default class NewAccountType extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			chooseArr: chooseArr,
			accountName:'',
			remark:'',
			page:1,
			pageSize:10,
			nameError:false,
			isConfirm:false
		};
	}
	componentWillMount(){
		AccountTypeStore.fetchAuthorities();
	}
	AddChecked(k){
		let arr=AccountTypeStore.chooseArr;
		arr[k].checked=!arr[k].checked
		for(let i=0; i<arr[k].sub.length; i++){
			arr[k].sub[i].checked=arr[k].checked
		}
		AccountTypeStore.chooseArr=arr;
	}
	removeChecked(k){
		let arr=AccountTypeStore.chooseArr;
		arr[k].checked=false
		for(let i=0; i<arr[k].sub.length; i++){
			arr[k].sub[i].checked=false
		}
		AccountTypeStore.chooseArr=arr;
	}
	AddCheckedSub(k,b){
		let arr=AccountTypeStore.chooseArr;
		arr[k].sub[b].checked=!arr[k].sub[b].checked;
		for(let i=0; i<arr[k].sub.length; i++){
			if(arr[k].sub[i].checked==true){
				arr[k].checked=true;
				break;
			}
		}
		AccountTypeStore.chooseArr=arr;
	}
	removeCheckedSub(k,b){
		let arr=AccountTypeStore.chooseArr;
		arr[k].sub[b].checked=false;
		AccountTypeStore.chooseArr=arr;
	}
	toggle(k){
		let arr=AccountTypeStore.chooseArr;
		arr[k].selected=!arr[k].selected;
		AccountTypeStore.chooseArr=arr;
	}
	confirm(){
		this.setState({isConfirm:true});
		this.isName(this.state.accountName);
		if(this.state.accountName!=''){
			NewAccountTypeStore.createType(this.state.accountName,this.state.remark,this.callback.bind(this))
		}else{
			document.getElementById('app').scrollIntoView(true);
			Client.showTank(false,'请按要求填写');
		}
	}
	callback(id){
		let {chooseArr}=AccountTypeStore;
		let arr=[];
		for(let i=0; i<chooseArr.length;i++){
			if(chooseArr[i].checked){
				arr.push(chooseArr[i].id)
			}
			if(chooseArr[i].sub){
				for(let j=0;j<chooseArr[i].sub.length; j++){
					if(chooseArr[i].sub[j].checked)
						arr.push(chooseArr[i].sub[j].id);
				}
			}
		}
		NewAccountTypeStore.chooseType(id,arr);
		this.props.history.push('/accountTypeManage');
	}
	allChoose(){
		this.toggleCheckFun(true);
	}
	allRemove(){
		this.toggleCheckFun(false);
	}
	toggleCheckFun(bo){
		let arr=AccountTypeStore.chooseArr;
		for(let i=0; i<arr.length; i++){
			arr[i].checked=bo;
			for(let j=0; j<arr[i].sub.length;j++){
				arr[i].sub[j].checked=bo;
			}
		}
		AccountTypeStore.chooseArr=arr;
	}
	isName(name){
		name==''?this.setState({nameError:true}): this.setState({nameError:false})
	}
	nameChang(e){
		if(this.state.isConfirm)this.isName(e.target.value);
		this.setState({accountName:e.target.value})
	}
	render() {
		let {chooseArr}=AccountTypeStore;
		return (
			<div ref='win'>
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
									<i className="red">*</i>&nbsp;账户类型名称:
								</div>
								<div className="form-right">
									<input style={{width:360,height:30}}
										   type="text"
										   className={this.state.nameError?'borderError':'border1'}
										   onChange={e=>this.nameChang(e)}
										   value={this.state.accountName}
									/>
									{this.state.nameError?(
										<HintAlert left={360} width={170} message="账户名称不能为空"/>
									):null}
								</div>
							</div>
							<div style={{width:'100%',height:94}}>
								<div className="form-left">
									备注:
								</div>
								<div className="form-right">
									<TextArea rows={4}
											  style={{width:360,height:94}}
											  onChange={e=>this.setState({remark:e.target.value})}
											  value={this.state.remark}
											  className="moreRow"
									>
									</TextArea>
								</div>
							</div>
						</div>
					</div>
					<div className="list-haed">
						<span className="dah1">
							权限分配
						</span>
						<span className="xiaoh1">
							请为账户类型至少分配一个权限
						</span>
					</div>
					<div className="contentBulk">
						<div style={{height:450}}>
							<div style={{width:'5%',height:450,float:'left'}}>
							</div>
							<div style={{width:'40%',height:450,float:'left'}}>
								<div className="allChoose">
									<button className="typeBtn"
										onClick={()=>this.allChoose()}>全选</button>
								</div>
								<div className="chooseDrection">
									<span>
										权限名称
									</span>
									<span>
										选择
									</span>
								</div>
								<div className="chooseContent">
									{chooseArr.map((i,k)=>(
										<div key={k} style={{marginBottom:10}}>
											<div className="chooseItem" style={{backgroundColor:i.checked?'#f4f4f4':'#fff'}}>
												<div onClick={()=>this.toggle(k)}>
													{i.sub.length!=0?(i.selected?
														(<Icon type="down" theme="outlined" style={{marginRight:10}}/>):
														(<Icon type="right" theme="outlined" style={{marginRight:10}}/>)):null}
													{i.name}
												</div>
												<Checkbox onChange={this.AddChecked.bind(this,k)} checked={i.checked}/>
											</div>
											{i.selected?i.sub.map((a,b)=>(
												<div className="chooseItem1" key={b} style={{backgroundColor:a.checked?'#f4f4f4':'#fff'}}>
													<div>
														{a.name}
													</div>
													<Checkbox onChange={this.AddCheckedSub.bind(this,k,b)} checked={a.checked}/>
												</div>
											)):null}
										</div>
									))}
								</div>
							</div>
							<div style={{width:'10%',height:450,float:'left',display:'flex',alignItems:'center',justifyContent:'center'}}>
								<img src={require('../../../image/zhuanhuan.png')} alt=""/>
							</div>
							<div style={{width:'40%',height:450,float:'left'}}>
								<div className="allChoose">
									<button className="typeBtn" onClick={()=>this.allRemove()}>清空</button>
								</div>
								<div className="chooseDrection">
									<span>
										权限名称
									</span>
									<span>
										清除
									</span>
								</div>
								<div className="chooseContent">
									{chooseArr.map((i,k)=>(
										<div key={k} style={{marginBottom:10}}>
											{i.checked?(
												<div className="chooseItem" style={{backgroundColor:'#f4f4f4'}}>
													<div onClick={()=>this.toggle(k)}>
														{i.sub.length!=0?(i.selected?
															(<Icon type="down" theme="outlined" style={{marginRight:10}}/>):
															(<Icon type="right" theme="outlined" style={{marginRight:10}}/>)):null}
														{i.name}
													</div>
													<div>
														<Icon type="close-circle" onClick={()=>this.removeChecked(k)}/>
													</div>
												</div>
											):null}
											{i.selected?i.sub.map((a,b)=>(
												a.checked?
													<div className="chooseItem1" key={b} style={{backgroundColor:'#f4f4f4'}}>
														<div>
															{a.name}
														</div>
														<div>
															<Icon type="close-circle" onClick={()=>this.removeCheckedSub(k,b)}/>
														</div>
													</div>:null
											)):null}
										</div>
									))}
								</div>
							</div>
						</div>
					</div>
					<div className="submit-content">
						<button className="cancelBtn" onClick={()=>this.props.history.push('/accountTypeManage')}>取消</button>
						<button className="confirmBtn" onClick={()=>{this.confirm()}}>确定</button>
					</div>
				</div>
			</div>
		)
	}
}
