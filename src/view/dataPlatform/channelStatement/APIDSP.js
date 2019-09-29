import React from "react";
import Layout from "../../../layout/Layout";
import { Checkbox, Pagination, Select } from "antd";
import 'moment/locale/zh-cn';
const Option = Select.Option;
import moment from 'moment';
import echarts from "echarts";
import { observer } from "mobx-react";
import GeneralizeManageStore from "../../../mobx/generalizeSupport/generalize-manage-store";
import ApiDspStore from "../../../mobx/dataPlatform/api-dsp-store";
import Client from "../../../common/lead-api";
import ExcellentExport from 'excellentexport';
import RangePickerCom from '../component/RangePickerCom';
const headArr = [{ name: '日期', w: '3.84%' },
	{ name: '媒体名称', w: '3.84%' },
	{ name: 'dsp名称', w: '3.84%' },
	{ name: '广告类型', w: '3.84%' },
	{ name: 'ADX请求数', w: '3.84%' },
	{ name: 'DSP响应数', w: '3.84%' },
	{ name: '响应率', w: '3.84%' },
	{ name: 'DSP参与竞价数', w: '3.84%' },
	{ name: 'DSP参与竞价率', w: '3.84%' },
	{ name: '竞价胜出数', w: '3.84%' },
	{ name: '竞价胜出率', w: '3.84%' },
	{ name: '花费', w: '3.84%' },
	{ name: '花费占比', w: '3.84%' },
	{ name: '展现数', w: '3.84%' },
	{ name: '展现率', w: '3.84%' },
	{ name: 'CPM', w: '3.84%' },
	{ name: '点击数', w: '3.84%' },
	{ name: '点击率', w: '3.84%' },
	{ name: 'CPC', w: '3.84%' },

]
const typeArr = [
	{
		name: 'banner广告',
		value: 'BANNER',
	},
	{
		name: '插屏广告',
		value: 'POPUP',
	},
	{
		name: '开屏广告',
		value: 'OPENSCREEN',
	},
	{
		name: '原生广告',
		value: 'NATIVE',
	},
	{
		name: '视频广告',
		value: 'VIDEO',
	}
]
const DuibiArr=[
	{name:'ADX请求数',value:'requests'},
	{name:'DSP响应数',value:'responses'},
	{name:'响应率',value:'response_rate'},
	{name:'DSP参与竞价数',value:'bids'},
	{name:'DSP参与竞价率',value:'bid_rate'},
	{name:'竞价胜出数',value:'wins'},
	{name:'竞价胜出率',value:'win_rate'},
	{name:'花费',value:'income'},
	{name:'花费占比',value:'income_rate'},
	{name:'展现数',value:'displays'},
	{name:'展现率',value:'display_rate'},
	{name:'CPM',value:'cpm'},
	{name:'点击数',value:'clicks'},
	{name:'点击率',value:'ctr'},
	{name:'CPC',value:'cpc'},
]
@observer
export default class APIDSP extends React.Component {
	constructor() {
		super()
		this.state = {
			size: 5,
			startValue: moment().startOf('day'),
			endValue: moment().endOf('day'),
			endOpen: false,
			appArr:[],
			adType:'',
			dspId:'',
			compareValue1:'ADX请求数',
			compareValue2:'展现数',
			pageNo:1,
			pageSize:10,
			typeArr:[],
			dspArr:[],
			geziWidth:'6.25%',
			typeAll:false,
			dspAll:false
		}
	}
	componentWillMount(){
		GeneralizeManageStore.getAppArr();
		GeneralizeManageStore.getOursSpace();
		GeneralizeManageStore.getAdSpaceSizes();
		let {pageNo,pageSize,startValue,endValue,adType,dspId,compareValue1,compareValue2}=this.state;
		let startStr=this.timeStr(startValue),endStr=this.timeStr(endValue);
		ApiDspStore.getDspName();
		ApiDspStore.getDownloadList(pageNo,pageSize,startStr,endStr,'',adType,dspId,compareValue1,compareValue2,this.callback.bind(this));
	}
	componentDidMount() {
		setTimeout(() => {
			this.echatsShow()
		}, 300)
	}
	onPageChange(e){
		this.setState({pageNo:e});
		this.refreshList();
	}
	onShowSizeChange(p,e){
		this.setState({pageNo:1,pageSize:e});
		this.refreshList();
	}
	refreshList(){
		setTimeout(()=>{
			let {pageNo,pageSize,startValue,endValue,typeArr,dspArr,compareValue1,compareValue2,appArr}=this.state;
			let startStr = this.timeStr(startValue), endStr = this.timeStr(endValue);
			let adType=this.arrStr(typeArr);
			let dspId =this.arrStr(dspArr);
			let appId =this.arrStr(appArr);
			ApiDspStore.getDownloadList(pageNo,pageSize,startStr,endStr,appId,adType,dspId,compareValue1,compareValue2,this.callback.bind(this))
		},300)
	}
	echatsShow() {
		let { daysX ,a1,a2,isRate2,isRate1} = ApiDspStore
		let maxappreg = Client.calMax(a1);//a1最大值
		let maxactive = Client.calMax(a2);//a2最大值
		let interval_left=maxappreg/5;//平均间隔
		let interval_right=maxactive/5;//平均间隔
		let myChart1 = echarts.init(document.getElementById('dataEchart'));
		let option1 = {
			xAxis: {
				type: 'category',
				boundaryGap: false,
				data: [...daysX],
				axisLabel: {
					interval: 0,
					rotate: daysX.length > 7 ? 40 : 0
				}
			},
			grid: {
				left: '3%',
				right: '4%',
				bottom: '3%',
				containLabel: true
			},
			yAxis: [
				{
					name:this.state.compareValue1,
					type: 'value',
					max:maxappreg,
					splitNumber:5,
					interval:interval_left,
					axisLabel: {
						show: true,
						interval: 'auto',
						formatter: isRate1?'{value} %':'{value}'
					},
				},
				{
					name:this.state.compareValue2,
					type:'value',
					max:maxactive,
					splitNumber:5,
					interval:interval_right,
					axisLabel: {
						show: true,
						interval: 'auto',
						formatter: isRate2?'{value} %':'{value}'
					},
				}
			],
			legend: {
				data: [this.state.compareValue1, this.state.compareValue2]
			},
			tooltip: {
				trigger: 'axis',
				formatter:function(params) {
					var relVal = params[0].name;
					for (var i = 0, l = params.length; i < l; i++) {
						let str='';
						if(i==0){
							str='<div class="yuanqiu" style="background:#7d0022; "></div>';
						}else{
							str='<div class="yuanqiu" style="background:#4fc1e9; "></div>';
						}
						if(params[i].seriesName.indexOf('率')!=-1||params[i].seriesName.indexOf('比')!=-1) {
							relVal += '<br/>'+str + params[i].seriesName + ' : ' + params[i].value+"%";
						}else{
							relVal += '<br/>'+str + params[i].seriesName + ' : ' + params[i].value;
						}
					}
					return relVal;
				}
			},
			series: [
				{
					name: this.state.compareValue1,
					type: 'line',
					lineStyle: {
						normal: {
							width: 1,
							opacity: 0.7
						}
					},
					data: [...a1],
					areaStyle: {
						normal: {
							opacity: 0.25
						}
					},
					smooth: true,
				},
				{
					name: this.state.compareValue2,
					type: 'line',
					yAxisIndex:1,
					lineStyle: {
						normal: {
							width: 1,
							opacity: 0.7
						}
					},
					data: [...a2],
					areaStyle: {
						normal: {
							opacity: 0.25
						}
					},
					smooth: true,
				}
			],
			color: ['#7d0022', '#4fc1e9'],
		};
		myChart1.setOption(option1, true);
		window.addEventListener("resize", () => { myChart1.resize(); });
	}
	arrStr(arr){
		let str=''
		for(let i=0;i<arr.length;i++){
			if(i==arr.length-1){
				str+=arr[i];
			}else{
				str+=arr[i]+',';
			}
		}
		return str;
	}
	query() {
		this.setState({
			pageNo:1
		})
		let {pageSize,startValue, endValue,typeArr,dspArr,compareValue1,compareValue2,appArr} = this.state;
		let startStr = this.timeStr(startValue), endStr = this.timeStr(endValue);
		let adType=this.arrStr(typeArr);
		let dspId =this.arrStr(dspArr);
		let appId=this.arrStr(appArr)
		let arr=[adType,dspId];
		let num=0;
		for(let i=0;i<arr.length; i++){
			if(arr[i]==''){
				num+=1;
			}
		}
		this.setState({
			geziWidth:100/(19-num)+'%'
		})
		ApiDspStore.getDownloadList(1,pageSize,startStr, endStr,appId,adType,dspId,compareValue1,compareValue2,this.callback.bind(this))
		ApiDspStore.storeTypeArr=this.state.typeArr;
		ApiDspStore.storeAppArr=this.state.appArr;
		ApiDspStore.storeChannelArr=this.state.channelArr;
	}
	callback(){
		this.echatsShow()
	}
	componentWillUnmount(){
		ApiDspStore.storeTypeArr=[];
		ApiDspStore.storeAppArr=[];
		ApiDspStore.storeChannelArr=[];
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
	downloadExcel(e) {
		return ExcellentExport.excel(e.target, 'mediadatatable', 'Sheet Name Here');
	}
	onTypeChange(e) {
		this.setState({ typeArr: e });
	}
	onDspChange(e) {
		this.setState({ dspArr: e });
	}
	onTypeAllChange(e){
		if(e.target.value){
			this.setState({
				typeArr:[]
			})
		}else{
			let arr=[];
			for(let i=0;i<typeArr.length;i++){
				arr.push(typeArr[i].value);
			}
			this.setState({
				typeArr:arr
			})
		}
		this.setState({
			typeAll:!e.target.value
		})
	}
	onDspAllChange(e){
		if(e.target.value){
			this.setState({
				dspArr:[]
			})
		}else{
			let{dspArr}=ApiDspStore;
			let arr=[];
			for(let i=0;i<dspArr.length;i++){
				arr.push(dspArr[i].id);
			}
			this.setState({
				dspArr:arr
			})
		}
		this.setState({
			dspAll:!e.target.value
		})
	}
	rangeChange(startValue,endValue){
		this.setState({
			startValue:startValue,
			endValue:endValue
		})
	}
	timeStr(startValue){
		if (startValue) {
			return Client.formatDate(startValue.valueOf()).replace('-', '').replace('-', '');
		}else{
			return''
		}
	}
	onAppAllChange(e) {
		if (e.target.value) {
			this.setState({
				appArr: []
			})
		} else {
			let { appArr } = GeneralizeManageStore;
			let arr = [];
			for (let i = 0; i < appArr.length; i++) {
				if(appArr[i].APP_ID){
					arr.push('@'+appArr[i].APP_ID);
				}else{
					arr.push('#'+appArr[i].APP_GROUP_ID);
				}
			}
			this.setState({
				appArr: arr
			})
		}
	}
	onAppChange(a) {
		this.setState({ appArr: a })
	}
	render() {
		let {appArr}=GeneralizeManageStore
		let {DownloadList,total,dspArr,storeTypeArr,storeDspArr,storeAppArr}=ApiDspStore;
		return (
			<div>
				<Layout history={this.props.history} />
				<div className="content">
					<div className="contentBulk3" style={{ paddingTop: 10 }}>
						<div className="listROwlet2">
							<div className="form-left" style={{ width: '30%' }}>
								日期：
							</div>
							<div className="form-right" style={{ width: '60%' }}>
								<RangePickerCom call={(startValue,endValue)=>this.rangeChange(startValue,endValue)}/>
							</div>
						</div>
						<div className="listROwlet2" style={{minHeight:60,lineHeight: '30px'}}>
							<div className="form-left" style={{ width: '30%' }}>
								广告类型：
							</div>
							<div className="form-right-multiple" style={{ width: '50%' }}>
								<Checkbox onChange={this.onTypeAllChange.bind(this)}
										  indeterminate={this.state.typeArr.length!=0&&this.state.typeArr.length<typeArr.length}
										  checked={this.state.typeArr.length==typeArr.length} value={this.state.typeArr.length==typeArr.length}/>
								<Select
									mode="multiple"
									placeholder="请选择广告类型"
									value={this.state.typeArr}
									maxTagCount={1}
									onChange={this.onTypeChange.bind(this)}
									style={{ width: '100%' ,marginLeft:10}}
								>
									{typeArr.map((i, k) => (
										<Option value={i.value} key={k}>{i.name}</Option>
									))}
								</Select>
							</div>
						</div>
						<div className="listROwlet2" style={{minHeight:60,lineHeight: '30px'}}>
							<div className="form-left" style={{ width: '30%' }}>
								dsp名称：
							</div>
							<div className="form-right-multiple" style={{ width: '50%' }}>
								<Checkbox onChange={this.onDspAllChange.bind(this)}
										  indeterminate={this.state.dspArr.length!=0&&this.state.dspArr.length<dspArr.length}
										  checked={this.state.dspArr.length==dspArr.length} value={this.state.dspArr.length==dspArr.length}/>
								<Select
									mode="multiple"
									placeholder="请选择渠道"
									value={this.state.dspArr}
									maxTagCount={1}
									onChange={this.onDspChange.bind(this)}
									style={{ width: '100%' ,marginLeft:10}}
								>
									{dspArr.map((i, k) => (
										<Option value={i.id} key={k}>{i.name}</Option>
									))}
								</Select>
							</div>
						</div>
						<div className="listROwlet2" style={{ minHeight: 60, lineHeight: '30px' }}>
							<div className="form-left" style={{ width: '30%' }}>
								媒体名称：
							</div>
							<div className="form-right-multiple" style={{ width: '50%' }}>
								<Checkbox onChange={this.onAppAllChange.bind(this)}
										  indeterminate={this.state.appArr.length!=0&&this.state.appArr.length<appArr.length}
										  checked={this.state.appArr.length==appArr.length} value={this.state.appArr.length==appArr.length} />
								<Select
									mode="multiple"
									placeholder="请选择媒体"
									value={this.state.appArr}
									maxTagCount={1}
									onChange={this.onAppChange.bind(this)}
									style={{ width: '100%', marginLeft: 10 }}
								>
									{appArr.map((i, k) => (
										<Option key={k} value={i.APP_ID?'@'+i.APP_ID:'#'+i.APP_GROUP_ID}>{i.NAME}</Option>
									))}
								</Select>
							</div>
						</div>
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
							<table style={{ width: '120%' }} id="mediadatatable">
								<thead>
								<tr className="table-head1" >
									{
										headArr.map((i, k) => {
											if(i.name=='媒体名称'&&storeAppArr.length==0){
												return null
											}else if(i.name=='广告类型'&&storeTypeArr.length==0){
												return null
											}else if(i.name=='dsp名称'&&storeDspArr.length==0){
												 return null
											 }else {
												return(
													<th key={k} style={{ width:this.state.geziWidth }} className="gezi" title={i.name}>
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
											{storeAppArr.length!=0?(
												<td className="gezi" style={{ width: this.state.geziWidth }}>{/*dsp名称*/}
													{i.event_date=='合计'?'--':Client.formatListData(i.app_group_id==null?i.app_name:i.group_name)}
												</td>
											):null}

											{storeDspArr.length!=0?(
												<td className="gezi" title={i.dsp_name} style={{ width: this.state.geziWidth }}>{/*dsp名称*/}
													{i.event_date=='合计'?'--':Client.formatListData(i.dsp_name)}
												</td>
											):null}

											{storeTypeArr.length!=0?(
												<td className="gezi"  style={{ width: this.state.geziWidth }}>{/*广告类型*/}
													{i.event_date=='合计'?'--':Client.adTypeEffect(Client.formatListData(i.ad_type))}
												</td>
											):null}
											<td className="gezi" title={i.requests} style={{ width: this.state.geziWidth }}>{/*ADX请求数*/}
												{Client.formatListData(i.requests)}
											</td>
											<td className="gezi" title={i.responses} style={{ width: this.state.geziWidth }}>{/*DSP响应数*/}
												{Client.formatListData(i.responses)}
											</td>
											<td className="gezi"  style={{ width: this.state.geziWidth }}>{/*响应率*/}
												{Client.addRate(i.response_rate)}
											</td>
											<td className="gezi"  style={{ width: this.state.geziWidth }}>{/*DSP参与竞价数*/}
												{Client.formatListData(i.bids)}
											</td>
											<td className="gezi"  style={{ width: this.state.geziWidth }}>{/*DSP参与竞价率*/}
												{Client.addRate(i.bid_rate)}
											</td>
											<td className="gezi" title={i.wins} style={{ width: this.state.geziWidth }}>{/*竞价胜出数*/}
												{Client.formatListData(i.wins)}
											</td>
											<td className="gezi"  style={{ width: this.state.geziWidth }}>{/*竞价胜出率*/}
												{Client.addRate(i.win_rate)}
											</td>
											<td className="gezi"  style={{ width: this.state.geziWidth }}>{/*花费*/}
												{Client.formatListData(i.income)}
											</td>
											<td className="gezi" title={i.income_rate} style={{ width: this.state.geziWidth }}>{/*花费占比*/}
												{Client.addRate(i.income_rate)}
											</td>
											<td className="gezi" title={i.displays} style={{ width: this.state.geziWidth }}>{/*展现数*/}
												{Client.formatListData(i.displays)}
											</td>
											<td className="gezi" title={i.display_rate} style={{ width: this.state.geziWidth }}>{/*展现率*/}
												{Client.addRate(i.display_rate)}
											</td>
											<td className="gezi" title={i.cpm} style={{ width: this.state.geziWidth }}>{/*CPM*/}
												{Client.formatListData(i.cpm)}
											</td>
											<td className="gezi" title={i.clicks} style={{ width: this.state.geziWidth }}>{/*点击数*/}
												{Client.formatListData(i.clicks)}
											</td>
											<td className="gezi" title={i.ctr} style={{ width: this.state.geziWidth }}>{/*点击率*/}
												{Client.addRate(i.ctr)}
											</td>
											<td className="gezi" title={i.cpc} style={{ width: this.state.geziWidth }}>{/*CPC*/}
												{Client.formatListData(i.cpc)}
											</td>
										</tr>
									))
								}
								</tbody>
							</table>
						</div>
						<div className='con-head'>
							<Pagination
								pageSizeOptions={['5','10','20','50','100']}
								showSizeChanger
								defaultPageSize={this.state.pageSize}
								current={this.state.pageNo}
								onChange={this.onPageChange.bind(this)}
								onShowSizeChange={this.onShowSizeChange.bind(this)} defaultCurrent={1} total={total} />
						</div>
					</div>
				</div>
			</div>
		)
	}
}
