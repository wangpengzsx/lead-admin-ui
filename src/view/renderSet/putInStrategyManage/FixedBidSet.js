import React from "react";
import Layout from "../../../layout/Layout";
import Client from "../../../common/lead-api";
import flowSetStore from "../../../mobx/renderSet/PutInStrategyManage/flow-set-store";
export default class FixedBidSet extends React.Component {
	constructor(props){
		super(props);
		this.state={
			dspName:'',
			strategyName:'',
			mediaName:'',
			appid:'',
			typeList:[],
			res:{}
		}
	}
	componentWillMount(){
		Client.searchType('strategy/findAllById?id='+localStorage.getItem('strategyId1')).then(res=>{
			this.setState({
				dspName:res.leadFallbackDsp.name,
				strategyName:res.name,
				mediaName:res.leadApp?res.leadApp.appName:res.leadAppGroup.name,
				appId:res.leadApp?res.leadApp.id:res.leadAppGroup.id,
				res:res,
				typeList:res.leadStrategyAdtypePrices
			})
		})
	}
	nameChange(e,type){
		let arr=this.state.typeList;
		for(let i=0;i<arr.length;i++){
			if(type==arr[i].adSpaceType){
				arr[i].regularPrice=e.target.value
			}
		}
		this.setState({
			typeList:arr
		})
	}
	confirm(){
		let arr=this.state.typeList
		let arr1=[]
		for(let i=0;i<arr.length;i++){
			arr1.push({regularPrice:arr[i].regularPrice,priceId:arr[i].id})
		}
		flowSetStore.setRegularPrice(arr1,this.callback.bind(this));
	}
	callback(){
		this.props.history.push({pathname:'/putInStrategyManage'})
	}
	componentWillUnmount(){
		localStorage.removeItem('dspTitle');
	}
	render() {
		return (
			<div>
				<Layout history={this.props.history}/>
				<div className="content">
					<div className="list-haed">
						<span className="dah1">
							基础信息
						</span>
					</div>
					<div className="contentBulk" style={{padding:'10px'}}>
						<div className="accountListRow" >
							<div className="form-left" style={{width:'30%'}}>
								广告投放平台名称：
							</div>
							<div className="form-right-multiple" style={{width:'68%'}} >
								{this.state.dspName}
							</div>
						</div>
						<div className="accountListRow" >
							<div className="form-left" style={{width:'30%'}}>
								打底广告投放策略名称：
							</div>
							<div className="form-right-multiple" style={{width:'68%'}} >
								{this.state.strategyName}
							</div>
						</div>
						<div className="accountListRow" >
							<div className="form-left" style={{width:'30%'}}>
								媒体名称：
							</div>
							<div className="form-right-multiple" style={{width:'68%'}} >
								{this.state.mediaName}
							</div>
						</div>
						<div className="accountListRow" >
							<div className="form-left" style={{width:'30%'}}>
								appId:
							</div>
							<div className="form-right-multiple" style={{width:'68%'}} >
								{this.state.appId}
							</div>
						</div>
						{this.state.typeList.map((i,k)=>(
							<div className="accountListRow" key={k}>
								<div className="form-left" style={{width:'30%'}}>
									{Client.adTypeEffect(i.adSpaceType)}:
								</div>
								<div className="form-right-multiple" style={{width:'68%'}} >
									<input style={{width:360,height:30}}
										   value={i.regularPrice}
										   className='border1'
										   onChange={e=>this.nameChange(e,i.adSpaceType)}/>
									<i className='color1'>元/CPM</i>
								</div>
							</div>))}
					</div>
					<div className="submit-content">
						<button className="cancelBtn" onClick={()=>this.props.history.push({pathname:'/putInStrategyManage'})}>取消</button>
						<button className="confirmBtn" onClick={this.confirm.bind(this)}>
							确定
						</button>
					</div>
				</div>
			</div>
		)
	}
}
