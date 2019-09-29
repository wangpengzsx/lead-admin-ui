import React from "react";
import Layout from "../../../layout/Layout";
import { DatePicker,Select,Checkbox,Pagination} from 'antd';
import Client from "../../../common/lead-api";
import omfManageStore from "../../../mobx/finance/omfManage/omf-manage-store";
import {observer} from "mobx-react"
import AuditModal from "./modal/auditModal";
import FinanceAuditModal from "./modal/financeAuditModal";
import OperationAuditModal from "./modal/operationAuditModal";
import moment from 'moment';
const Option=Select.Option;
const { RangePicker } = DatePicker;
const typeArr=[
	{
		name:'待审核',
		value:'0',
	},
	{
		name:'财务审核通过',
		value:'1',
	},
	{
		name:'财务审核拒绝',
		value:'2',
	},
	{
		name:'运营审核通过',
		value:'3',
	},
	{
		name:'运营审核拒绝',
		value:'4',
	}
]
const headArr=[
	{name:'日期',w:'10%'},
	{name:'开发者名称',w:'14%'},
	{name:'开发者主体',w:'14%'},
	{name:'总收入',w:'14%'},
	{name:'开发者总收入',w:'14%'},
	{name:'审核状态',w:'14%'},
	{name:'操作',w:'15%'},
]
@observer
export default class OMFMange extends React.Component {
	constructor(){
		super()
		this.state={
			mode: ['month', 'month'],
			value: [],
			id1:'',
			id2:'',
			startTime:'',
			endTime:'',
			state:'',
			page:1,
			size:10,
			chooseIdArr:[]
		}
	}
	componentWillMount(){
		this.query();
	}
	componentDidMount(){
		Client.getNullArgument('media/getDeveloperList').then(res=>{
			let str='<Option  value="" disabled selected style="display:none;">请选择开发者名称</Option>';
			str+='<Option  value="" >全部</Option>';
			res.map(d => str+= '<Option  value='+d.id+'>'+d.developer_name+'</Option>')
			$(this.el).html(str);
			$(this.el).chosen({placeholder_text_single:'请选择开发者名称'});
			$(this.el).chosen().change((e)=>{this.adDevNameChange(e.target.value)})
			let str1='<Option  value="" disabled selected style="display:none;">请选择开发者主体</Option>';
			str1+='<Option  value="" >全部</Option>';
			let arr=[];
			res.map(d =>arr.push(d.developer_body));
			arr=Client.unique(arr);
			arr.map(d => str1+= '<Option  value='+d+'>'+d+'</Option>')
			$(this.ell).html(str1);
			$(this.ell).chosen({placeholder_text_single:'请选择开发者主体'});
			$(this.ell).chosen().change((e)=>{this.adDevBodyChange(e.target.value)})
		})
	}
	adDevNameChange(val){
		this.setState({
			id1:val
		})
	}
	adDevBodyChange(val){
		this.setState({
			id2:val
		})
	}
	query(){
		let {id1,id2,value,state,page,size}=this.state;
		if(value.length==0){
			omfManageStore.getFinanceList(id1,id2,'','',state,page,size);
		}else{
			omfManageStore.getFinanceList(id1,id2,value[0].format('YYYYMM'),value[1].format('YYYYMM'),state,page,size);
		}
	}
	handlePanelChange = (value, mode) => {
		console.log(value);
		this.setState({
			value,
			mode: [
				mode[0] === 'date' ? 'month' : mode[0],
				mode[1] === 'date' ? 'month' : mode[1],
			],
		});
	}
	handleChange = (value) => {
		this.setState({ value });
	}
	onStateChange(e){
		this.setState({
			state:e
		})
	}

	onPageChange(i){
		this.setState({
			page:i
		})
		let {id1,id2,value,state,size}=this.state;
		if(value.length==0){
			omfManageStore.getFinanceList(id1,id2,'','',state,i,size);
		}else{
			omfManageStore.getFinanceList(id1,id2,value[0].format('YYYYMM'),value[1].format('YYYYMM'),state,i,size);
		}
	}
	onShowSizeChange(current, pageSize) {
		this.setState({
			page:1,
			size:pageSize
		})
		let {id1,id2,value,state}=this.state;
		if(value.length==0){
			omfManageStore.getFinanceList(id1,id2,'','',state,1,pageSize);
		}else{
			omfManageStore.getFinanceList(id1,id2,value[0].format('YYYYMM'),value[1].format('YYYYMM'),state,1,pageSize);
		}
	}
	financeAudit(id,date,state){
		this._auditModal.openModal(id,date,state,'财务');
	}
	operationAudit(id,date,state){
		this._auditModal.openModal(id,date,state,'运营');
	}
	auditState(state){
		switch (state) {
			case 0:
				return '待审核';
				break;
			case 1:
				return '财务审核通过';
				break;
			case 2:
				return '财务审核拒绝';
				break;
			case 3:
				return '运营审核通过';
				break;
			case 4:
				return '运营审核拒绝';
				break;
		}
	}
	onAllChange(e){
		let {FinanceList}=omfManageStore;
		let arr=[];
		FinanceList.map(i=>arr.push(i.id+'@'+i.event_date));
		let arr1=this.state.chooseIdArr;
		if(e.target.checked){
			arr1=arr
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
	onOneChange(i){
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
	isCheckd(CreativesArr){
		let arr=[]
		for(let i=0; i<CreativesArr.length; i++){
			arr.push(CreativesArr[i].id+'@'+CreativesArr[i].event_date)
		}
		return Client.isContained(this.state.chooseIdArr,arr);
	}

	financeBatchAudit() {

		let arr=this.state.chooseIdArr;
		let {FinanceList}=omfManageStore;
		let aaa=true;
		for(let i=0;i<FinanceList.length;i++){
			for(let j=0;j<arr.length;j++){
				if(FinanceList[i].id+'@'+FinanceList[i].event_date==arr[j]){
					if(FinanceList[i].state>2){
						aaa=false;
						break;
					}
				}
			}
		}
		if(aaa){
			this._financeAuditModal.openModal(this.state.chooseIdArr)
		}else{
			Client.showTank(false,'运营审核后财务不可以再审核')
		}

	}
	operationBatchAudit(){
		let arr=this.state.chooseIdArr;
		let {FinanceList}=omfManageStore;
		let aaa=true;
		for(let i=0;i<FinanceList.length;i++){
			for(let j=0;j<arr.length;j++){
				if(FinanceList[i].id+'@'+FinanceList[i].event_date==arr[j]){
					if(FinanceList[i].state==0||FinanceList[i].state==2){
						aaa=false;
						break;
					}
				}
			}
		}
		if(aaa){
			this._operationAuditModal.openModal(this.state.chooseIdArr)
		}else{
			Client.showTank(false,'财务审核通过后运营才可以审核')
		}
	}
	reDay(i){
		var date = new Date(i);
		var year = date.getFullYear();
		var month = date.getMonth()+1;
		var d = new Date(year, month, 0);
		return d.getDate();
	}
	sectionMonth(start,end){
		let arr=[];
		for(let i=new Date(start).getTime();i<=new Date(end).getTime();i=i+this.reDay(i)*24*60*60*1000){
			arr.push(moment(i).format('YYYYMM'))
		}
		return arr;
	}
	closeAccount(){
		if(this.state.value.length>0){
			let {value}=this.state;
			let str=Client.arrStr(this.sectionMonth(value[0].format('YYYY-MM'),value[1].format('YYYY-MM')))
			Client.getNullArgument('media/setMediaIncome?startDate='+str).then(res=>{
				if(res.status==200){
					this.query()
				}else{
					Client.showTank(false,res.message)
				}
			})
		}else{
			Client.showTank(false,'请先选择日期')
		}
	}


	render() {
		let {value,mode}=this.state;
		let {FinanceList,total}=omfManageStore;
		return (
			<div>
				<Layout history={this.props.history} />
				<div className="content">
					<OperationAuditModal ref={(e) => this._operationAuditModal = e} call={()=>this.query()}/>
					<FinanceAuditModal ref={(e) => this._financeAuditModal = e} call={()=>this.query()}/>
					<AuditModal ref={(e) => this._auditModal = e} call={()=>this.query()}/>
					<div className="contentBulk1" style={{padding:10,overflow: 'visible'}}>
						<div style={{height:50,padding:10}}>
							<div className="listROwlet2" style={{ lineHeight: '30px' }}>
								<div className="form-left" style={{ width: '30%' }}>
									日期：
								</div>
								<div className="form-right-multiple" style={{ width: '50%' }}>
									<RangePicker
										placeholder={['开始月份', '结束月份']}
										format="YYYY-MM"
										value={value}
										mode={mode}
										onChange={this.handleChange}
										onPanelChange={this.handlePanelChange}
									/>

								</div>

							</div>
							<div className="listROwlet2" style={{ lineHeight: '30px' }}>
								<div className="form-left" style={{ width: '30%' }}>
									开发者名称：
								</div>
								<div className="form-right-multiple" style={{ width: '50%' }}>
									<select className="Chosen-select"
											placeholder="jjjj"
											ref={el => this.el = el}>
									</select>
								</div>
							</div>
							<div className="listROwlet2" style={{ lineHeight: '30px' }}>
								<div className="form-left" style={{ width: '30%' }}>
									开发者主体：
								</div>
								<div className="form-right-multiple" style={{ width: '50%' }}>
									<select className="Chosen-select"
											placeholder="jjjj"
											ref={el => this.ell = el}>
									</select>
								</div>
							</div>
						</div>
						<div style={{height:50,padding:10}}>
							<div className="listROwlet2" style={{ lineHeight: '30px' }}>
								<div className="form-left" style={{ width: '30%' }}>
									审核状态：
								</div>
								<div className="form-right-multiple" style={{ width: '50%' }}>
									<Select defaultValue="请选择审核状态" style={{ width: 150 ,marginRight:10}}
											onChange={(e)=>this.onStateChange(e)}>
										<Option value="">全部</Option>
										{typeArr.map((i,k)=>(
											<Option value={i.value} key={k}>{i.name}</Option>
										))}
									</Select>
								</div>
							</div>
						</div>

					</div>
					<div style={{ paddingBottom: 10 }}>
						<button className="filtrateBtn" onClick={() => { this.query() }}>
							查询
						</button>
						<button className="filtrateBtn" style={{marginLeft:10}} onClick={() => { this.closeAccount() }}>
							结算
						</button>
					</div>
					<div className="contentBulk1">
						<div className="con-head">
							<div>
								<button className="borderBtn" onClick={()=>this.financeBatchAudit()}>财务批量审核</button>
								<button className="borderBtn" onClick={()=>this.operationBatchAudit()}>运营批量审核</button>
								<button className="borderBtn" onClick={()=>this.props.history.push({pathname:'/revenueEnquiry'})}>数据明细</button>
							</div>
							<div className="searchInput">

							</div>
						</div>
						<div className="table-head">
							<div style={{width:'5%',float:'left',textAlign:'center'}}>
								<Checkbox onChange={(e)=>this.onAllChange(e)}
										  checked={this.isCheckd(FinanceList)}
								/>
							</div>

							{
								headArr.map((i,k)=>(
									<div key={k} style={{width:i.w,float:'left',textAlign:'center'}}>
										{i.name}
									</div>
								))
							}
						</div>
						{FinanceList.map((i,k)=>(
							<div className="table-body" key={k} style={{background:k%2==0?'#fff':'#fafafa'}}>
								<div  style={{width:'5%'}} className='gezi'>
									<Checkbox onChange={()=>this.onOneChange(i.id+'@'+i.event_date)}
											  checked={this.state.chooseIdArr.indexOf(i.id+'@'+i.event_date)>-1}/>
								</div>
								<div  style={{width:headArr[0].w}} className='gezi'>
									{i.event_date}
								</div>
								<div style={{width:headArr[1].w}} className='gezi'>
									{i.developer_name}
								</div>
								<div  style={{width:headArr[2].w}} className='gezi'>
									{i.developer_body}
								</div>
								<div  style={{width:headArr[3].w}} className='gezi'>
									{i.income}
								</div>
								<div  style={{width:headArr[4].w}} className='gezi'>
									{i.developer_income}
								</div>
								<div  style={{width:headArr[5].w ,color:i.state==2||i.state==4?'red':'#828282'}} className='gezi'>
									{this.auditState(i.state)}
								</div>
								<div  style={{width:headArr[6].w}} className='gezi'>
									<a href="javascript:(0)"
									   style={{marginRight:20,color:i.state==3||i.state==4?'#868686':'#48bfeb'}}
									   onClick={()=>i.state==3||i.state==4?null:this.financeAudit(i.id,i.event_date,i.state)}>财务审核</a>
									<a href="javascript:(0)"
									   style={{marginRight:20,color:i.state==0||i.state==2?'#868686':'#48bfeb'}}
									   onClick={()=>i.state==0||i.state==2?null:this.operationAudit(i.id,i.event_date,i.state)}>运营审核</a>
								</div>


							</div>
						))}
						<div className='con-head'>
							<Pagination
								pageSizeOptions={['10','20','50','100']}
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
