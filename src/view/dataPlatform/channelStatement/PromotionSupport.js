import React from "react";
import Layout from "../../../layout/Layout";
import { Checkbox,Pagination, Select} from "antd";
const Option = Select.Option;
import moment from 'moment';
import echarts from "echarts";
import { observer } from "mobx-react";
import GeneralizeManageStore from "../../../mobx/generalizeSupport/generalize-manage-store";
import PromotionSupportStore from "../../../mobx/dataPlatform/promotion-support-store";
import Client from "../../../common/lead-api";
import ExcellentExport from 'excellentexport';
import RangePickerCom from '../component/RangePickerCom';
const headArr = [
	{ name: '日期', w: '3.84%' },
	{ name: '推广名称', w: '3.84%' },
	{ name: '推广类型', w: '3.84%' },
	{ name: '广告位名称', w: '3.84%' },
	{ name: '广告位类型', w: '3.84%' },
	{ name: '应用名称', w: '3.84%' },
	{ name: '请求数', w: '3.84%' },
	{ name: '展现数', w: '3.84%' },
	{ name: '展现率', w: '3.84%' },
	{ name: '点击数', w: '3.84%' },
	{ name: '点击率', w: '3.84%' },
	{ name: '下载', w: '3.84%' },
	{ name: '下载率', w: '3.84%' },
	{ name: '安装', w: '3.84%' },
	{ name: '安装率', w: '3.84%' },

]
const popuTypeArr=[
	{
		name:'游戏',
		value:'GAME'
	},
	{
		name:'官网',
		value:'SITE'
	}
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
	{name:'请求数',value:'requests'},
	{name:'展现数',value:'displays'},
	{name:'展现率',value:'display_rate'},
	{name:'点击数',value:'clicks'},
	{name:'点击率',value:'ctr'},
	{name:'下载',value:'downloads'},
	{name:'下载率',value:'download_rate'},
	{name:'安装',value:'installs'},
	{name:'安装率',value:'install_rate'},
]
@observer
export default class PromotionSupport extends React.Component {
	constructor() {
		super()
		this.state = {
			size: 5,
			startValue: moment().startOf('day'),
			endValue: moment().endOf('day'),
			endOpen: false,
			adType:'',
			popuPlanId:'',
			popuType:'',
			spaceId:'',
			compareValue1:'请求数',
			compareValue2:'展现数',
			pageNo:1,
			pageSize:10,
			popuArr:[],
			popuTypeArr:[],
			typeArr:[],
			spaceArr:[],
			appArr:[],
			geziWidth:'10%',
		}
	}
	componentWillMount(){
		GeneralizeManageStore.getAppArr();
		GeneralizeManageStore.getOursSpace();
		GeneralizeManageStore.getAdSpaceSizes();
		let {pageNo,pageSize,startValue,endValue,popuPlanId,popuType,adType,spaceId,compareValue1,compareValue2,appArr}=this.state;
		let startStr=this.timeStr(startValue),endStr=this.timeStr(endValue);
		PromotionSupportStore.getPopularizePlans();
		let appId=this.arrStr(appArr);
		PromotionSupportStore.getDownloadList(pageNo,pageSize,startStr,endStr,popuPlanId,popuType,adType,spaceId,appId,compareValue1,compareValue2,this.callback.bind(this));
	}
	componentDidMount() {
		setTimeout(() => {
			this.echatsShow()
		}, 300)
	}
	timeStr(startValue){
		if (startValue) {
			return Client.formatDate(startValue.valueOf()).replace('-', '').replace('-', '');
		}else{
			return''
		}
	}
	onPageChange(e){
		this.setState({pageNo:e});
		this.refreshList();
	}
	onShowSizeChange(p,e){
		this.setState({pageNo:p,pageSize:e});
		this.refreshList();
	}
	refreshList(){
		setTimeout(()=>{
			let { pageNo,pageSize,startValue, endValue,popuArr,popuTypeArr,typeArr,spaceArr,compareValue1,compareValue2,appArr} = this.state;
			let startStr = this.timeStr(startValue), endStr = this.timeStr(endValue);
			let popuPlanId=this.arrStr(popuArr);
			let popuType=this.arrStr(popuTypeArr);
			let adType=this.arrStr(typeArr);
			let spaceId=this.arrStr(spaceArr);
			let appId=this.arrStr(appArr);
			PromotionSupportStore.getDownloadList(pageNo,pageSize,startStr,endStr,popuPlanId,popuType,adType,spaceId,appId,compareValue1,compareValue2,this.callback.bind(this))
		},300)
	}
	echatsShow() {
		let { daysX ,a1,a2,isRate1,isRate2} = PromotionSupportStore
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
		let {pageSize,startValue, endValue,popuArr,popuTypeArr,typeArr,spaceArr,compareValue1,compareValue2,appArr} = this.state;
		let startStr = this.timeStr(startValue), endStr = this.timeStr(endValue);
		let popuPlanId=this.arrStr(popuArr);
		let popuType=this.arrStr(popuTypeArr);
		let adType=this.arrStr(typeArr);
		let spaceId=this.arrStr(spaceArr);
		let appId=this.arrStr(appArr);
		let arr=[popuPlanId,popuType,adType,spaceId,appId];
		let num=0;
		for(let i=0;i<arr.length; i++){
			if(arr[i]==''){
				num+=1;
			}
		}
		this.setState({
			geziWidth:100/(15-num)+'%'
		})
		PromotionSupportStore.getDownloadList(1,pageSize,startStr, endStr,popuPlanId,popuType,adType,spaceId,appId,compareValue1,compareValue2,this.callback.bind(this))
		PromotionSupportStore.storeTypeArr=this.state.typeArr;
		PromotionSupportStore.storePopuArr=this.state.popuArr;
		PromotionSupportStore.storePopuTypeArr=this.state.popuTypeArr;
		PromotionSupportStore.storeSpaceArr=this.state.spaceArr;
		PromotionSupportStore.storeAppArr=this.state.appArr;
	}
	callback(){
		this.echatsShow()
	}
	componentWillUnmount(){
		PromotionSupportStore.storeTypeArr=[];
		PromotionSupportStore.storePopuArr=[];
		PromotionSupportStore.storePopuTypeArr=[];
		PromotionSupportStore.storeSpaceArr=[];
		PromotionSupportStore.storeAppArr=[];
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
	onOneChange(a,arrStr){
		this.setState({[arrStr]:a})
	}
	onAllChange(e,arrStr,allArr,id){
		if(e.target.value){
			this.setState({
				[arrStr]:[]
			})
		}else{
			console.log(allArr)
			let arr=[];
			for(let i=0;i<allArr.length;i++){
				arr.push(allArr[i][id]);
			}
			this.setState({
				[arrStr]:arr
			})
		}
	}
	onAppAllChange(e){
		if(e.target.value){
			this.setState({
				appArr:[]
			})
		}else{
			let  {appArr}=GeneralizeManageStore;
			let arr=[];
			for(let i=0;i<appArr.length;i++){
				arr.push(appArr[i].APP_ID?'@'+appArr[i].APP_ID:'#'+appArr[i].APP_GROUP_ID);
			}
			this.setState({
				appArr:arr
			})
		}
	}
	rangeChange(startValue,endValue){
		this.setState({
			startValue:startValue,
			endValue:endValue
		})
	}
	render() {
		let {appArr,oursSpace}=GeneralizeManageStore;
		let {DownloadList,total,storePopuArr,storePopuTypeArr,storeTypeArr,storeSpaceArr,popuArr,storeAppArr}=PromotionSupportStore;
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
								推广名称：
							</div>
							<div className="form-right-multiple" style={{ width: '50%' }}>
								<Checkbox onChange={(e)=>this.onAllChange(e,'popuArr',popuArr,'id')}
										  indeterminate={this.state.popuArr.length!=0&&this.state.popuArr.length<popuArr.length}
										  checked={this.state.popuArr.length==popuArr.length} value={this.state.popuArr.length==popuArr.length}/>
								<Select
									mode="multiple"
									placeholder="请选择推广名称"
									value={this.state.popuArr}
									maxTagCount={1}
									onChange={(e)=>this.onOneChange(e,'popuArr')}
									style={{ width: '100%' ,marginLeft:10}}
								>
									{popuArr.map((i, k) => (
										<Option value={i.id} key={k}>{i.name}</Option>
									))}
								</Select>
							</div>
						</div>
						<div className="listROwlet2" style={{minHeight:60,lineHeight: '30px'}}>
							<div className="form-left" style={{ width: '30%' }}>
								推广类型：
							</div>
							<div className="form-right-multiple" style={{ width: '50%' }}>
								<Checkbox onChange={(e)=>this.onAllChange(e,'popuTypeArr',popuTypeArr,'value')}
										  indeterminate={this.state.popuTypeArr.length!=0&&this.state.popuTypeArr.length<popuTypeArr.length}
										  checked={this.state.popuTypeArr.length==popuTypeArr.length} value={this.state.popuTypeArr.length==popuTypeArr.length}/>
								<Select
									mode="multiple"
									placeholder="请选择推广类型"
									value={this.state.popuTypeArr}
									maxTagCount={1}
									onChange={(e)=>this.onOneChange(e,'popuTypeArr')}
									style={{ width: '100%' ,marginLeft:10}}
								>
									{popuTypeArr.map((i, k) => (
										<Option value={i.value} key={k}>{i.name}</Option>
									))}
								</Select>
							</div>
						</div>
						<div className="listROwlet2" style={{minHeight:60,lineHeight: '30px'}}>
							<div className="form-left" style={{ width: '30%' }}>
								广告位：
							</div>

							<div className="form-right-multiple" style={{ width: '50%'}}>
								<Checkbox onChange={(e)=>this.onAllChange(e,'spaceArr',oursSpace,'id')}
										  indeterminate={this.state.spaceArr.length!=0&&this.state.spaceArr.length<oursSpace.length}
										  checked={this.state.spaceArr.length==oursSpace.length} value={this.state.spaceArr.length==oursSpace.length}/>
								<Select
									mode="multiple"
									placeholder="请选择广告位"
									value={this.state.spaceArr}
									maxTagCount={1}
									onChange={(e)=>this.onOneChange(e,'spaceArr')}
									style={{ width: '100%',marginLeft:10 }}
								>
									{oursSpace.map(d => <Option key={d.id} value={d.id}>{d.adSpaceName}</Option>)}
								</Select>
							</div>
						</div>
						<div className="listROwlet2" style={{minHeight:60,lineHeight: '30px'}}>
							<div className="form-left" style={{ width: '30%' }}>
								广告类型：
							</div>
							<div className="form-right-multiple" style={{ width: '50%' }}>
								<Checkbox onChange={(e)=>this.onAllChange(e,'typeArr',typeArr,'value')}
										  indeterminate={this.state.typeArr.length!=0&&this.state.typeArr.length<typeArr.length}
										  checked={this.state.typeArr.length==typeArr.length} value={this.state.typeArr.length==typeArr.length}/>
								<Select
									mode="multiple"
									placeholder="请选择广告类型"
									value={this.state.typeArr}
									maxTagCount={1}
									onChange={(e)=>this.onOneChange(e,'typeArr')}
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
								应用：
							</div>
							<div className="form-right-multiple" style={{ width: '50%' }}>
								<Checkbox onChange={this.onAppAllChange.bind(this)}
										  indeterminate={this.state.appArr.length!=0&&this.state.appArr.length<appArr.length}
										  checked={this.state.appArr.length==appArr.length} value={this.state.appArr.length==appArr.length}/>
								<Select
									mode="multiple"
									placeholder="请选择应用"
									value={this.state.appArr}
									maxTagCount={1}
									onChange={(e)=>this.onOneChange(e,'appArr')}
									style={{ width: '100%',marginLeft:10 }}
								>
									{appArr.map((i,k)=>(
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
											if(i.name=='广告位类型'&&storeTypeArr.length==0){
												return null;
											}else if(i.name=='推广名称'&&storePopuArr.length==0){
												return null;
											}else if(i.name=='推广类型'&&storePopuTypeArr.length==0){
												return null;
											}else if(i.name=='广告位名称'&&storeSpaceArr.length==0){
												return null;
											}else if(i.name=='应用名称'&&storeAppArr.length==0){
												return null;
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
											{storePopuArr.length!=0?(
												<td className="gezi"  style={{ width: this.state.geziWidth }}>{/*推广名称*/}
													{i.event_date=='合计'?'--':Client.formatListData(i.popu_plan_name)}
												</td>
											):null}
											{storePopuTypeArr.length!=0?(
												<td className="gezi"  style={{ width: this.state.geziWidth }}>{/*推广类型*/}
													{i.event_date=='合计'?'--':Client.formatListData(i.popu_plan_type)}
												</td>
											):null}
											{storeSpaceArr.length!=0?(
												<td className="gezi"  style={{ width: this.state.geziWidth }}>{/*广告位名称*/}
													{i.event_date=='合计'?'--':Client.formatListData(i.space_name)}
												</td>
											):null}
											{storeTypeArr.length!=0?(
												<td className="gezi"  style={{ width: this.state.geziWidth }}>{/*广告位类型*/}
													{i.event_date=='合计'?'--':Client.adTypeEffect(Client.formatListData(i.ad_type))}
												</td>
											):null}
											{storeAppArr.length!=0?(
												<td className="gezi"  style={{ width: this.state.geziWidth }}>{/*应用名称*/}
													{i.event_date=='合计'?'--':Client.formatListData(i.app_group_id==null?i.app_name:i.group_name)}
												</td>
											):null}
											<td className="gezi" title={i.requests} style={{ width: this.state.geziWidth }}>{/*请求数*/}
												{Client.formatListData(i.requests)}
											</td>
											<td className="gezi" title={i.displays} style={{ width: this.state.geziWidth }}>{/*展现数*/}
												{Client.formatListData(i.displays)}
											</td>
											<td className="gezi"  style={{ width: this.state.geziWidth }}>{/*展现率*/}
												{Client.addRate(i.display_rate)}
											</td>
											<td className="gezi"  style={{ width: this.state.geziWidth }}>{/*点击数*/}
												{Client.formatListData(i.clicks)}
											</td>
											<td className="gezi"  style={{ width: this.state.geziWidth }}>{/*点击率*/}
												{Client.addRate(i.ctr) }
											</td>
											<td className="gezi" title={i.downloads} style={{ width: this.state.geziWidth }}>{/*下载*/}
												{Client.formatListData(i.downloads)}
											</td>
											<td className="gezi"  style={{ width: this.state.geziWidth }}>{/*下载率*/}
												{Client.addRate(i.download_rate)}
											</td>
											<td className="gezi"  style={{ width: this.state.geziWidth }}>{/*安装*/}
												{Client.formatListData(i.installs)}
											</td>
											<td className="gezi" title={i.clicks} style={{ width: this.state.geziWidth }}>{/*安装率*/}
												{Client.addRate(i.install_rate)}
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
