import React from "react";
import Layout from "../../../layout/Layout";
import { Checkbox, Pagination, Select} from "antd";
const Option = Select.Option;
import moment from 'moment';
import echarts from "echarts";
import { observer } from "mobx-react";
import GeneralizeManageStore from "../../../mobx/generalizeSupport/generalize-manage-store";
import SearchSelect from '../component/SearchSelect'
import RevenueEnquityStore from "../../../mobx/dataPlatform/revenue-enquity-store";
import Client from "../../../common/lead-api";
import ExcellentExport from 'excellentexport';
import RangePickerCom from '../component/RangePickerCom'
const headArr = [{ name: '日期', w: '3.84%' },
	{ name: '开发者名称', w: '3.84%' },
	{ name: '开发者主体', w: '3.84%' },
	{ name: '应用名称', w: '3.84%' },
	{ name: '应用id', w: '3.84%' },
	{ name: '广告类型', w: '3.84%' },
	{ name: '分成方式', w: '3.84%' },
	{ name: '分成比例', w: '3.84%' },
	{ name: 'DAU', w: '3.84%' },
	{ name: '总收入', w: '3.84%' },
	{ name: '开发者总收入', w: '3.84%' },
	{ name: '媒体请求数', w: '3.84%' },
	{ name: 'ADX响应数', w: '3.84%' },
	{ name: '响应率', w: '3.84%' },
	{ name: '展现数', w: '3.84%' },
	{ name: '展现率', w: '3.84%' },
	{ name: '填充率', w: '3.84%' },
	{ name: '第三方CPM', w: '3.84%' },
	{ name: 'CPM', w: '3.84%' },
	{ name: '开发者CPM', w: '3.84%' },
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
	{
		name:'收入',
		value:'income'
	},
	{
		name:'DAU',
		value:'app_dau'
	},
	{
		name:'ARPU',
		value:'arpu'
	},
	{
		name:'媒体请求数',
		value:'requests'
	},
	{
		name:'ADX响应数',
		value:'responses'
	},
	{
		name:'响应率',
		value:'response_rate'
	},
	{
		name:'展现数',
		value:'displays'
	},
	{
		name:'展现率',
		value:'display_rate'
	},
	{
		name:'CPM',
		value:'cpm'
	},
	{
		name:'点击数',
		value:'clicks'
	},
	{
		name:'点击率',
		value:'ctr'
	},
	{
		name:'CPC',
		value:'cpc'
	},
]
const titleLength=23;
@observer
export default class RevenueEnquiry extends React.Component {
	constructor() {
		super()
		this.state = {
			size: 5,
			startValue: moment().startOf('day'),
			endValue: moment().endOf('day'),
			endOpen: false,
			appName:'',
			appId:'',
			devName:'',
			devBody:'',
			adType:'',
			compareValue1:'媒体请求数',
			compareValue2:'展现数',
			pageNo:1,
			pageSize:10,
			typeArr:[],
			geziWidth:'5.55%',
		}
	}
	strMatch(str){
		if(str==''||str==undefined){
			str=''
		}
		return str;
	}
	componentWillMount(){
		GeneralizeManageStore.getAppArr();
		GeneralizeManageStore.getOursSpace();
		GeneralizeManageStore.getAdSpaceSizes();
		RevenueEnquityStore.getDeveloperList();
		let {pageNo,pageSize,startValue,endValue,appId,typeArr,compareValue1,compareValue2,appName,devName,devBody}=this.state;
		RevenueEnquityStore.homePageLineChart(pageNo,pageSize,
			this.timeStr(startValue),
			this.timeStr(endValue),
			this.strMatch(devName),
			this.strMatch(devBody),
			this.strMatch(appName),
			this.strMatch(appId),
			this.arrStr(typeArr),
			compareValue1,compareValue2,
			this.callback.bind(this))
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
			let {pageNo,pageSize,startValue,endValue,appId,typeArr,compareValue1,compareValue2,appName,devName,devBody}=this.state;
			RevenueEnquityStore.homePageLineChart(pageNo,pageSize,
				this.timeStr(startValue),
				this.timeStr(endValue),
				this.strMatch(devName),
				this.strMatch(devBody),
				this.strMatch(appName),
				this.strMatch(appId),
				this.arrStr(typeArr),
				compareValue1,compareValue2,
				this.callback.bind(this))
		},300)
	}
	echatsShow() {
		let { daysX ,a1,a2,isRate1,isRate2} = RevenueEnquityStore
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
		this.setState({pageNo:1})
		let {pageSize,startValue,endValue,appId,typeArr,compareValue1,compareValue2,appName,devName,devBody}=this.state;
		let arr=[appId,this.arrStr(typeArr),appName,devName,devBody];
		let num=0;
		for(let i=0;i<arr.length; i++){
			if(arr[i]==''||arr[i]==undefined){
				num+=1;
			}
		}
		this.setState({
			geziWidth:100/(titleLength-num)+'%'
		})
		RevenueEnquityStore.homePageLineChart(1,pageSize,
			this.timeStr(startValue),
			this.timeStr(endValue),
			this.strMatch(devName),
			this.strMatch(devBody),
			this.strMatch(appName),
			this.strMatch(appId),
			this.arrStr(typeArr),
			compareValue1,compareValue2,
			this.callback.bind(this))
		RevenueEnquityStore.appId = this.strMatch(appId);
		RevenueEnquityStore.appName = this.strMatch(appName);
		RevenueEnquityStore.storeTypeArr = typeArr;
		RevenueEnquityStore.devName = this.strMatch(devName);
		RevenueEnquityStore.devBody = this.strMatch(devBody);
	}
	callback(){
		this.echatsShow()
	}
	timeStr(startValue){
		if (startValue) {
			return Client.formatDate(startValue.valueOf()).replace('-', '').replace('-', '');
		}else{
			return''
		}
	}
	componentWillUnmount(){
		RevenueEnquityStore.storeTypeArr=[];
		RevenueEnquityStore.appName='';
		RevenueEnquityStore.appId='';
		RevenueEnquityStore.devName='';
		RevenueEnquityStore.devBody='';
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
	}
	appNameCall(val){
		this.setState({appName:val})
	}
	appIdCall(val){
		this.setState({appId:val})
	}
	devNameCall(val){
		this.setState({devName:val})
	}
	devBodyCall(val){
		this.setState({devBody:val})
	}
	rangeChange(startValue,endValue){
		this.setState({
			startValue:startValue,
			endValue:endValue
		})
	}
	render() {
		let {DownloadList,total,appName,appId,storeTypeArr,devName,devBody}=RevenueEnquityStore;
		return (
			<div>
				<Layout history={this.props.history} />
				<div className="content">
					<div className="contentBulk3" style={{ paddingTop: 10 }}>
						<div style={{height:80,padding:10}}>
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
									应用名称：
								</div>
								<SearchSelect placeholder="请搜索应用名称"
											  style={{width:180,marginLeft:10}}
											  call={(e)=>this.appNameCall(e)}
											  comTitle="appName"
								/>
							</div>
							<div className="listROwlet2" style={{minHeight:60,lineHeight: '30px'}}>
								<div className="form-left" style={{ width: '30%' }}>
									应用id：
								</div>
								<SearchSelect placeholder="请搜索应用id"
											  style={{width:180,marginLeft:10}}
											  call={(e)=>this.appIdCall(e)}
											  comTitle="appId"
								/>
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
						</div>
						<div style={{height:80,padding:10}}>
							<div className="listROwlet2" style={{minHeight:60,lineHeight: '30px'}}>
								<div className="form-left" style={{ width: '30%' }}>
									开发者名称：
								</div>
								<SearchSelect placeholder="请搜索开发者名称"
											  style={{width:180,marginLeft:10}}
											  call={(e)=>this.devNameCall(e)}
											  comTitle="devName"
								/>
							</div>
							<div className="listROwlet2" style={{minHeight:60,lineHeight: '30px'}}>
								<div className="form-left" style={{ width: '30%' }}>
									开发者主体：
								</div>
								<SearchSelect placeholder="请搜索开发者主体"
											  style={{width:180,marginLeft:10}}
											  call={(e)=>this.devBodyCall(e)}
											  comTitle="devBody"
								/>
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
											if(i.name=='应用名称'&&appName==''){
												return null
											}else if(i.name=='应用id'&&appId==''){
												return null
											}if(i.name=='广告类型'&&storeTypeArr.length==0){
												return null
											}else if(i.name=='开发者名称'&&devName==''){
												return null
											}else if(i.name=='开发者主体'&&devBody==''){
												return null
											}else{
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
											{devName!=''?(
												<td className="gezi" title={i.developer_name} style={{ width: this.state.geziWidth }}>{/*开发者名称*/}
													{i.event_date=='合计'?'--':Client.formatListData(i.developer_name)}
												</td>
											):null}
											{devBody!=''?(
												<td className="gezi" title={i.developer_body} style={{ width: this.state.geziWidth }}>{/*开发者主体*/}
													{i.event_date=='合计'?'--':Client.formatListData(i.developer_body)}
												</td>
											):null}
											{appName!=''?(
												<td className="gezi" title={i.app_name} style={{ width: this.state.geziWidth }}>{/*应用名称*/}
													{i.event_date=='合计'?'--':Client.formatListData(i.app_name)}
												</td>
											):null}
											{appId!=''?(
												<td className="gezi" title={i.app_name} style={{ width: this.state.geziWidth }}>{/*应用id*/}
													{i.event_date=='合计'?'--':Client.formatListData(i.app_name)}
												</td>
											):null}
											{storeTypeArr.length!=0?(
												<td className="gezi"  style={{ width: this.state.geziWidth }}>{/*广告类型*/}
													{i.event_date=='合计'?'--':Client.adTypeEffect(Client.formatListData(i.ad_type))}
												</td>
											):null}
											<td className="gezi"  style={{ width: this.state.geziWidth }}>{/*分成方式*/}
												{i.event_date=='合计'?'--':Client.formatListData1(i.divide_type)}
											</td>
											<td className="gezi"  style={{ width: this.state.geziWidth }}>{/*分成比例*/}
												{i.event_date=='合计'?'--':Client.addRate(i.divide_ratio)}
											</td>
											<td className="gezi"  style={{ width: this.state.geziWidth }}>{/*DAU*/}
												{Client.formatListData(i.app_dau)}
											</td>
											<td className="gezi" title={i.income} style={{ width: this.state.geziWidth }}>{/*总收入*/}
												{Client.formatListData(i.income)}
											</td>
											<td className="gezi"  style={{ width: this.state.geziWidth }}>{/*开发者总收入*/}
												{Client.formatListData(i.developer_income)}
											</td>
											<td className="gezi" title={Client.formatListData(i.requests)} style={{ width: this.state.geziWidth }}>{/*媒体请求数*/}
												{Client.formatListData(i.requests)}
											</td>
											<td className="gezi" title={i.responses} style={{ width: this.state.geziWidth }}>{/*ADX响应数*/}
												{Client.formatListData(i.responses)}
											</td>
											<td className="gezi"  style={{ width: this.state.geziWidth }}>{/*响应率*/}
												{Client.addRate(i.response_rate)}
											</td>
											<td className="gezi" title={i.displays} style={{ width: this.state.geziWidth }}>{/*展现数*/}
												{Client.formatListData(i.displays)}
											</td>
											<td className="gezi"  style={{ width: this.state.geziWidth }}>{/*展现率*/}
												{Client.addRate(i.display_rate)}
											</td>
											<td className="gezi"  style={{ width: this.state.geziWidth }}>{/*填充率*/}
												{Client.addRate(i.filling_rate)}
											</td>
											<td className="gezi"  style={{ width: this.state.geziWidth }}>{/*第三方CPM*/}
											</td>
											<td className="gezi" title={i.cpm} style={{ width: this.state.geziWidth }}>{/*CPM*/}
												{Client.formatListData(i.cpm)}
											</td>
											<td className="gezi"  style={{ width: this.state.geziWidth }}>{/*开发者CPM*/}
												{Client.formatListData(i.divide_cpm)}
											</td>
											<td className="gezi" title={i.clicks} style={{ width: this.state.geziWidth }}>{/*点击数*/}
												{Client.formatListData(i.clicks)}
											</td>
											<td className="gezi" title={i.clicks} style={{ width: this.state.geziWidth }}>{/*点击率*/}
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
