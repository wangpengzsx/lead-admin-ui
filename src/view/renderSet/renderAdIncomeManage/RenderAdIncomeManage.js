import React from "react";
import Layout from "../../../layout/Layout";
import LabelSelect from "../putInStrategyManage/component/LabelSelect";
import LabelInput from "../components/LabelInput";
import RangeMonthPicker from "./components/RangeMonthPicker";
import {Link} from "react-router-dom";
import {Checkbox,Pagination} from "antd";
import renderIncomeStore from "../../../mobx/renderSet/render-income-store";
import {observer} from "mobx-react";
import putInStrategyStore from "../../../mobx/renderSet/PutInStrategyManage/putIn-strategy-store";
import Client from "../../../common/lead-api";
import moment from 'moment';
const headArr=[
	{name:'任务名称',w:'12%'},
	{name:'打底广告平台名称',w:'12%'},
	{name:'日期',w:'12%'},
	{name:'上传数据条数',w:'12%'},
	{name:'最后修改时间',w:'12%'},
	{name:'数据预览',w:'12%'},
	{name:'预览任务内容',w:'12%'},
	{name:'操作',w:'12%'},
];
@observer
export default class RenderAdIncomeManage extends React.Component {
	constructor(props){
		super(props)
		this.state={
			adValue: '',
			inputValue:'',
			page:1,
			pageSize:10,
			choiceArr:[],
			startValue:moment(moment().subtract(6,'months').format('L')),
			endValue:moment(moment().subtract(1,'months').format('L'))
		}
	}
	componentWillMount(){
		putInStrategyStore.getFallbackArr()
		renderIncomeStore.searchAccount('','',this.state.page,this.state.pageSize)
	}
	selectCallback(e,c){
		this.setState({[e]:c})
	}
	inputCallback(e,c){
		this.setState({[e]:c})
	}
	createItem(){
		this.props.history.push({pathname:'/newTask'});
	}
	deleteItem(){
		Client.getNullArgument('strategy/updateTaskState?ids='+this.state.choiceArr.join()+'&state='+-1).then(res=>{
			this.query()
		})
	}
	query(){
		let {adValue,inputValue,page,pageSize}=this.state;
		renderIncomeStore.searchAccount(adValue,inputValue,page,pageSize);
	}
	onAllChange(e){
		let {dspTask}=renderIncomeStore
		let arr=[];
		dspTask.map(i=>{arr.push(i.task_id)})
		let arr1=[];
		if(e.target.checked){
			arr1=arr;
		}else{
			arr1=[];
		}
		this.setState({
			choiceArr:arr1
		})
	}
	onOneChange(id){
		let arr=this.state.choiceArr;
		if(arr.indexOf(id)>-1){
			let index=arr.indexOf(id);
			if (index > -1) {
				arr.splice(index, 1);
			}
		}else{
			arr.push(id);
		}
		this.setState({
			choiceArr:arr
		})
	}
	skipBid(){
		this.props.history.push({pathname:'/bottomingAds'})
	}
	onPageChange(e){
		this.setState({page:e})
		setTimeout(()=>{
			this.query()
		},300)
	}
	onShowSizeChange(e,c){
		this.setState({page:e,pageSize:c})
		setTimeout(()=>{
			this.query()
		},300)
	}
	rangeChange(a){
		this.setState({
			startValue:a[0],
			endValue:a[1]
		})
	}
	skipCon(id){
		this.props.history.push({pathname:'/previewTask'})
		localStorage.setItem('taskId',id)
	}
	render() {
		let {dspTask,total}=renderIncomeStore
		let {fallArr}=putInStrategyStore
		return (
			<div>
				<Layout history={this.props.history}/>
				<div className="content">
					<div className="contentBulk3" style={{ paddingTop: 10 }}>
						<LabelSelect typeArr={fallArr} value={this.state.adValue} call={this.selectCallback.bind(this,'adValue')} label="广告平台名称"/>
						<LabelInput placeholder="请输入任务名称" value={this.state.inputValue} call={(e)=>this.inputCallback('inputValue',e)} label="任务名称"/>
						<RangeMonthPicker call={(a)=>this.rangeChange(a)}/>
					</div>
					<div style={{ paddingBottom: 10 }}>
						<button className="filtrateBtn" onClick={() => { this.query() }}>
							查询
						</button>
					</div>
					<div className="contentBulk1" style={{marginTop:10,width:'100%'}}>
						<div className="con-head">
							<div>
								<button className="borderBtn" onClick={()=>this.createItem()}>创建任务</button>
								<button className="borderBtn" onClick={()=>this.deleteItem()}>删除</button>
							</div>
						</div>
						<div className="table-head">
							<div  style={{width:'4%',float:'left',textAlign:'center'}}>
								<Checkbox checked={this.state.choiceArr.length==dspTask.length} onChange={this.onAllChange.bind(this)}/>
							</div>
							{headArr.map((i,k)=>{
								return(
									<div key={k} style={{width:i.w,float:'left',textAlign:'center',color:'#808080',lineHeight:'29px',height:'30px'}} title={i.name} className="gezi">
										{i.name}
									</div>
								)
							})}
						</div>
						{dspTask.map((i,k)=>(
							<div className="table-body" key={k}>
								<div className="gezi" style={{width:'4%'}}>
									<Checkbox checked={this.state.choiceArr.indexOf(i.task_id)>-1} onChange={()=>this.onOneChange(i.task_id)}/>
								</div>
								<div className="gezi" style={{width:'12%'}}>{/*任务名称*/}
									{i.task_name}
								</div>
								<div className="gezi" style={{width:'12%'}}>{/*打底广告平台名称*/}
									{i.dap_name}
								</div>
								<div className="gezi" style={{width:'12%'}}>{/*日期*/}
									{i.task_cycle}
								</div>
								<div className="gezi" style={{width:'12%'}}>{/*上传数据条数*/}
									{i.total_number}
								</div>
								<div className="gezi" style={{width:'12%'}}>{/*最后修改时间*/}
									{Client.formatDateTime(i.modify_time)}
								</div>
								<div className="gezi" style={{width:'12%'}}>{/*数据预览*/}
									<span className="modification"
										  onClick={()=>this.skipBid()}>查看</span>
								</div>
								<div className="gezi" style={{width:'12%'}}>{/*预览任务内容*/}
									<span className="modification"
										  onClick={()=>this.skipCon(i.task_id)}>查看</span>
								</div>
								<div className="gezi" style={{width:'12%'}}>{/*操作*/}
									<Link to={{pathname:'/newTask',name:i.task_name,id:i.task_id,dspId:i.dsp_id}}>
										编辑
									</Link>
								</div>
							</div>
						))}
						<div className="con-foot">
							<Pagination pageSizeOptions={['10','20','50','100']}
										showSizeChanger
										defaultPageSize={this.state.pageSize}
										onChange={this.onPageChange.bind(this)}
										onShowSizeChange={this.onShowSizeChange.bind(this)}
										current={this.state.page}
										defaultCurrent={this.state.page} total={total} />
						</div>
					</div>
				</div>
			</div>
		)
	}
}
