import React from "react";
import Layout from "../../../layout/Layout";
import echarts from "echarts";
import {Checkbox,Icon,Select,Switch,DatePicker} from "antd";
import 'moment/locale/zh-cn';
import moment from 'moment';
import ModificationModal from './modal/modificationMadal'
import {observer} from "mobx-react";
import RenderSetStore from '../../../mobx/renderSet/render-set-store'
import Client from "../../../common/lead-api";
import locale from 'antd/lib/date-picker/locale/zh_CN';
const CheckboxGroup = Checkbox.Group;
const { RangePicker } = DatePicker;
const Option = Select.Option;
moment.locale('zh-cn');
function disabledDate(current) {
	return  current&&current > moment().endOf('day')
}
const headArr=[{name:'打底广告平台名称',w:'5.64%'},
	{name:'状态',w:'5.64%'},
	{name:'策略数量',w:'5.64%'},
	{name:'开启策略数量',w:'5.64%'},
	{name:'总请求数',w:'5.64%'},
	{name:'请求数',w:'5.64%'},
	{name:'请求占比',w:'5.64%'},
	{name:'响应数',w:'5.64%'},
	{name:'响应率',w:'5.64%'},
	{name:'曝光数',w:'5.64%'},
	{name:'曝光率',w:'5.64%'},
	{name:'点击数',w:'5.64%'},
	{name:'CTR',w:'5.64%'},
	{name:'CPM',w:'5.64%'},
	{name:'CPC',w:'5.64%'},
	{name:'收入',w:'5.64%'},
	{name:'最后更新时间',w:'5.64%'},
];
const DuibiArr=[
	{name:'请求数',value:'requests'},
	{name:'响应数',value:'responses'},
	{name:'响应率',value:'response_rate'},
	{name:'曝光数',value:'displays'},
	{name:'曝光率',value:'display_rate'},
	{name:'点击数',value:'clicks'},
	{name:'CTR',value:'ctr'},
	{name:'CPM',value:'cpm'},
	{name:'CPC',value:'cpc'},
	{name:'收入',value:'income'},
]
const timeDuan=[
	{name:"0",start:0,end:1,state:false,value:"10",tDuan:"00:00~01:00"},
	{name:"1",start:1,end:2,state:false,value:"11",tDuan:"01:00~02:00"},
	{name:"2",start:2,end:3,state:false,value:"12",tDuan:"02:00~03:00"},
	{name:"3",start:3,end:4,state:false,value:"13",tDuan:"03:00~04:00"},
	{name:"4",start:4,end:5,state:false,value:"14",tDuan:"04:00~05:00"},
	{name:"5",start:5,end:6,state:false,value:"15",tDuan:"05:00~06:00"},
	{name:"6",start:6,end:7,state:false,value:"16",tDuan:"06:00~07:00"},
	{name:"7",start:7,end:8,state:false,value:"17",tDuan:"07:00~08:00"},
	{name:"8",start:8,end:9,state:false,value:"18",tDuan:"08:00~09:00"},
	{name:"9",start:9,end:10,state:false,value:"19",tDuan:"09:00~10:00"},
	{name:"10",start:10,end:11,state:false,value:"110",tDuan:"10:00~11:00"},
	{name:"11",start:11,end:12,state:false,value:"111",tDuan:"11:00~12:00"},
	{name:"12",start:12,end:13,state:false,value:"112",tDuan:"12:00~13:00"},
	{name:"13",start:13,end:14,state:false,value:"113",tDuan:"13:00~14:00"},
	{name:"14",start:14,end:15,state:false,value:"114",tDuan:"14:00~15:00"},
	{name:"15",start:15,end:16,state:false,value:"115",tDuan:"15:00~16:00"},
	{name:"16",start:16,end:17,state:false,value:"116",tDuan:"16:00~17:00"},
	{name:"17",start:17,end:18,state:false,value:"117",tDuan:"17:00~18:00"},
	{name:"18",start:18,end:19,state:false,value:"118",tDuan:"18:00~19:00"},
	{name:"19",start:19,end:20,state:false,value:"119",tDuan:"19:00~20:00"},
	{name:"20",start:20,end:21,state:false,value:"120",tDuan:"20:00~21:00"},
	{name:"21",start:21,end:22,state:false,value:"121",tDuan:"21:00~22:00"},
	{name:"22",start:22,end:23,state:false,value:"122",tDuan:"22:00~23:00"},
	{name:"23",start:23,end:24,state:false,value:"123",tDuan:"23:00~24:00"}]
@observer
export default class RenderSet extends React.Component {
	constructor(){
		super()
		this.state={
			radioValue:[],
			planStart: null,
			planEnd: null,
			startValue:moment().subtract(7, 'days'),
			endValue:moment().subtract(1, 'days'),
			size:1,
			chooseIdArr:[],
			selectValue:'income',
			tishiShow:false,
			tishiShow1:false,
			compareValue:'请求数',
			duibi:false,
			timeDuan:timeDuan
		}
	}
	initcallback(checkArr){
		this.setState({
			radioValue:[checkArr[0].value,checkArr[1].value]
		})
		setTimeout(()=>{
			this.echartShow();
		},300)
	}
	callback1(){
		setTimeout(()=>{
			this.echartShow();
		},300)
	}
	callback(){
		setTimeout(()=>{
			this.echartShow1();
		},300)
	}
	timeStr(startValue){
		let startStr='';
		if(startValue){
			startStr=Client.formatDate(startValue.valueOf()).replace('-','').replace('-','');
		}
		return startStr;
	}
	componentDidMount(){
		let {startValue,endValue,compareValue,radioValue}=this.state;
		RenderSetStore.getLeadFallbackDsps(this.timeStr(startValue),this.timeStr(endValue),this.callback.bind(this))
		RenderSetStore.getLeadFallbackEcharts(this.timeStr(startValue),this.timeStr(endValue),radioValue,compareValue,this.initcallback.bind(this))
	}
	refreshLeft(){
		let {startValue,endValue,compareValue,radioValue}=this.state;
		RenderSetStore.getLeadFallbackEcharts(this.timeStr(startValue),this.timeStr(endValue),radioValue,compareValue,this.callback1.bind(this))
	}
	refreshRight(){
		let {startValue,endValue}=this.state;
		RenderSetStore.getLeadFallbackDsps(this.timeStr(startValue),this.timeStr(endValue),this.callback.bind(this));
	}
	refresh(){
		this.refreshLeft();
		this.refreshRight();
	}
	echartShow=()=>{
		let {stripKeyArr,stripDataArr1,stripDataArr2,checkedNameArr}=RenderSetStore
		let serArr=[];
		if(stripDataArr2.length==0){
			serArr=[
				{
					name: [...checkedNameArr][0],
					type: 'bar',
					barGap: 0,
					data: [...stripDataArr1]
				}]
		}else{
			serArr=[
				{
					name: [...checkedNameArr][0],
					type: 'bar',
					barGap: 0,
					data: [...stripDataArr1]
				},
				{
					name: [...checkedNameArr][1],
					type: 'bar',
					barGap: 0,
					data: [...stripDataArr2]
				}
			]
		}
		var myChart = echarts.init(document.getElementById('main'));
		// 指定图表的配置项和数据
		var option = {
			color: ['#2e4554','#5ea0a9'],
			tooltip: {
				trigger: 'axis',
				axisPointer: {
					type: 'shadow'
				}
			},
			legend: {
				data: [...checkedNameArr]
			},
			calculable: true,
			xAxis: [
				{
					type: 'category',
					data: [...stripKeyArr],
					axisLabel: {
						interval: 0,
						rotate: stripKeyArr.length > 7 ? 40 : 0
					}
				}
			],
			yAxis: [
				{
					type: 'value'
				}
			],
			series: serArr
		};
		// 使用刚指定的配置项和数据显示图表。
		myChart.setOption(option,true);
		window.addEventListener("resize", () => {myChart.resize();});
	}
	echartShow1(){
		let {lineDataArr,lineKeyArr}=RenderSetStore;
		let myChart1 = echarts.init(document.getElementById('main1'));
		let option1 = {
			xAxis: {
				type: 'category',
				boundaryGap: false,
				data: [...lineKeyArr],
				axisLabel: {
					interval: 0,
					rotate: lineKeyArr.length > 7 ? 40 : 0
				}
			},
			yAxis: {
				type: 'value'
			},
			tooltip: {
				trigger: 'axis'
			},
			series: [{
				data: [...lineDataArr],
				type: 'line',
			}]
		};
		myChart1.setOption(option1);
		window.addEventListener("resize", () => {myChart1.resize();});
	}
	onSelectChange(e){
		this.setState({
			compareValue:e
		})
		setTimeout(()=>{
			this.refreshLeft();
		},200)
	}
	onAllChange(e){
		let {FallbackList}=RenderSetStore;
		let arr=[];
		FallbackList.map((i,k)=>{
			if(k<FallbackList.length-1){
				arr.push(i.fallback_id)
			}
		});
		let arr1=this.state.chooseIdArr;
		if(!e.target.checked){
			arr1=arr
		}else{
			arr1=[]
		}
		this.setState({
			chooseIdArr:arr1
		});
	}
	onChange(i){
		let arr=this.state.chooseIdArr;
		if(arr.indexOf(i)>-1){
			let index=arr.indexOf(i);
			if (index > -1) {
				arr.splice(index, 1);
			}
		}else{
			arr.push(i);
		}
		this.setState({
			chooseIdArr:arr
		});
	}
	closeItem(){
		if(this.state.chooseIdArr.length>0){
			RenderSetStore.changeLeadFallbackDsps(1,this.state.chooseIdArr)
			setTimeout(()=>{
				this.refresh()
			},300)
		}else{
			Client.showTank(false,'请选择需要修改的打底平台')
		}
	}
	openItem(){
		if(this.state.chooseIdArr.length>0){
			RenderSetStore.changeLeadFallbackDsps(0,this.state.chooseIdArr)
			setTimeout(()=>{
				this.refresh()
			},300)
		}else{
			Client.showTank(false,'请选择需要修改的打底平台')
		}
	}
	openModal(id){
		this._modificationModal.openModal(id)
	}
	onSwitchChange(e,id){
		if(e){
			RenderSetStore.changeLeadFallbackDsps(0,[id])
		}else{
			RenderSetStore.changeLeadFallbackDsps(1,[id])
		}
		setTimeout(()=>{
			this.refresh()
		},100)
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
		let{startValue,endValue,compareValue}=this.state;
		RenderSetStore.getLeadFallbackEcharts(this.timeStr(startValue),this.timeStr(endValue),e,compareValue,this.callback1.bind(this))
	}
	aaa(j){
		return this.add(j)+":00~"+this.add(j+1)+":00"
	}
	add(j){
		if(j<10){
			j="0"+j;
		}
		return j;
	}
	skip(id){
		localStorage.setItem('fallbackId',id);
		this.props.history.push('/putInStrategyManage');
	}
	onRangeChange(a){
		let start=new Date(a[0].format('YYYY-MM-DD')).getTime()
		let end=new Date(a[1].format('YYYY-MM-DD')).getTime()
		if(end-start>86400000*6){
			Client.showTank(false,'时间范围不要大于7天')
			this.setState({
				startValue: moment().subtract(7, 'days'),
				endValue: moment().subtract(1, 'days')
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
		let {FallbackList,FallbackCheckArr}=RenderSetStore;
		return (
			<div>
				<Layout history={this.props.history} hasNav={true}/>
				<ModificationModal ref={(e)=>this._modificationModal=e}/>
				<div className="content">
					<div style={{width:'100%',height:50}}>
						<div style={{textAlign: 'center',float:'left',display:'inline-block',marginRight:40}}>
							<RangePicker
								style={{width:300}}
								locale={locale}
								disabledDate={disabledDate}
								value={[this.state.startValue,this.state.endValue]}
								onChange={(a)=>this.onRangeChange(a)} />
						</div>
					</div>
					<div style={{width:'100%',height:350,marginBottom:10,position:'relative'}}>
						<div className="leftGrid">
							<div className="list-haed" style={{position:'relative'}}>
								<span className="dah1">
									打底广告平台变现效果对比
								</span>
								<div className="tishiH"
									  onMouseEnter={()=>this.setState({tishiShow:true})}
									  onMouseLeave={()=>{this.setState({tishiShow:false})}}>
									<Icon type="exclamation-circle" theme="outlined" />
								</div>
								{this.state.tishiShow?(
									<div className="tishiAlert">
										对比各广告平台变现效果，如响应率、曝光率、eCPM，适当调高变现效果好的平台的切量比例
									</div>
								):null}
							</div>
							<div className="contentBulk">
								<div className="leftTopBox" id="main" >
								</div>
								<div className="fenlei2">
									<div>
										<CheckboxGroup buttonStyle={{color:'#48bfeb'}}
													   options={[...FallbackCheckArr]}
													   value={this.state.radioValue}
													   onChange={(e)=>this.onCheckChange(e)} />
									</div>
								</div>
							</div>
						</div>
						<div className="rightGrid">
							<div className="list-haed" style={{position:'relative'}}>
								<span className="dah1">
									打底广告竞价胜出率
								</span>
								<div className="tishiH"
									 onMouseEnter={()=>this.setState({tishiShow1:true})}
									 onMouseLeave={()=>{this.setState({tishiShow1:false})}}>
									<Icon type="exclamation-circle" theme="outlined" />
								</div>
								{this.state.tishiShow1?(
									<div className="tishiAlert1">
										打底广告竞价胜出率=打底广告总响应数/ADX请求数
									</div>
								):null}
							</div>
							<div className="contentBulk">
								<div className="rightTopBox" id="main1">
								</div>
							</div>
						</div>
						<Select value={this.state.compareValue}
								onChange={(e)=>this.onSelectChange(e)}
								style={{ width: 120 ,position:'absolute',top:60,left:10,zIndex:1000}} >
							{DuibiArr.map((i,k)=>(<Option value={i.name} key={k}>{i.name}</Option>))}
						</Select>
					</div>
					<div style={{overflowX: "scroll",width:'100%'}}>
						<div className="contentBulk1" style={{marginTop:10,width:'130%'}}>
							<div className="con-head">
								<div>
									<button className="borderBtn" onClick={()=>this.openItem()}>开启</button>
									<button className="borderBtn" onClick={()=>this.closeItem()}>关闭</button>
								</div>
							</div>
							<div className="table-head">
								<div  style={{width:'4%',float:'left',textAlign:'center'}}>
									<Checkbox onChange={this.onAllChange.bind(this)}
											  checked={this.state.chooseIdArr.length==FallbackList.length-1}/>
								</div>
								{headArr.map((i,k)=> (
									<div key={k} style={{width:'5.64%',float:'left',textAlign:'center',color:'#808080',lineHeight:'29px',height:'30px'}} title={i.name} className="gezi">
										{i.name}
									</div>
								))}
							</div>
							<div style={{width:'100%'}}>
								{FallbackList.map((i,k)=>(
									<div className="table-body" key={k}>
										<div className="gezi" style={{width:'4%'}}>
											{i.fallback_name=='合计'?null:(
												<Checkbox onChange={this.onChange.bind(this,i.fallback_id)}
														  checked={this.state.chooseIdArr.indexOf(i.fallback_id)>-1}/>
											)}
										</div>
										<div className="gezi" style={{width:'5.64%'}}>
											<span className="modification"
													onClick={()=>{this.skip(i.fallback_id)}}>
												{i.fallback_name}
											</span>
										</div>
										<div className="gezi" style={{width:'5.64%'}}>
											{i.fallback_name=='合计'?null:(
												<Switch checkedChildren="开"
														unCheckedChildren="关"
														defaultChecked
														onChange={(e)=>this.onSwitchChange(e,i.fallback_id)}
														checked={i.fallback_state==0}/>
											)}
										</div>
										<div className="gezi" style={{width:'5.64%'}}>{/*策略数量*/}
											{i.strategy_num}
										</div>
										<div className="gezi" style={{width:'5.64%'}}>{/*策略开启数量*/}
											{i.open_strategy_num}
										</div>
										<div className="gezi" style={{width:'5.64%'}}>{/*总请求数*/}
											{i.requests}
										</div>
										<div className="gezi" style={{width:'5.64%'}}>{/*请求数*/}
											{i.requests}
										</div>
										<div className="gezi" style={{width:'5.64%'}}>{/*请求占比*/}
											{Client.addRate(i.request_rate)}
										</div>
										<div className="gezi" style={{width:'5.64%'}}>{/*响应数*/}
											{i.responses}
										</div>
										<div className="gezi" style={{width:'5.64%'}}>{/*响应率*/}
											{Client.addRate(i.response_rate)}
										</div>
										<div className="gezi" style={{width:'5.64%'}}>{/*曝光数*/}
											{i.displays}
										</div>
										<div className="gezi" style={{width:'5.64%'}}>{/*曝光率*/}
											{Client.addRate(i.display_rate)}
										</div>
										<div className="gezi" style={{width:'5.64%'}}>{/*点击数*/}
											{i.clicks}
										</div>
										<div className="gezi" style={{width:'5.64%'}}>{/*CTR*/}
											{i.ctr}
										</div>
										<div className="gezi" style={{width:'5.64%'}}>{/*CPM*/}
											{i.cpm}
										</div>
										<div className="gezi" style={{width:'5.64%'}}>{/*CPC*/}
											{i.cpc}
										</div>
										<div className="gezi" style={{width:'5.64%'}}>{/*收入*/}
											{i.income}
										</div>
										<div className="gezi" style={{width:'5.64%'}}>{/*最后更新时间*/}
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
}
