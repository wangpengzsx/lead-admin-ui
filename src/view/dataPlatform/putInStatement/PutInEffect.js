import React from "react";
import Layout from "../../../layout/Layout";
import RangePickerCom from "../component/RangePickerCom";
import moment from 'moment';
import SeaSelect from './moudle/SeaSelect';
import { Pagination, Select} from "antd";
import Client from "../../../common/lead-api";
import MediaIncomeAnalyzeStore from "../../../mobx/dataPlatform/media-income-analyze-store";
import { observer } from "mobx-react";
const Option = Select.Option;
const typeArr=[{ name: 'banner广告', value: 'BANNER' },
	{ name: '开屏广告', value: 'OPENSCREEN' },
	{ name: '插屏广告', value: 'POPUP' },
	{ name: '原生广告', value: 'NATIVE' },
	{ name: '视频广告', value: 'VIDEO' },]
const dealArr=[
	{ name: 'RTB', value: 'RTB' },
	{ name: 'PD', value: 'PD' },
	{ name: 'PDB', value: 'PDB' }
];
const DuibiArr=[
	{name:'收入',value:'income'},
	{name:'收入占比',value:'income_rate'},
	{name:'媒体请求数',value:'requests'},
	{name:'请求占比',value:'request_rate'},
	{name:'ADX响应数',value:'responses'},
	{name:'响应率',value:'response_rate'},
	{name:'展现数',value:'displays'},
	{name:'展现率',value:'display_rate'},
	{name:'广告填充率',value:'filling_rate'},
	{name:'CPM',value:'cpm'},
	{name:'点击数',value:'clicks'},
	{name:'点击率',value:'ctr'},
	{name:'CPC',value:'cpc'},
	{name:'下载完成数',value:'downloads'},
	{name:'下载单价',value:'cpd'},
	{name:'安装完成数',value:'installs'},
	{name:'安装单价',value:'cpi'},
]
const headArr = [{ name: '日期', w: '3.84%' },
	{ name: '应用名称', w: '3.84%' },
	{ name: '终端', w: '3.84%' },
	{ name: '广告类型', w: '3.84%' },
	{ name: '广告位名称', w: '3.84%' },
	{ name: '广告位尺寸', w: '3.84%' },
	{ name: '收入', w: '3.84%' },
	{ name: '收入占比', w: '3.84%' },
	{ name: '媒体请求数', w: '3.84%' },
	{ name: '请求占比', w: '3.84%' },
	{ name: 'ADX响应数', w: '3.84%' },
	{ name: '响应率', w: '3.84%' },
	{ name: '展现数', w: '3.84%' },
	{ name: '展现率', w: '3.84%' },
	{ name: '广告填充率', w: '3.84%' },
	{ name: 'CPM', w: '3.84%' },
	{ name: '点击数', w: '3.84%' },
	{ name: '点击率', w: '3.84%' },
	{ name: 'CPC', w: '3.84%' },
	{ name: '下载完成数', w: '3.84%' },
	{ name: '下载单价', w: '3.84%' },
	{ name: '安装完成数', w: '3.84%' },
	{ name: '安装单价', w: '3.84%' },
];
@observer
export default class PutInEffect extends React.Component {
	constructor(){
		super()
		this.state={
			startValue: moment().startOf('day'),
			endValue: moment().endOf('day'),
			typeArr:[],
			dealArr:[],
			compareValue1: 'ADX响应数',
			compareValue2: '展现数',
			page:1,
			size:5,
			geziWidth: '5.55%'
		}
	}
	rangeChange(startValue,endValue){
		this.setState({startValue,endValue})
	}
	onChange(){

	}
	onCompareChange1(e) {
		this.setState({
			compareValue1: e
		})
		setTimeout(() => {
			this.query()
		}, 300)
	}
	onCompareChange2(e) {
		this.setState({
			compareValue2: e
		})
		setTimeout(() => {
			this.query()
		}, 300)
	}
	query(){

	}
	onPageChange(page){

	}
	onShowSizeChange(page,size){

	}
	render() {
		let { DownloadList, total, storeAppArr, storeOsArr, storeSizeArr, storeSpaceArr, storeTypeArr } = MediaIncomeAnalyzeStore;
		return (
			<div>
				<Layout history={this.props.history}/>
				<div className="content">
					<div className="contentBulk3" style={{ paddingTop: 10 }}>
						<div className="listROwlet2" style={{ minHeight: 60, lineHeight: '30px' }}>
							<div className="form-left" style={{ width: '30%' }}>
								日期：
							</div>
							<div className="form-right-multiple" style={{ width: '60%' }}>
								<RangePickerCom call={(startValue,endValue)=>this.rangeChange(startValue,endValue)}/>
							</div>
						</div>
						<SeaSelect label="广告类型" option={typeArr} call={(arr)=>this.onChange(arr)}/>
						<SeaSelect label="交易方式" option={dealArr} call={(arr)=>this.onChange(arr)}/>
						<SeaSelect label="交易方式" option={dealArr} call={(arr)=>this.onChange(arr)}/>
						<SeaSelect label="交易方式" option={dealArr} call={(arr)=>this.onChange(arr)}/>
					</div>
					<div style={{ paddingBottom: 10 }}>
						<button className="filtrateBtn" onClick={() => { this.query() }}>
							查询
						</button>
					</div>
					<div className="list-haed">
						<span className="dah1">数据趋势</span>
					</div>
					<div className="contentBulk">
						<div style={{ width: '100%', height: 30 }}>
							<div style={{ width: '20%', float: 'left' }}>
							</div>
							<div style={{ width: '30%', float: 'right' }}>
								<Select value={this.state.compareValue1} style={{ width: 120 }} onChange={(e) => this.onCompareChange1(e)} size="small">
									{
										DuibiArr.map((i, k) => (
											<Option value={i.name} key={k} disabled={i.name == this.state.compareValue2}>{i.name}</Option>
										))
									}
								</Select>
								&nbsp;&nbsp;对比&nbsp;&nbsp;
								<Select value={this.state.compareValue2} style={{ width: 120 }} onChange={(e) => this.onCompareChange2(e)} size="small">
									{
										DuibiArr.map((i, k) => (
											<Option value={i.name} key={k} disabled={i.name == this.state.compareValue1}>{i.name}</Option>
										))
									}
								</Select>
							</div>
						</div>
						<div style={{ width: '100%', height: 300 }} id='dataEchart'></div>
					</div>
					<div className="contentBulk1">
						<div className="con-head" style={{ padding: 10 }}>
							<a className="borderBtn" download="somedata.xls" href="#"
							   onClick={(e) => this.downloadExcel(e)}>
								下载报表
							</a>
						</div>
						<div style={{ width: '100%', overflowX: 'scroll' }}>
							<table style={{ width: '170%' }} id="mediadatatable">
								<thead>
								<tr className="table-head1" >
									{
										headArr.map((i, k) => {
											if (i.name == '应用名称' && storeAppArr.length == 0) {
												return null
											} else if (i.name == '终端' && storeOsArr.length == 0) {
												return null
											} else if (i.name == '广告类型' && storeTypeArr.length == 0) {
												return null
											} else if (i.name == '广告位名称' && storeSpaceArr.length == 0) {
												return null
											} else if (i.name == '广告位尺寸' && storeSizeArr.length == 0) {
												return null
											} else {
												return (
													<th key={k} style={{ width: this.state.geziWidth }} className="gezi" title={i.name}>
														{i.name}
													</th>
												)
											}
										})
									}
								</tr>
								</thead>
								<tbody>
								{
									DownloadList.map((i, k) => (
										<tr className="table-body" key={k}>
											<td className="gezi" title={i.event_date} style={{ width: this.state.geziWidth }}>{/*日期*/}
												{i.event_date}
											</td>
											{storeAppArr.length != 0 ? (
												<td className="gezi" title={i.app_name} style={{ width: this.state.geziWidth }}>{/*应用名称*/}
													{i.event_date=='合计'?'--':Client.formatListData(i.app_group_id==null?i.app_name:i.group_name)}
												</td>
											) : null}
											{storeOsArr.length != 0 ? (
												<td className="gezi" style={{ width: this.state.geziWidth }}>{/*终端*/}
													{i.event_date=='合计'?'--':Client.formatListData(i.os)}
												</td>
											) : null}
											{storeTypeArr.length != 0 ? (
												<td className="gezi" style={{ width: this.state.geziWidth }}>{/*广告类型*/}
													{i.event_date=='合计'?'--':Client.adTypeEffect(Client.formatListData(i.ad_type))}
												</td>
											) : null}
											{storeSpaceArr.length != 0 ? (
												<td className="gezi" title={i.ad_space_name} style={{ width: this.state.geziWidth }}>{/*广告位名称*/}
													{i.event_date=='合计'?'--':Client.formatListData(i.ad_space_name)}
												</td>
											) : null}
											{storeSizeArr.length != 0 ? (
												<td className="gezi" style={{ width: this.state.geziWidth }}>{/*广告位尺寸*/}
													{i.event_date=='合计'||i.width==null||i.height==null?'--':i.width+'×'+i.height}
												</td>
											) : null}


											<td className="gezi" title={i.income} style={{ width: this.state.geziWidth }}>{/*收入*/}
												{Client.formatListData(i.income)}
											</td>
											<td className="gezi" title={i.income_rate == "NaN" ? 0 : i.income_rate} style={{ width: this.state.geziWidth }}>{/*收入占比*/}
												{Client.addRate(i.income_rate)}
											</td>
											<td className="gezi" title={i.requests} style={{ width: this.state.geziWidth }}>{/*媒体请求数*/}
												{Client.formatListData(i.requests)}
											</td>
											<td className="gezi" title={i.request_rate} style={{ width: this.state.geziWidth }}>{/*请求占比*/}
												{Client.addRate(i.request_rate)}
											</td>
											<td className="gezi" title={i.responses} style={{ width: this.state.geziWidth }}>{/*ADX响应数*/}
												{Client.formatListData(i.responses)}
											</td>
											<td className="gezi" style={{ width: this.state.geziWidth }}>{/*响应率*/}
												{Client.addRate(i.response_rate)}
											</td>
											<td className="gezi" title={i.displays} style={{ width: this.state.geziWidth }}>{/*展现数*/}
												{Client.formatListData(i.displays)}
											</td>
											<td className="gezi" style={{ width: this.state.geziWidth }}>{/*展现率*/}
												{Client.addRate(i.display_rate)}
											</td>
											<td className="gezi" style={{ width: this.state.geziWidth }}>{/*广告填充率*/}
												{Client.addRate(i.filling_rate)}
											</td>

											<td className="gezi" title={i.cpm} style={{ width: this.state.geziWidth }}>{/*CPM*/}
												{Client.formatListData(i.cpm)}
											</td>
											<td className="gezi" title={i.clicks} style={{ width: this.state.geziWidth }}>{/*点击数*/}
												{Client.formatListData(i.clicks)}
											</td>
											<td className="gezi" style={{ width: this.state.geziWidth }}>{/*点击率*/}
												{Client.addRate(i.ctr)}
											</td>
											<td className="gezi" title={i.cpc} style={{ width: this.state.geziWidth }}>{/*CPC*/}
												{Client.formatListData(i.cpc)}
											</td>
											<td className="gezi" title={i.downloads} style={{ width: this.state.geziWidth }}>{/*下载完成数*/}
												{Client.formatListData(i.downloads)}
											</td>
											<td className="gezi" style={{ width: this.state.geziWidth }}>{/*下载单价*/}
												{Client.formatListData(i.cpd)}
											</td>
											<td className="gezi" title={i.installs} style={{ width: this.state.geziWidth }}>{/*安装完成数*/}
												{Client.formatListData(i.installs)}
											</td>
											<td className="gezi" style={{ width: this.state.geziWidth }}>{/*安装单价*/}
												{Client.formatListData(i.cpi)}
											</td>
										</tr>
									))
								}
								</tbody>
							</table>

						</div>
						<div className='con-head'>
							<Pagination
								pageSizeOptions={['5', '10', '20', '50', '100']}
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
