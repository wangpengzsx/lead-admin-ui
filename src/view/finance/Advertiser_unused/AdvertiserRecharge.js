import React from "react";
import "../../../styles/common.css";
import Layout from "../../../layout/Layout";
import {Link} from "react-router-dom";
import {observer} from "mobx-react";
import {Input,Icon,Pagination} from "antd";

const headArr = [
	{ name: '广告主id', w: '14.28%' },
	{ name: '广告主名称', w: '14.28%' },
	{ name: '广告主公司注册名', w: '14.28%' },
	{ name: '所属代理商', w: '14.28%' },
	{ name: '登录账户', w: '14.28%' },
	{ name: '账户余额', w: '14.28%' },
	{ name: '操作', w: '14.28%' },
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
export default class AdvertiserRecharge extends React.Component {
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
						<div className={this.jiaoyan('/AdvertiserRecharge')?"nav-span border-bottm-blue":"nav-span"} >
							<Link to={{ pathname: '/AdvertiserRecharge' }}> 联想DSP广告主充值/退款</Link>
						</div>
						<div className={this.jiaoyan('/AdvertisersFinancialRecords')?"nav-span border-bottm-blue":"nav-span"} >
							<Link to={{ pathname: '/AdvertisersFinancialRecords' }}> 联想DSP广告主财务记录</Link>
						</div>
						<div className={this.jiaoyan('/AdvertisersConsumeWater')?"nav-span border-bottm-blue":"nav-span"} >
							<Link to={{ pathname: '/AdvertisersConsumeWater' }}> 联想DSP广告主消耗流水</Link>
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
									</td>
									<td style={{ width: headArr[5].w }} className='gezi'>
									</td>
									<td style={{ width: headArr[6].w }} className='gezi'>
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
