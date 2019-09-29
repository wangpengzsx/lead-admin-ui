import React from "react";
import Layout from "../../../layout/Layout";
import { Link } from "react-router-dom";
import { observer } from "mobx-react";
import {Select, DatePicker,Pagination} from "antd";
const Option = Select.Option;
import RefundStroe from "../../../mobx/finance/apidsp/refund-stroe";
import Client from "../../../common/lead-api"
import ExcellentExport from 'excellentexport';
const headArr = [{ name: 'DSP名称', w: '14%' },
{ name: '操作日期', w: '14%' },
{ name: '操作类型', w: '14%' },
{ name: '操作前账户余额', w: '14%' },
{ name: '操作金额', w: '14%' },
{ name: '操作后账户余额', w: '14%' },
{ name: '备注', w: '14%' },
]
@observer
export default class FinancialRecords extends React.Component {
	constructor() {
		super()
		this.state = {
			visible: false,
			visibles: false,
			value: '',
			searchText:'',
			size:10,
			page: 1,
			chooseIdArr: [],
			adFinaceType:'',
			dspId:'',
			createTime:''
		}
	}
	componentWillMount(){
		RefundStroe.getAllDspName();
		this.repetition();
	}
	componentDidMount(){
		Client.getleadArr('leadDsps/search/spec',{query:'name==**'}).then(res=>{
			let str='<Option  value="" disabled selected style="display:none;">请DSP名称</Option>';
			str+='<Option  value="" >全部</Option>';
			res._embedded.leadDsps.map(d => str+= '<Option  value='+d.id+'>'+d.name+'</Option>')
			$(this.el).html(str);
			$(this.el).chosen().change((e)=>{this.adDspChange(e.target.value)})
		})
	}
	repetition(){
		setTimeout(()=>{
			RefundStroe.searchAccount(this.state.dspId,this.state.adFinaceType,this.state.createTime,this.state.page,this.state.size);
		},300)
	}
	onPageChange(i) {
		this.setState({
			page:i
		})
		this.repetition()
	}
	onShowSizeChange(current,pageSize) {
		this.setState({
			size:pageSize,
			page:1
		})
		this.repetition();
	}
	jiaoyan(path){
		let aaa=false;
		if(location.pathname==path){
			aaa=true
		}
		return aaa;
	}
	onTypeChange(e){
		this.setState({
			adFinaceType: e
		})
	}
	adDspChange(e){
		this.setState({dspId:e});
	}
	filtrate(){
		this.repetition()
	}
	aaa(e){
		return ExcellentExport.excel(e.target,'datatableb', 'Sheet Name Here');
	}
	onDateChange(date,dateString){
		this.setState({
			createTime:dateString
		})
	}
	render() {
		let {leadFinances,total,DspNameArr}=RefundStroe
		return (
			<div>
				<Layout history={this.props.history} />
				<div className="content">
					<div className="navheader">
						<div className={this.jiaoyan('/Refunds')?"nav-span border-bottm-blue":"nav-span"} >
							<Link to={{ pathname: '/Refunds' }}> APID SP充值/退款管理</Link>
						</div>
						<div className={this.jiaoyan('/FinancialRecords')?"nav-span border-bottm-blue":"nav-span"} >
							<Link to={{ pathname: '/FinancialRecords' }}> APID SP财务记录</Link>
						</div>
					</div>
					<div className="contentBulk2" style={{ paddingTop: 20 }}>
						<div className="accountListRow" >
							<div className="listROwlet2" >
								<div className="form-left" style={{ width: '35%' }}>
									按操作类型:
								</div>
								<div className="form-right" style={{ width: '50%' }}>
									<Select defaultValue="" style={{ width: 120 }} onChange={(e)=>this.onTypeChange(e)}>
										<Option value="" >全部</Option>
										<Option value="RECHARGE" >充值</Option>
										<Option value="REFUND" >退款</Option>
									</Select>
								</div>
							</div>
							<div className="listROwlet2" >
								<div className="form-left" style={{ width: '35%' }}>
									DSP名称:
								</div>
								<div className="form-right" style={{ width: '50%' }}>
									<select className="Chosen-select"
											placeholder="jjjj"
											ref={el => this.el = el}>
										{DspNameArr.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
									</select>
								</div>
							</div>
							<div className="listROwlet2">
								<div className="form-left" style={{ width: '35%' }}>
									按操作日期:
								</div>
								<DatePicker onChange={this.onDateChange.bind(this)} style={{ width: '35%' }} placeholder="" />
							</div>
						</div>
					</div>
					<div style={{paddingBottom:10}}>
						<button className="filtrateBtn" onClick={()=>this.filtrate()}>
							查询
						</button>
					</div>
					<div className="contentBulk1">
						<div className="con-head">
							<a className="borderBtn" download="somedata.xls" href="#"
							   onClick={(e)=>this.aaa(e)}>下载列表</a>
							<div className="searchInput">
							</div>
						</div>
						<table style={{width:'100%'}} id="datatableb">
							<thead>
							<tr className="table-head1">
								{
									headArr.map((i, k) => (
										<th key={k} style={{ width: i.w }} className="gezi">
											{i.name}
										</th>
									))
								}
							</tr>
							</thead>
							<tbody>
							{leadFinances.map((i, k) => (
								<tr className="table-body" key={k} style={{ background: k % 2 == 0 ? '#fff' : '#fafafa' }}>
									<td style={{ width: headArr[0].w }} title={i.dspName} className='gezi'>
										{i.dspName}
									</td>
									<td style={{ width: headArr[1].w }} title={Client.formatDateTime(i.createTime)} className='gezi'>
										{Client.formatDateTime(i.createTime)}
									</td>
									<td style={{ width: headArr[2].w }} className='gezi'>
										{i.adFinaceType=='RECHARGE'?'充值':'退款'}
									</td>
									<td style={{ width: headArr[3].w }} title={i.beforeBalance} className='gezi'>
										{i.beforeBalance}
									</td>
									<td style={{ width: headArr[4].w }} title={i.operationAmount} className='gezi'>
										{i.operationAmount}
									</td>
									<td style={{ width: headArr[5].w }} title={i.afterBalance} className='gezi'>
										{i.afterBalance}
									</td>
									<td style={{ width: headArr[5].w }} title={i.description} className='gezi'>
										{i.description}
									</td>
								</tr>
							))}
							</tbody>
						</table>
						<div className='con-foot'>
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
