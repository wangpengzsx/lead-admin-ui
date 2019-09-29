import React from "react";
import Layout from "../../layout/Layout";
import {observer} from "mobx-react";
import {Select,Checkbox,DatePicker} from 'antd';
import echarts from "echarts";
import Client from "../../common/lead-api";
import HomeStore from "../../mobx/home/home-store";
import GeneralizeManageStore from "../../mobx/generalizeSupport/generalize-manage-store";
import $ from "jquery";
import locale from 'antd/lib/date-picker/locale/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
const CheckboxGroup = Checkbox.Group;
const { Option } = Select;
const { RangePicker } = DatePicker;
const cities =[
	{
		name:'打底',
		value:'FALLBACK_DSP'
	},
	{
		name:'天窗',
		value:'DORMANT'
	},
	{
		name:'apidsp',
		value:'API_DSP'
	},
	{
		name:'推广',
		value:'POPU_PLAN'
	}
]
const headArr=[{name:'应用名称',w:'7.69%'},
	{name:'收入',w:'7.69%'},
	{name:'收入占比',w:'7.69%'},
	{name:'请求数',w:'7.69%'},
	{name:'请求占比',w:'7.69%'},
	{name:'响应数',w:'7.69%'},
	{name:'响应率',w:'7.69%'},
	{name:'展现数',w:'7.69%'},
	{name:'填充率',w:'7.69%'},
	{name:'点击数',w:'7.69%'},
	{name:'CTR',w:'7.69%'},
	{name:'CPM',w:'7.69%'},
	{name:'CPC',w:'7.69%'},
];
const headArr1=[{name:'渠道名称',w:'7.69%'},
	{name:'收入',w:'7.69%'},
	{name:'收入占比',w:'7.69%'},
	{name:'请求数',w:'7.69%'},
	{name:'请求占比',w:'7.69%'},
	{name:'响应数',w:'7.69%'},
	{name:'响应率',w:'7.69%'},
	{name:'展现数',w:'7.69%'},
	{name:'填充率',w:'7.69%'},
	{name:'点击数',w:'7.69%'},
	{name:'CTR',w:'7.69%'},
	{name:'CPM',w:'7.69%'},
	{name:'CPC',w:'7.69%'},
];
const timeDuan=[
	'昨天',
	'过去7天',
	'过去30天',
	'自定义'
]
const plainOptions=[{ value: 'income', label: '收入'},
	{ value: 'requestNumber', label: '请求数'},
	{ value: 'responseNumber', label: '响应数'},
	{ value: 'showNumber', label: '曝光数'},
	{ value: 'clickNumber', label: '点击数'},
	{ value: 'cpm', label: 'CPM'},
	{ value: 'cpc', label: 'CPC'},
	{ value: 'ctr', label: 'CTR'},
]
function disabledDate(current) {
	return  current&&current > moment().endOf('day')
}
@observer
export default class Home extends React.Component {
	constructor(){
		super()
		this.state={
			radioValue:['income','requestNumber'],
			whenTime:'过去7天',
			planStart:'',
			planEnd:'',
			startValue: moment().subtract(7, 'days'),
			endValue: moment().subtract(1, 'days'),
			endOpen: false,
			channelValue:'',
			appId:''
		}
	}
	componentDidMount(){
		let {startValue,endValue,channelValue,appId}=this.state;
		HomeStore.getOverviewMedia(this.timeStr(startValue),this.timeStr(endValue));
		HomeStore.getOverviewSell(this.timeStr(startValue),this.timeStr(endValue));
		HomeStore.homePageLineChart(this.timeStr(startValue),this.timeStr(endValue),channelValue,appId,this.callback.bind(this));
		GeneralizeManageStore.getAppArr()
	}
	callback(){
		this.echatsShow();
	}
	refresh(){
		let {startValue,endValue,channelValue,appId}=this.state;
		HomeStore.getOverviewMedia(this.timeStr(startValue),this.timeStr(endValue));
		HomeStore.getOverviewSell(this.timeStr(startValue),this.timeStr(endValue));
		HomeStore.homePageLineChart(this.timeStr(startValue),this.timeStr(endValue),channelValue,appId,this.callback.bind(this));
	}
	timeStr(startValue){
		let startStr='';
		if(startValue){
			startStr=Client.formatDate(startValue.valueOf()).replace('-','').replace('-','');
		}
		return startStr;
	}
	onChange = (field, value) => {
		this.setState({
			[field]: value,
		});
	}
	handleChange(value){
		let str= value.slice(0,1);
		if(str=='@'){
			value=value.substr(1);
		}
		this.setState({
			appId:value
		})
		setTimeout(()=>{
			this.refresh()
		},300)
	}
	first(a){
		let{a1,a2,a3,a4,a5,a6,a7,a8}=HomeStore
		if(this.state.radioValue[a]=='income'){
			return a1;
		}else if(this.state.radioValue[a]=='requestNumber'){
			return a2;
		}else if(this.state.radioValue[a]=='responseNumber'){
			return a3;
		}else if(this.state.radioValue[a]=='showNumber'){
			return a4;
		}else if(this.state.radioValue[a]=='clickNumber'){
			return a5;
		}else if(this.state.radioValue[a]=='cpm'){
			return a6;
		}else if(this.state.radioValue[a]=='cpc'){
			return a7;
		}else if(this.state.radioValue[a]=='ctr'){
			return a8;
		}
	}
	lineNum(){
		let arr1=[];
		for(let i=0; i<this.state.radioValue.length;i++){
			let obj={
				name:'今天',
				type: 'line',
				lineStyle:{
					normal:{
						width:1,
						opacity:0.7
					}

				},
				data: [...this.first(0)],
				areaStyle: {
					normal: {
						opacity:0.25
					}
				},
				smooth: true,
			}
			if(this.state.radioValue[i]=='income'){
				obj.name="收入";
				obj.data=[...this.first(i)]
			}
			if(this.state.radioValue[i]=='requestNumber'){
				obj.name="请求数";
				obj.data=[...this.first(i)]
			}
			if(this.state.radioValue[i]=='responseNumber'){
				obj.name="响应数";
				obj.data=[...this.first(i)]
			}
			if(this.state.radioValue[i]=='showNumber'){
				obj.name="曝光数";
				obj.data=[...this.first(i)]
			}
			if(this.state.radioValue[i]=='clickNumber'){
				obj.name="点击数";
				obj.data=[...this.first(i)]
			}
			if(this.state.radioValue[i]=='cpm'){
				obj.name="CPM";
				obj.data=[...this.first(i)]
			}
			if(this.state.radioValue[i]=='cpc'){
				obj.name="CPC";
				obj.data=[...this.first(i)]
			}
			if(this.state.radioValue[i]=='ctr'){
				obj.name="CTR";
				obj.data=[...this.first(i)]
			}
			arr1.push(obj);
		}
		if(arr1[1]){
			arr1[1].yAxisIndex=1
		}
		return arr1;
	}
	chartTitle(){
		let arr=[];
		for(let i=0; i<this.state.radioValue.length;i++){
			if(this.state.radioValue[i]=='income'){
				arr.push("收入");
			}else if(this.state.radioValue[i]=='requestNumber'){
				arr.push("请求数");
			}else if(this.state.radioValue[i]=='responseNumber'){
				arr.push("响应数");
			}else if(this.state.radioValue[i]=='showNumber'){
				arr.push("曝光数");
			}else if(this.state.radioValue[i]=='clickNumber'){
				arr.push("点击数");
			}else if(this.state.radioValue[i]=='cpm'){
				arr.push("CPM");
			}else if(this.state.radioValue[i]=='cpc'){
				arr.push("CPC");
			}else if(this.state.radioValue[i]=='ctr'){
				arr.push("CTR");
			}
		}
		return arr;
	}
	colorArr(){
		let arr=[];
		for(let i=0; i<this.state.radioValue.length;i++){
			if(i==0){
				arr.push('#7d0022')
			}else{
				arr.push('#4fc1e9')
			}
		}
		return arr;
	}
	yzhou(arr){
		let arr1=[];
		for(let i=0;i<arr.length;i++){
			let maxappreg = Client.calMax1(arr[i].data);//a1最大值
			let interval_left=maxappreg/5;//平均间隔
			let obj={
				name:arr[i].name,
				type: 'value',
				max:maxappreg,
				splitNumber:5,
				interval:interval_left,
			}
			arr1.push(obj)
		}
		return arr1;
	}
	echatsShow(){
		let{daysX}=HomeStore
		let myChart1 = echarts.init(document.getElementById('homeEchart'));
		let option1 = {
			xAxis: {
				type: 'category',
				boundaryGap : false,
				data:[...daysX],
				axisLabel: {
					interval:0,
					rotate:daysX.length>7?40:0
				}
			},
			grid: {
				left: '3%',
				right: '4%',
				bottom: '3%',
				containLabel: true
			},
			yAxis: this.yzhou(this.lineNum()),
			legend: {
				data:this.chartTitle()
			},
			tooltip: {
				trigger: 'axis',
				padding: [5, 20]
			},
			series:this.lineNum(),
			color:this.colorArr(),
		};
		myChart1.setOption(option1,true);
		window.addEventListener("resize", () => {myChart1.resize();});
	}
	onCheckChange(e){
		if(e.length==3&&this.state.radioValue.length==2){
			e.shift()
			this.setState({
				radioValue:e
			})
		}else{
			if(e.length!=0){
				this.setState({
					radioValue:e
				})
			}
		}
		setTimeout(()=>{
			this.echatsShow();
		},300)
	}
	onSelectChange(e){
		this.setState({
			channelValue:e
		})
		setTimeout(()=>{
			this.refresh()
		},300)
	}
	changeTime(i) {
		if (i == '昨天') {
			this.onChange('startValue', moment().subtract(1, 'days'));
			this.onChange('endValue', moment().subtract(1, 'days'));
		} else if (i == '过去7天') {
			this.onChange('startValue', moment().subtract(7, 'days'));
			this.onChange('endValue', moment().subtract(1, 'days'));
		} else if (i == '过去30天') {
			this.onChange('startValue', moment().subtract(30, 'days'));
			this.onChange('endValue', moment().subtract(1, 'days'));
		}
		this.setState({whenTime: i})
		setTimeout(()=>{
			this.refresh()
		},300)
	}
	qudao(value){
		for(let i=0;i<cities.length;i++){
			if(value==cities[i].value){
				return cities[i].name;
			}
		}
	}
	onRangeChange(a){
		let start=new Date(a[0].format('YYYY-MM-DD')).getTime()
		let end=new Date(a[1].format('YYYY-MM-DD')).getTime()
		if(end-start>86400000*30){
			Client.showTank(false,'时间范围不要大于31天')
			this.setState({
				startValue: moment().subtract(30, 'days'),
				endValue: moment().subtract(0, 'days')
			})
			setTimeout(()=>{
				this.refresh()
			},300)
		}else{
			this.setState({
				startValue: a[0],
				endValue: a[1]
			})
			setTimeout(()=>{
				this.refresh()
			},300)
		}
	}
	render() {
		let {mediaResult,sellResult,topPandect}=HomeStore
		let {appArr}=GeneralizeManageStore;
		return (
			<div>
				<Layout history={this.props.history} hasNav={true}/>
				<div className="homeScreen">
					<div>
						<Select
							defaultValue="所有媒体"
							style={{ width: 120 ,marginRight:20}}
							onChange={this.handleChange.bind(this)}
						>
							<Option value="">所有媒体</Option>
							{appArr.map((i,k)=>(
								<Option value={i.APP_ID?'@'+i.APP_ID:'$'+i.APP_GROUP_ID} key={k}>{i.NAME}</Option>
							))}
						</Select>
						<Select
							style={{ width: 120 }}
							defaultValue="所有渠道"
							onChange={(e)=>this.onSelectChange(e)}
						>
							<Option value="">所有渠道</Option>
							{cities.map((i,k) => <Option key={k} value={i.value}>{i.name}</Option>)}
						</Select>
					</div>
					<div className="shellParent">
						<div className="shellWall">
							{timeDuan.map((i,k)=>(
								<div className="timeChoiceBtn"
									 key={k}
									 style={{backgroundColor:this.state.whenTime==i?'#e5e5e5':'#fff'}}
									 onClick={()=>{this.changeTime(i)}}>
									{i}
								</div>
							))}
						</div>
						{this.state.whenTime=='自定义'?(
							<div style={{textAlign: 'center',float:'right',display:'inline-block',marginRight:40}}>
								<RangePicker
									style={{width:300}}
									locale={locale}
									disabledDate={disabledDate}
									value={[this.state.startValue,this.state.endValue]}
									onChange={(a)=>this.onRangeChange(a)} />
							</div>
						):null}
					</div>
				</div>
				<div className="content">
					<div className="contentBulk1">
						<div style={{width:'100%'}}>
							{topPandect.map((i,k)=>(
								<div className="homeNavGezi" key={k}>
									<div className="geziUp">
										{i.name}
									</div>
									<div className="geziDown">
										<span className="bigFont" >
											{i.num}
										</span>
										{/*{i.unit}*/}
									</div>
									{k!=0?(<div className="leftBorder"></div>):null}
								</div>
							))}
						</div>
					</div>
					<div className="contentBulk1">
						<div className="echartsBox" id="homeEchart">
						</div>
						<div className="fenlei">
							<div style={{width:610}}>
								<CheckboxGroup buttonStyle={{color:'#48bfeb'}}
											   options={plainOptions}
											   value={this.state.radioValue}
											   onChange={(e)=>this.onCheckChange(e)} />

							</div>
						</div>
					</div>
					<div className="list-haed">
						<span className="dah1">
							媒体数据概览
						</span>
					</div>
					<div className="contentBulk">
						<div className="table-head">
							{
								headArr.map((i,k)=>(
									<div key={k} style={{width:i.w,float:'left',textAlign:'center',fontSize:12}}>
										{i.name}
									</div>
								))
							}
						</div>
						{mediaResult.map((i,k)=>(
							<div className="table-body" key={k} style={{background:k%2==0?'#fff':'#fafafa'}}>
								<div  style={{width:headArr[0].w}} className='gezi'>
									{Client.formatListData(i.app_group_id!=null?i.group_name:i.app_name)}
								</div>
								<div  style={{width:headArr[1].w}} className='gezi'>
									{Client.toThousands(i.income)}
								</div>
								<div  style={{width:headArr[2].w}} className='gezi'>
									{Client.addRate(i.income_rate)}
								</div>
								<div  style={{width:headArr[3].w}} className='gezi'>
									{Client.toThousands(i.requests)}
								</div>
								<div  style={{width:headArr[4].w}} className='gezi'>
									{Client.addRate(i.request_rate)}
								</div>
								<div  style={{width:headArr[5].w}} className='gezi'>
									{Client.toThousands(i.adx_responses)}
								</div>
								<div  style={{width:headArr[6].w}} className='gezi'>
									{Client.addRate(i.response_rate)}
								</div>
								<div  style={{width:headArr[7].w}} className='gezi'>
									{Client.toThousands(i.displays)}
								</div>
								<div  style={{width:headArr[8].w}} className='gezi'>
									{Client.addRate(i.filling_rate)}
								</div>
								<div  style={{width:headArr[9].w}} className='gezi'>
									{Client.toThousands(i.clicks)}
								</div>
								<div  style={{width:headArr[10].w}} className='gezi'>
									{Client.addRate(i.ctr)}
								</div>
								<div  style={{width:headArr[11].w}} className='gezi'>
									{Client.toThousands(i.cpm)}
								</div>
								<div  style={{width:headArr[12].w}} className='gezi'>
									{Client.toThousands(i.cpc)}
								</div>
							</div>
						))}
					</div>
					<div className="list-haed">
						<span className="dah1">
							变现渠道数据概览
						</span>
					</div>
					<div className="contentBulk">
						<div className="table-head">
							{
								headArr1.map((i,k)=>(
									<div key={k} style={{width:i.w,float:'left',textAlign:'center',fontSize:12}}>
										{i.name}
									</div>
								))
							}
						</div>
						{sellResult.map((i,k)=>(
							<div className="table-body" key={k} style={{background:k%2==0?'#fff':'#fafafa'}}>
								<div  style={{width:headArr[0].w}} className='gezi'>
									{k==sellResult.length-1?'合计':this.qudao(i.channel_name)}
								</div>
								<div  style={{width:headArr[1].w}} className='gezi'>
									{Client.toThousands(i.income)}
								</div>
								<div  style={{width:headArr[2].w}} className='gezi'>
									{Client.addRate(i.income_ratio)  }
								</div>
								<div  style={{width:headArr[3].w}} className='gezi'>
									{Client.toThousands(i.requests)}
								</div>
								<div  style={{width:headArr[4].w}} className='gezi'>
									{Client.addRate(i.request_ratio)}
								</div>
								<div  style={{width:headArr[5].w}} className='gezi'>
									{Client.toThousands(i.responses)}
								</div>
								<div  style={{width:headArr[6].w}} className='gezi'>
									{Client.addRate(i.response_rate)}
								</div>
								<div  style={{width:headArr[7].w}} className='gezi'>
									{Client.toThousands(i.displays)}
								</div>
								<div  style={{width:headArr[8].w}} className='gezi'>
									{Client.addRate(i.filling_rate)}
								</div>
								<div  style={{width:headArr[9].w}} className='gezi'>
									{Client.toThousands(i.clicks)}
								</div>
								<div  style={{width:headArr[10].w}} className='gezi'>
									{Client.addRate(i.ctr)}
								</div>
								<div  style={{width:headArr[11].w}} className='gezi'>
									{Client.toFixed(i.cpm)}
								</div>
								<div  style={{width:headArr[12].w}} className='gezi'>
									{Client.toFixed(i.cpc)}
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		)
	}
}
