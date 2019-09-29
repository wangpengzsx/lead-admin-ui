import React from "react";
import Layout from "../../../layout/Layout";
import {Select} from "antd";
const { Option } = Select;
import {observer} from "mobx-react";
import adPutInManageStore from '../../../mobx/generalizeSupport/AdPutInManage/ad-put-in-manage-store'
import Client from "../../../common/lead-api";
@observer
export default class NewDsp extends React.Component {
	constructor(){
		super()
		this.state={
			name:'',
			oneName:undefined,
			twoName:undefined
		}
	}
	componentWillMount(){
		adPutInManageStore.topOneList();
		if(localStorage.getItem('AdvertiserId')){
			Client.getNullArgument('adv/getAdvInfo?id='+localStorage.getItem('AdvertiserId')).then(res=>{
				this.setState({
					name:res.name,
					twoName:res.industryType.id,
					oneName:res.industryType.parent.id
				})
				adPutInManageStore.topTwoList(res.industryType.parent.id);
			})
		}else{
			adPutInManageStore.topTwoList('');
		}
	}
	nameChange(e){
		this.setState({name:e.target.value});
	}
	onOneChange(e){
		adPutInManageStore.topTwoList(e);
		this.setState({
			oneName:e
		})
	}
	onTwoChange(e){
		this.setState({
			twoName:e
		})
	}
	submit(){
		let {name,oneName,twoName} = this.state;
		if(name!=''&&oneName!=undefined&&twoName!=undefined){
			let obj={
				industryType:{id:this.state.twoName},
				advState:0,
				name:this.state.name
			}
			if(localStorage.getItem('AdvertiserId')){
				obj.id=localStorage.getItem('AdvertiserId');
			}
			Client.createObject('adv/saveAdv',obj).then(res=>{
				if(res.status==200){
					this.props.history.push({pathname:'/adPutInManage'})
				}else{
					Client.showTank(false,res.message)
				}
			})
		}else{
			Client.showTank(false,'请填写必填项')
		}
	}
	componentWillUnmount(){
		localStorage.removeItem('AdvertiserId')
	}
	render() {
		let {oneList,twoList}=adPutInManageStore
		return (
			<div>
				<Layout history={this.props.history}/>
				<div className="content">
					<div className="list-haed">
						<span className="dah1">
							基础信息
						</span>
					</div>
					<div className="contentBulk">
						<div className="accountListRow">
							<div className="form-left">
								<i className="red">*</i>&nbsp; 广告主名称:
							</div>
							<div className="form-right">
								<input style={{width:360,height:30}}
									   type="text" className='border1'
									   placeholder="请填写名称"
									   value={this.state.name}
									   onChange={e=>this.nameChange(e)}/>
							</div>
						</div>
						{localStorage.getItem('AdvertiserId')?<div className="accountListRow">
							<div className="form-left">
								广告主id:
							</div>
							<div className="form-right">
								{localStorage.getItem('AdvertiserId')}
							</div>
						</div>:null}
						<div className="accountListRow">
							<div className="form-left">
								<i className="red">*</i>&nbsp; 广告主行业分类:
							</div>
							<div className="form-right">
								<Select style={{ width: 120,marginRight:10 }}
										placeholder="请选择"
										value={this.state.oneName}
										onChange={(e)=>this.onOneChange(e)}>
									{oneList.map((i,k)=>(
										<Option value={i.id} key={k}>{i.name}</Option>
									))}
								</Select>
								<Select  style={{ width: 120 }}
										 placeholder="请选择"
										 value={this.state.twoName}
										 onChange={(e)=>this.onTwoChange(e)}>
									{twoList.map((i,k)=>(
										<Option value={i.id} key={k}>{i.name}</Option>
									))}
								</Select>
							</div>
						</div>
					</div>
					<div className="submit-content">
						<button className="cancelBtn" onClick={()=>this.props.history.push({pathname:'/adPutInManage'})}>取消</button>
						<button className="confirmBtn" onClick={()=>this.submit()}>确定</button>
					</div>
				</div>
			</div>
		)
	}
}
