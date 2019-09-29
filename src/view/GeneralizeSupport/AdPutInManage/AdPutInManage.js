import React from "react";
import Layout from "../../../layout/Layout";
import {Checkbox,Switch,Pagination,Select} from "antd";
import echarts from "echarts";
import Client from "../../../common/lead-api";
import adPutInManageStore from '../../../mobx/generalizeSupport/AdPutInManage/ad-put-in-manage-store'
import {observer} from "mobx-react";
import Clipboard from "clipboard";
const { Option } = Select;
const topPandect=[
	{name: "今日花费", num: 0},
	{name: "今日再投广告主数", num: "--"},
 	{name: "在投广告主日均消耗", num: "--"},
 	{name: "广告主最高消耗额", num: "--"},
 	{name: "今日在投计划数", num: "--"},
]
const headArr=[{name:'广告主名称',w:'11.875%'},
	{name:'广告主状态',w:'11.875%'},
	{name:'广告主id',w:'11.875%'},
	{name:'广告主行业分类',w:'11.875%'},
	{name:'计划数',w:'11.875%'},
	{name:'花费',w:'11.875%'},
	{name:'最后更新时间',w:'11.875%'},
	{name:'操作',w:'11.875%'},];
@observer
export default class AdPutInManage extends React.Component {
	constructor(){
		super()
		this.state={
			size:10,
			page:1,
			name:'',
			ids:[]
		}
	}
	componentWillMount(){
		localStorage.removeItem('findAdvertiserId')
		adPutInManageStore.getAdvertiserArr(this.state.size,this.state.page,this.state.name);
	}
	refresh(){
		adPutInManageStore.getAdvertiserArr(this.state.size,this.state.page,this.state.name);
	}
	componentDidMount(){
		this.echatsShow();
		var clipboard = new Clipboard('.geziChild');
		clipboard.on('success', function(e) {
			Client.showTank(true,'复制成功')
		});
	}
	onAllChange(e){
		let {adArr}=adPutInManageStore;
		let arr = [];
		if (e.target.checked) {
			adArr.map(i => arr.push(i.id))
		}
		this.setState({ids: arr})
	}
	onInputChange(e){
		this.setState({
			name:e.target.value
		})
	}
	searchApp(){
		this.refresh();
	}
	onSwitchChange(state,id){
		adPutInManageStore.resetAdvertiserState([id],state,this.callback.bind(this))
	}
	onOneChange(i){
		let arr=this.state.ids;
		if(arr.indexOf(i)>-1){
			let index=arr.indexOf(i);
			if (index > -1) {
				arr.splice(index, 1);
			}
		}else{
			arr.push(i);
		}
		this.setState({
			ids:arr
		});
	}
	onPageChange(page){
		this.setState({page})
		setTimeout(()=>{
			this.refresh()
		},300)
	}
	onShowSizeChange(page,size){
		this.setState({page,size})
		setTimeout(()=>{
			this.refresh()
		},300)
	}
	echatsShow(){
		let myChart1 = echarts.init(document.getElementById('homeEchart'));
		let option1 = {
			xAxis: {
				type: 'category',
				boundaryGap : false,
				data:[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24],
			},
			grid: {
				left: '3%',
				right: '4%',
				bottom: '3%',
				containLabel: true
			},
			yAxis: {
				type:'value'
			},
			legend: {
				data:['今天','昨天','七天前']
			},
			tooltip: {
				trigger: 'axis',
				padding: [5, 20]
			},
			series:[
				{
					name:'今天',
					type:'line',
					data:[ 132, 101, 134, 90, 230, 210,120, 132, 101, 134, 90, 230, 210,120, 132, 101, 134, 90, 230, 210,120, 132, 101, 134]
				},
				{
					name:'昨天',
					type:'line',
					data:[ 134, 90, 230, 210,120, 132, 101, 134, 90, 230, 1210,120, 132, 101, 134, 90, 230, 210,120, 132, 101, 134, 90, 230]
				},
				{
					name:'七天前',
					type:'line',
					data:[ 1342, 101, 134, 90, 2340, 210,120, 132, 1101, 134, 900, 230, 210,120, 132, 101, 134, 90, 230, 210,120, 132, 101, 134]
				}
			],
			color:['#2e4554','#d48265','#c23430'],
		};
		myChart1.setOption(option1,true);
		window.addEventListener("resize", () => {myChart1.resize();});
	}
	skip(id){
		localStorage.setItem('findAdvertiserId',id)
		this.props.history.push({pathname:'/planList'});
	}
	newDsp(){
		this.props.history.push({pathname:'/newDsp'});
	}
	edit(id){
		localStorage.setItem('AdvertiserId',id);
		this.props.history.push({pathname:'/newDsp'})
	}
	openItem(){
		this.resetState(0)
	}
	closeItem(){
		this.resetState(1)
	}
	removeItem(){
		this.resetState(-1)
		this.setState({ids:[]})
	}
	resetState(state){
		adPutInManageStore.resetAdvertiserState(this.state.ids,state,this.callback.bind(this))
	}
	callback(){
		this.refresh()
	}
	onSelectChange(e){
		console.log(e)
	}
	render() {
		let {adArr,total}=adPutInManageStore;
		return (
			<div>
				<Layout history={this.props.history}/>
				<div className="content">
					<div className="contentBulk1">
						<div style={{width:'100%'}}>
							{topPandect.map((i,k)=>(
								<div className="homeNavGezi" key={k} style={{width:'20%'}}>
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
					<div className="contentBulk1" style={{position:'relative'}}>
						<Select  style={{ width: 120 ,position: 'absolute',top:10,zIndex:1000}} onChange={(e)=>this.onSelectChange(e)}>
							<Option value="1">广告主一</Option>
							<Option value="2">广告主二</Option>
						</Select>
						<div className="echartsBox" id="homeEchart">
						</div>
					</div>
					<div className="contentBulk1">
						<div className="con-head">
							<div>
								<button className="borderBtn" onClick={()=>this.newDsp()}>创建广告主</button>
								<button className="borderBtn" onClick={()=>this.openItem()}>开启</button>
								<button className="borderBtn" onClick={()=>this.closeItem()}>关闭</button>
								<button className="borderBtn" onClick={()=>this.removeItem()}>删除</button>
							</div>
							<div className="searchInput">
								<input type="text"
									   placeholder="请输入查询的名称和关键字"
									   onChange={(e)=>this.onInputChange(e)}
									   className='searchInputText'/>
								<div className='searchInputButton' onClick={()=>this.searchApp()}></div>

							</div>
						</div>
						<div className="table-head">
							<div  style={{width:'5%',float:'left',textAlign:'center'}}>
								<Checkbox onChange={this.onAllChange.bind(this)} checked={this.state.ids.length==adArr.length}/>
							</div>
							{
								headArr.map((i,k)=>(
									<div key={k} style={{width:i.w,float:'left',textAlign:'center'}}>
										{i.name}
									</div>
								))
							}
						</div>
						{adArr.map((i,k)=>(
							<div className="table-body" key={k} style={{background:k%2==0?'#fff':'#fafafa'}}>
								<div  style={{width:'5%'}} className='gezi'>
									<Checkbox onChange={this.onOneChange.bind(this,i.id)} checked={this.state.ids.indexOf(i.id)>-1}/>
								</div>
								<div  style={{width:headArr[0].w}} className='gezi'>{/*广告主名称*/}
									<span className="modification" onClick={()=>{this.skip(i.id)}}>
										{i.name}
									</span>
								</div>
								<div  style={{width:headArr[1].w}} className='gezi'>{/*广告主状态*/}
									<Switch checkedChildren="开" unCheckedChildren="关" checked={i.advState==0} onChange={()=>this.onSwitchChange(i.advState==0?1:0,i.id)}/>
								</div>
								<div  style={{width:headArr[2].w}} className='gezi'>{/*广告主id*/}
									{i.id}
									<button id={i.id}  data-clipboard-text={i.id} className="geziChild">
										复制
									</button>
								</div>
								<div style={{width:headArr[3].w}} className='gezi'>{/*广告主行业分类*/}
									{i.industryType.name}
								</div>
								<div  style={{width:headArr[4].w}} className='gezi'>{/*计划数*/}
									{i.planNum}
								</div>
								<div  style={{width:headArr[5].w}} className='gezi'>{/*花费*/}
								</div>
								<div  style={{width:headArr[6].w}}
									  title={Client.formatDateTime(i.modifyTime)}
									  className='gezi'>{/*最后更新时间*/}
									{Client.formatDateTime(i.modifyTime)}
								</div>
								<div  style={{width:headArr[7].w}} className='gezi'>{/*操作*/}
									<span className="modification" onClick={()=>{this.edit(i.id)}}>编辑</span>
								</div>
							</div>
						))}
						<div className='con-head'>
							<Pagination
								pageSizeOptions={['10','20','50','100']}
								showSizeChanger
								defaultPageSize={this.state.size}
								onChange={this.onPageChange.bind(this)}
								onShowSizeChange={this.onShowSizeChange.bind(this)} defaultCurrent={1} total={total} />
						</div>
					</div>
				</div>
			</div>
		)
	}
}
