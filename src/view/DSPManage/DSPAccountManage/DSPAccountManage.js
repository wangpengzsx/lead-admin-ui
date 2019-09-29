import React from "react";
import Layout from "../../../layout/Layout";
import { Link } from "react-router-dom";
import {Pagination } from "antd";
import Client from "../../../common/lead-api";
import NewAgentStore from '../../../mobx/dspManage/DSPManageStore/new-agent-store'
import { observer } from "mobx-react";
import dspManageStore from "../../../mobx/dspManage/DSPManageStore/dsp-manage-store";
const headArr = [
	{ name: '代理商名称', w: '12.5%' },
	{ name: '代理商类型', w: '12.5%' },
	{ name: 'DSPid', w: '12.5%' },
	{ name: 'DSPToken', w: '12.5%' },
	{ name: '流量定向设置', w: '12.5%' },
	{ name: '公司名称', w: '12.5%' },
	{ name: '账户创建时间', w: '12.5%' },
	{ name: '操作', w: '12.5%' },
]
@observer
export default class DSPAccountManage extends React.Component {
	constructor() {
		super()
		this.state = {
			size:10,
			page: 1,
			name: ''
		}
	}
	componentWillMount() {
		NewAgentStore.getnewAgent(this.state.size, this.state.page, this.state.name)
		this.searchUser()
	}
	onPageChange(i) {
		this.setState({
			page: i
		})
		NewAgentStore.getnewAgent(this.state.size, i, this.state.name);
	}
	onShowSizeChange(current, pageSize) {
		this.setState({
			size: pageSize,
			page: 1,
		})
		NewAgentStore.getnewAgent(pageSize, 1,this.state.name);
	}
	searchUser() {
		NewAgentStore.getnewAgent(this.state.size, this.state.page, this.state.name)
	}
	strSlice(str){
		return str.slice(0,5)+'~'+str.slice(str.length-5)
	}
	aaa(j){
		return this.add(j)+":00~"+this.add(j+1)+":00"
	}
	add(j){
		if(j<10){
			j="0"+j;
		}
		return j;
	}
	skipBid(id){
		this.clearStore();
		this.props.history.push({pathname:"/flowReserveSet"})
		localStorage.setItem('preId','');
		localStorage.setItem('dspId',id)
		localStorage.setItem('pathname','/flowReserveSet')
		Client.getNullArgument('dsp/findAllByLeadDspId?dspId='+id).then(res=>{
			localStorage.setItem('preId',res.id);
			if(res.leadPretargetingTimeList.length>0){
				dspManageStore.state1='yes'
			}else{
				dspManageStore.state1='no'
			}
			let arr=[];
			for(let i=0;i<res.leadPretargetingTimeList.length;i++){
				let DuanArr=res.leadPretargetingTimeList[i].pretargetingTime.split(',');
				let ccc=[];
				let str='';
				let duanArr=[];
				for(let j=0;j<24;j++){
					duanArr.push({name:j,start:j,end:j+1,state:false,tDuan:this.aaa(j)})
				}
				for(let j=0;j<DuanArr.length;j++){
					for(let h=0;h<duanArr.length;h++){
						if(DuanArr[j]==duanArr[h].name){
							duanArr[h].state=true
						}
					}
				}
				for(let j=0;j<duanArr.length;j++){
					if(duanArr[j+1]){
						if(duanArr[j].state==true&&duanArr[j].end==duanArr[j+1].start){
							str+=duanArr[j].tDuan
						}
					}else{
						if(duanArr[j].state==true&&j==23){
							str+=duanArr[j].tDuan
						}
					}
					if(duanArr[j].state==false||j==23){
						if(str!=''){
							str=this.strSlice(str);
							ccc.push(str);
						}
						str='';
					}
				}
				let obj={
					name:res.leadPretargetingTimeList[i].pretargetingWeek,
					DuanArr:res.leadPretargetingTimeList[i].pretargetingTime.split(','),
					duan:ccc
				}
				arr.push(obj);
			}
			dspManageStore.timeDuan=arr
			if(res.choiceCity.length>0||res.excludeCity.length>0){
				dspManageStore.state2='yes'
			}else{
				dspManageStore.state2='no'
			}
			dspManageStore.choiceArr=res.choiceCity;
			dspManageStore.excludeArr=res.excludeCity;
			if(res.terminal==''){
				dspManageStore.value3=[];
			}else{
				dspManageStore.value3=res.terminal.split(',');
			}
			if(res.whiteMedia){
				dspManageStore.state4='yes'
				dspManageStore.modalState4='0'
				dspManageStore.modalValue4=res.whiteMedia
			}
			if(res.blackMedia){
				dspManageStore.state4='yes'
				dspManageStore.modalState4='1'
				dspManageStore.modalValue4=res.blackMedia
			}
			if(res.adTypes==''){
				dspManageStore.state5='no';
				dspManageStore.value5=[];
			}else{
				dspManageStore.state5='yes';
				dspManageStore.value5=res.adTypes.split(',');
			}
			if(res.whiteAppVersion){
				dspManageStore.state6='yes'
				dspManageStore.modalState6='0'
				dspManageStore.modalValue6=res.whiteAppVersion
			}
			if(res.blackAppVersion){
				dspManageStore.state6='yes'
				dspManageStore.modalState6='1'
				dspManageStore.modalValue6=res.blackAppVersion
			}
			if(res.choiceDevice.length>0||res.excludeDevice.length>0){
				dspManageStore.state7='yes'
			}else{
				dspManageStore.state7='no'
			}
			dspManageStore.equChoiceArr=res.choiceDevice;
			dspManageStore.equExcludeArr=res.excludeDevice;
			if(res.whiteImei){
				dspManageStore.state8='yes'
				dspManageStore.modalState8='0'
				dspManageStore.modalValue8=res.whiteImei
			}
			if(res.blackImei){
				dspManageStore.state8='yes'
				dspManageStore.modalState8='1'
				dspManageStore.modalValue8=res.blackImei
			}
		})
	}
	clearStore(){
		dspManageStore.state1 = 'no';//时段单选状态
		dspManageStore.timeDuan = [];//时段选择数组
		dspManageStore.state2 = 'no';//地域单选状态
		dspManageStore.choiceArr = [];//地域选择数组
		dspManageStore.excludeArr = [];//地域排除数组
		dspManageStore.initChoiceArr = [];//地域初始化选择数组
		dspManageStore.initExcludeArr = [];//地域初始化排除数组
		dspManageStore.value3 = [];
		dspManageStore.state4 = 'no';//
		dspManageStore.modalState4 = '';//
		dspManageStore.modalValue4 = '';//
		dspManageStore.state5 = 'no';
		dspManageStore.value5 = [];
		dspManageStore.state6 = 'no';//
		dspManageStore.modalState6 = '';//
		dspManageStore.modalValue6 = '';//
		dspManageStore.state7 = 'no';//设备单选状态
		dspManageStore.equChoiceArr = [];//设备选择数组
		dspManageStore.equExcludeArr = [];//设备排除数组
		dspManageStore.initEquChoiceArr = [];//设备初始化选择数组
		dspManageStore.initEquExcludeArr = [];//设备初始化排除数组
		dspManageStore.state8 = 'no';//
		dspManageStore.modalState8 = '';//
		dspManageStore.modalValue8 = '';//
	}
	skipEdit(id){
		this.props.history.push({pathname: "/EditAgent"});
		localStorage.setItem('leadDspId',id)
	}
	render() {
		let { newAgentArr, total } = NewAgentStore
		return (
			<div>
				<Layout history={this.props.history} />
				<div className="content">
					<div className="contentBulk1">
						<div className="con-head">
							<div>
								<Link to={{ pathname: "/newAgent" }}>
									<button className="borderBtn" onClick={() => this.props.history.push({ pathname: '/newAgent' })}>
										新建DSP
								</button>
								</Link>
							</div>
							<div className="searchInput">
								<input type="text"
									placeholder="请输入查询的名称和关键字"
									onChange={e => this.setState({ name: e.target.value })}
									className='searchInputText' />
								<div className='searchInputButton' onClick={() => this.searchUser()}></div>
							</div>
						</div>
						<div className="table-head">
							{
								headArr.map((i, k) => (
									<div key={k} style={{ width: i.w, float: 'left', textAlign: 'center' }}>
										{i.name}
									</div>
								))
							}
						</div>
						{newAgentArr.map((i, k) => (
							<div className="table-body" key={k} style={{ background: k % 2 == 0 ? '#fff' : '#fafafa' }}>
								<div style={{ width: headArr[0].w }} className='gezi'>
									{i.name}
								</div>
								<div style={{ width: headArr[1].w }} className='gezi'>
									{i.type === "1" ? "APIDSP外部代理商" : "联想DSP代理商"}
								</div>
								<div style={{ width: headArr[2].w }} className='gezi'>
									{i.id}
								</div>
								<div style={{ width: headArr[3].w }} className='gezi'>
									{i.dsp_token}
								</div>
								<div style={{ width: headArr[4].w }} className='gezi'>
									<span className="modification"
	  										onClick={()=>this.skipBid(i.id)}>{i.pretargetingCount==0?'设置':'查看'}</span>
								</div>
								<div style={{ width: headArr[5].w }} className='gezi'>
									{i.company_name}
								</div>
								<div style={{ width: headArr[6].w }} className='gezi'>
									{Client.formatDateTime(i.create_time)}
								</div>
								<div style={{ width: headArr[7].w }} className='gezi'>
									<span className="modification"
										  onClick={()=>this.skipEdit(i.id)}>编辑</span>
								</div>
							</div>
						))}
						<div className='con-head'>
							<Pagination
								pageSizeOptions={['10', '20', '50', '100']}
								showSizeChanger
								defaultPageSize={this.state.size}
								current={this.state.page}
								onChange={this.onPageChange.bind(this)}
								onShowSizeChange={this.onShowSizeChange.bind(this)} defaultCurrent={1} total={total} />
						</div>
					</div>
				</div>
			</div>
		)
	}
}
