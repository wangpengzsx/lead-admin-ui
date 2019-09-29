import React from "react";
import "../../../styles/common.css";
import Layout from "../../../layout/Layout";
import {Link} from "react-router-dom";
import {observer} from "mobx-react";

const headArr = [{ name: '广告主名称', w: '20%' },
	{ name: '所属代理商', w: '20%' },
	{ name: '日期', w: '20%' },
	{ name: '小时', w: '20%' },
	{ name: '消耗金额', w: '20%' },


]
import { Select ,DatePicker,Pagination} from 'antd';

const Option = Select.Option;

function onChange(date, dateString) {
	console.log(date, dateString);
}

const groups = [
	{
		name: "悠易互通",
		adtime: '2018年9月17日',
		adtype: "xxxxxxx",
		beforemoney: "10000.00",
		money: "1000.00",
		aftermoney: "9000.00",
		remarks: "xxxxxxx",
		id: 1
	}, {
		name: "悠易互通",
		adtime: '2018年9月17日',
		adtype: "xxxxxxx",
		beforemoney: "10000.00",
		money: "1000.00",
		aftermoney: "9000.00",
		remarks: "xxxxxxx",
		id: 2
	}
]




@observer
export default class AdvertisersConsumeWater extends React.Component {
	constructor(){
		super()
		this.state={
			size:10
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
					<div className="contentBulk">
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
							<div className="listROwlet2">
								<div className="form-left" style={{ width: '35%' }}>
									按操作日期:
								</div>
								<DatePicker onChange={onChange} style={{ width: '35%' }} placeholder="" />
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
							<button  className="border1" style={{width:100}}>
								下载报表
							</button>
							<div className="searchInput">
								{/*<Input onChange={e=>this.setState({searchText:e.target.value})}
									   addonAfter={<Icon type="search" style={{ color: 'rgba(0,0,0,.25)' }}
														 onClick={()=>this.clickSearch()}/>}/>*/}
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
										{i.name}
									</td>
									<td style={{ width: headArr[2].w }} className='gezi'>
										{i.adtime}{/*登录账号*/}
									</td>
									<td style={{ width: headArr[3].w }} className='gezi'>
										{i.adtype}
									</td>
									<td style={{ width: headArr[4].w }} className='gezi'>
										{i.beforemoney}
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
