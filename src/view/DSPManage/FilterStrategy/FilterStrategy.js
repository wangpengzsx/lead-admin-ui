import React from "react";
import Layout from "../../../layout/Layout";
import {Checkbox,Pagination} from 'antd';
import {observer} from "mobx-react";
import Client from "../../../common/lead-api";
import filterStrategyStore from '../../../mobx/dspManage/DSPManageStore/filter-strategy-store'
const headArr=[
	{name:'过滤策略名称',w:'12%'},
	{name:'适用DSP平台',w:'12%'},
	{name:'适用媒体',w:'12%'},
	{name:'适用广告类型',w:'12%'},
	{name:'过滤广告主行业',w:'12%'},
	{name:'过滤关键词',w:'12%'},
	{name:'策略创建时间',w:'12%'},
	{name:'操作',w:'12%'},
]
@observer
export default class FilterStrategy extends React.Component {
	constructor(props){
		super(props)
		this.state={
			name:'',
			size:10,
			page:1,
			chooseIdArr:[]
		}
	}
	componentWillMount(){
		let{name,size,page}=this.state;
		filterStrategyStore.getStrategy(name,page,size)
		this.clearStore();
	}
	removeItem(){
		filterStrategyStore.deleteStrategy(this.state.chooseIdArr,this.callback.bind(this))
	}
	callback(){
		let{name,size,page}=this.state;
		filterStrategyStore.getStrategy(name,page,size)
		this.setState({chooseIdArr:[]})
	}
	onInputChange(e){
		this.setState({
			name:e.target.value
		})
	}
	searchApp(){
		let{name,size,page}=this.state;
		filterStrategyStore.getStrategy(name,page,size)
	}
	onAllChange(e){
		let {strategyArr}=filterStrategyStore;
		let arr=[];
		strategyArr.map(i=>arr.push(i.id));
		let arr1=this.state.chooseIdArr;
		if(e.target.checked){
			arr1=arr
		}else{
			for(let i=0;i<arr1.length; i++){
				for(let j=0;j<arr.length; j++){
					if(arr1[i]==arr[j]){
						arr1.splice(i,1)
					}
				}
			}
		}
		this.setState({
			chooseIdArr:arr1
		});
	}
	onOneChange(i){
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
	onPageChange(page){
		let {name,size}=this.state;
		filterStrategyStore.getStrategy(name,page,size)
	}
	onShowSizeChange(current, pageSize){
		let {name}=this.state;
		filterStrategyStore.getStrategy(name,1,pageSize)
		this.setState({
			size: pageSize,
			page: 1
		})
	}
	edit(id){
		localStorage.setItem('filterStrategyId',id);
		Client.getNullArgument('dsp/filter/'+id).then(res=>{
			filterStrategyStore.value1=res.data.name;
			filterStrategyStore.value2=res.data.dsp.id;
			filterStrategyStore.value3=res.data.app?'@'+res.data.app.id:'$'+res.data.appGroup.id;
			filterStrategyStore.value4=res.data.spaceTypes.split(',');
			filterStrategyStore.text5=res.data.blackCategory==''?[]:res.data.blackCategory.split(',');
			if(res.data.blackCategory&&res.data.blackCategory!=''){
				filterStrategyStore.state5='yes'
			}else{
				filterStrategyStore.state5='no'
			}
			filterStrategyStore.value6=res.data.blackWord;
			if(res.data.blackWord&&res.data.blackWord!=''){
				filterStrategyStore.state6='yes'
			}else{
				filterStrategyStore.state6='no'
			}
			this.props.history.push({pathname:'/newFilterStrategy'})
		})
	}
	newSta(){
		localStorage.removeItem('filterStrategyId')
		this.props.history.push({pathname:'/newFilterStrategy'})
	}
	clearStore(){
		filterStrategyStore.value1 = '';
		filterStrategyStore.value2 = '请选择';
		filterStrategyStore.value3 = '请选择';
		filterStrategyStore.value4 = [];
		filterStrategyStore.value5 = [];
		filterStrategyStore.text5 = [];
		filterStrategyStore.state5 = 'no';
		filterStrategyStore.state6 = 'no';
		filterStrategyStore.value6 = '';
	}
	callState(i){
		if(i.app){
			if(i.dsp.dspState=='OPEN'&&i.app.state=='OPEN'){
				return true;
			}else{
				return false;
			}
		}else if(i.appGroup){
			if(i.dsp.dspState=='OPEN'&&i.appGroup.state=='OPEN'){
				return true;
			}else{
				return false;
			}
		}else{
			return false;
		}
	}
	render() {
		let {strategyArr,total}=filterStrategyStore;
		return (
			<div>
				<Layout history={this.props.history}/>
				<div className="content">
					<div className="contentBulk1">
						<div className="con-head">
							<div>
								<button className="borderBtn" onClick={()=>{this.newSta()}}>新建过滤策略</button>
								<button className="borderBtn" onClick={()=>this.removeItem()}>删除</button>
							</div>
							<div className="searchInput">
								<input type="text"
									   placeholder="请输入查询的名称和关键字"
									   onChange={(e)=>this.onInputChange(e)}
									   value={this.state.name}
									   className='searchInputText'/>
								<div className='searchInputButton' onClick={()=>this.searchApp()}></div>
							</div>
						</div>
						<div className="table-head">
							<div  style={{width:'4%',float:'left',textAlign:'center'}}>
								<Checkbox onChange={this.onAllChange.bind(this)} checked={this.state.chooseIdArr.length==strategyArr.length}/>
							</div>
							{headArr.map((i,k)=>(
								<div key={k} style={{width:i.w,float:'left',textAlign:'center'}}>
									{i.name}
								</div>
							))}
						</div>
						{strategyArr.map((i,k)=>(
							<div className="table-body" key={k} style={{background:k%2==0?'#fff':'#fafafa'}}>
								<div  style={{width:'4%'}} className='gezi'>
									<Checkbox onChange={()=>this.onOneChange(i.id)} checked={this.state.chooseIdArr.indexOf(i.id)>-1}/>
								</div>
								<div  style={{width:headArr[0].w}} title={i.name} className='gezi'>{/*过滤策略名称*/}
									{i.name}
								</div>
								<div  style={{width:headArr[1].w}} className='gezi'>{/*适用DSP平台*/}
									{i.dsp.name}
								</div>
								<div  style={{width:headArr[1].w}} className='gezi'>{/*适用媒体*/}
									{i.app?i.app.appName:(i.appGroup?i.appGroup.name:null)}
								</div>
								<div  style={{width:headArr[1].w}} title={Client.adTypeArrEffect(i.spaceTypes)} className='gezi'>{/*适用广告类型*/}
									{Client.adTypeArrEffect(i.spaceTypes)}
								</div>
								<div  style={{width:headArr[1].w}} title={i.blackCategory} className='gezi'>{/*过滤广告主行业*/}
									{i.blackCategory}
								</div>
								<div  style={{width:headArr[1].w}} title={i.blackWord} className='gezi'>{/*过滤关键词*/}
									{i.blackWord}
								</div>
								<div  style={{width:headArr[1].w}} className='gezi'>{/*策略创建时间*/}
									{Client.formatDateTime(i.createTime)}
								</div>
								<div  style={{width:headArr[0].w}} className='gezi'>{/*适用媒体*/}
									<span className={this.callState(i)?"modification":'noClick'} onClick={()=>this.callState(i)?this.edit(i.id):null}>
										编辑
									</span>
								</div>
							</div>
						))}
						<div className='con-head'>
							<Pagination
								pageSizeOptions={['10','20','50','100']}
								showSizeChanger
								defaultPageSize={this.state.size}
								current={this.state.page}
								defaultCurrent={this.state.page}
								onChange={this.onPageChange.bind(this)}
								onShowSizeChange={this.onShowSizeChange.bind(this)}  total={total} />
						</div>
					</div>
				</div>
			</div>
		)
	}
}
