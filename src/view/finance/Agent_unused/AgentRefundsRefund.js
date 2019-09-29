import React from "react";
import "../../../styles/common.css";
import Layout from "../../../layout/Layout";
import {Input,Icon,Pagination} from "antd";
import {Link} from "react-router-dom";
import {observer} from "mobx-react";
const headArr = [
	{ name: 'DSP名称', w: '18%' },
	{ name: 'DSPid', w: '20%' },
	{ name: '登陆账号', w: '20%' },
	{ name: '账户余额', w: '20%' },
	{ name: '操作', w: '20%' },
]
const groups = [
	{
		name: "悠易互通",
		adId: '00031',
		adname: "xxxxxxx",
		money: "10000.00",
		id:1
	}, {
		name: "悠易互通",
		adId: "00032",
		adname: "xxxxxxx",
		money: "10000.00",
		id:2
	}
]



@observer
export default class AgentRefundsRefund extends React.Component {
	constructor(){
		super()
		this.state={
			size:10,
			page:1
		}
	}
	jiaoyan(path){
		let aaa=false;
		if(location.pathname==path){
			aaa=true
		}
		return aaa;
	}
	onPageChange(){}
	onShowSizeChange(){}
	render() { 
		return (
			<div> 
				<Layout history={this.props.history}/>
				<div className="content">
                <div className="navheader">
					<div className={this.jiaoyan('/AgentRefundsRefund')?"nav-span border-bottm-blue":"nav-span"} >
						<Link to={{ pathname: '/AgentRefundsRefund' }}> 联想DSP代理商充值/退款</Link>
					</div>
					<div className={this.jiaoyan('/FinancialRecordsOfAgents')?"nav-span border-bottm-blue":"nav-span"} >
						<Link to={{ pathname: '/FinancialRecordsOfAgents' }}> 联想DSP代理商财务记录</Link>
					</div>
					<div className={this.jiaoyan('/AgentsConsumeWater')?"nav-span border-bottm-blue":"nav-span"} >
						<Link to={{ pathname: '/AgentsConsumeWater' }}> 联想DSP代理商消耗流水</Link>
					</div>
				</div>
					<div className="contentBulk1" style={{ marginTop: '10px' }}>
						<div className="con-head">
							<button  className="border1" style={{width:100}}>
								下载报表
							</button>
							<div className="searchInput">
								<Input onChange={e=>this.setState({searchText:e.target.value})}
									   addonAfter={<Icon type="search" style={{ color: 'rgba(0,0,0,.25)' }}
														 onClick={()=>this.searchUser()}/>}/>
							</div>
						</div>
						<table style={{width:'100%'}}>
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
							{groups.map((i, k) => (
								<tr className="table-body" key={k} style={{ background: k % 2 == 0 ? '#fff' : '#fafafa' }}>

									<td style={{ width: headArr[0].w }} className='gezi'>
										{i.name}
									</td>
									<td style={{ width: headArr[1].w }} className='gezi'>

									</td>
									<td style={{ width: headArr[2].w }} className='gezi'>

									</td>
									<td style={{ width: headArr[3].w }} className='gezi'>
									</td>
									<td style={{ width: headArr[4].w }} className='gezi'>
										<button onClick={()=>this.recharge(i.id)} className='chongzhiBtn'>充值</button>
										<button onClick={()=>this.refund(i.id)} className='tuikuanBtn'>退款</button>
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
								onChange={this.onPageChange.bind(this)}
								onShowSizeChange={this.onShowSizeChange.bind(this)} defaultCurrent={1} total={5} />
						</div>
					</div>
					
				</div>
			</div>
		)
	}
}
