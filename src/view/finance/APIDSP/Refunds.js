import React from "react";
import Layout from "../../../layout/Layout";
import { Link } from "react-router-dom";
import { observer } from "mobx-react";
import { Pagination} from "antd";
import RefundStore from "../../../mobx/finance/apidsp/refund-stroe";
import ChongzhiModal from "./modal/chongzhiModal"
import RefundModal from "./modal/refundModal"
import ExcellentExport from 'excellentexport';
const headArr = [
	{ name: 'DSP名称', w: '18%' },
	{ name: 'DSPid', w: '20%' },
	{ name: '登陆账号', w: '20%' },
	{ name: '账户余额', w: '20%' },
	{ name: '操作', w: '20%' },
]
@observer
export default class Refunds extends React.Component {
	constructor() {
		super()
		this.state = {
			visible: false,
			visibles: false,
			value: '',
			size:10,
			page:1,
			chooseIdArr:[],
			searchText:''
		}
	}
	componentWillMount(){
		RefundStore.searchItem(this.state.searchText,this.state.page,this.state.size)
	}
	onPageChange(i){
		this.setState({
			page:i
		})
		RefundStore.searchItem(this.state.searchText,i,this.state.size)
	}
	onShowSizeChange(current, pageSize) {
		this.setState({
			page:1,
			pageSize:pageSize
		})
		RefundStore.searchItem(this.state.searchText,1,pageSize)
	}
	searchUser(){
		RefundStore.searchItem(this.state.searchText,this.state.page,this.state.size)
	}
	jiaoyan(path){
		let aaa=false;
		if(location.pathname==path){
			aaa=true
		}
		return aaa;
	}
	recharge(name,id){
		this._chongzhiModal.openModal(name,id,this.state.searchText,this.state.page,this.state.size)
	}
	refund(balance,name,id){
		this._refundModal.openModal(balance,name,id,this.state.searchText,this.state.page,this.state.size)
	}
	aaa(e){
		return ExcellentExport.excel(e.target,'datatablea', 'Sheet Name Here');
	}
	render() {
		let {leadDsps,leadDsptotal}=RefundStore
		return (
			<div>
				<Layout history={this.props.history} />
				<ChongzhiModal ref={(e)=>this._chongzhiModal=e}/>
				<RefundModal ref={(e)=>this._refundModal=e}/>
				<div className="content">
					<div className="navheader">
						<div className={this.jiaoyan('/Refunds')?"nav-span border-bottm-blue":"nav-span"} >
							<Link to={{ pathname: '/Refunds' }}> APID SP充值/退款管理</Link>
						</div>
						<div className={this.jiaoyan('/FinancialRecords')?"nav-span border-bottm-blue":"nav-span"} >
							<Link to={{ pathname: '/FinancialRecords' }}> APID SP财务记录</Link>
						</div>
					</div>
					<div className="contentBulk1" style={{ marginTop: '10px' }}>
						<div className="con-head">
							<a className="borderBtn" download="somedata.xls" href="#"
							   onClick={(e)=>this.aaa(e)}>下载列表</a>
							<div className="searchInput">
								<input type="text"
									   placeholder="请输入查询的名称和关键字"
									   onChange={(e)=>this.setState({searchText:e.target.value})}
									   className='searchInputText'/>
								<div className='searchInputButton' onClick={()=>this.searchUser()}></div>
							</div>
						</div>
						<table style={{width:'100%'}} id="datatablea">
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
							{leadDsps.map((i, k) => (
								<tr className="table-body" key={k} style={{ background: k % 2 == 0 ? '#fff' : '#fafafa' }}>
									<td style={{ width: headArr[0].w }} title={i.name} className='gezi'>
										{i.name}
									</td>
									<td style={{ width: headArr[1].w }} title={i.id} className='gezi'>
										{i.id}
									</td>
									<td style={{ width: headArr[2].w }} title={i.number} className='gezi'>
										{i.number}{/*登录账号*/}
									</td>
									<td style={{ width: headArr[3].w }} title={i.balance} className='gezi'>
										{i.balance}
									</td>
									<td style={{ width: headArr[4].w }} className='gezi'>
										<button onClick={()=>this.recharge(i.name,i.id)} className='chongzhiBtn'>充值</button>
										<button onClick={()=>this.refund(i.balance,i.name,i.id)} className='tuikuanBtn'>退款</button>
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
								onShowSizeChange={this.onShowSizeChange.bind(this)} defaultCurrent={1} total={leadDsptotal} />
						</div>
					</div>
				</div>
			</div>
		)
	}
}
