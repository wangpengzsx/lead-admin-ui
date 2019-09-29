import React from "react";
import {Switch,Checkbox} from 'antd';
import {Link} from "react-router-dom";
import AdFormManageStroe from "../../../mobx/mediaManage/adForm/adForm-manage-store";
import {observer} from "mobx-react";
import Layout from "../../../layout/Layout";
const headArr=[
	{name:'形式名称',w:'15%'},
	{name:'状态',w:'20%'},
	{name:'素材大小',w:'20%'},
	{name:'素材规格',w:'20%'},
	{name:'操作',w:'20%'}];
@observer
export default class FormManage extends React.Component {
	constructor(props){
		super(props)
		this.state={
			adSpaceId:this.props.location.adSpaceId,
			adSpaceType:this.props.location.adSpaceType,
			size:10,
			page:1,
			chooseIdArr:[],
			typeObj:{}
		};
	}
	componentWillMount(){
		AdFormManageStroe.getFormListBySpaceId(this.state.adSpaceId);
	}
	callback(){
		AdFormManageStroe.getFormListBySpaceId(this.state.adSpaceId);
	}
	//批量删除
	removeItem(spaceState){
		this.state.chooseIdArr.map(i=>AdFormManageStroe.editSpaceForm(i,spaceState,i,this.state.adSpaceId,this.callback.bind(this)))
		setTimeout(()=>{
			AdFormManageStroe.getFormListBySpaceId(this.state.adSpaceId);
		},300);
	}
	// 开启关闭
	onSwitchChange(state,id){
		let a=state=="OPEN"?1:0;
		AdFormManageStroe.editSpaceForm(id,a,id,this.state.adSpaceId,this.callback.bind(this));
	}
	//批量开启或关闭
	updateStateByIds(spaceState){
		this.state.chooseIdArr.map(i=>AdFormManageStroe.editSpaceForm(i,spaceState,i,this.state.adSpaceId,this.callback.bind(this)))
		setTimeout(()=>{
			AdFormManageStroe.getFormListBySpaceId(this.state.adSpaceId);
		},300);
	}
	//列表前CheckBox   change事件
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
	onAllChange(e){
		if(e.target.checked){
			let {adFormArrBySpaceId}=AdFormManageStroe;
			let arr=[];
			adFormArrBySpaceId.map(i=>arr.push(i.id));
			this.setState({
				chooseIdArr:arr
			});
		}else{
			this.setState({
				chooseIdArr:[]
			});
		}
	}
	render() {
		let {adFormArrBySpaceId}=AdFormManageStroe;
		return (
			<div>
				<Layout history={this.props.history} />
				<div className="content">
					<div className="contentBulk1">
						<div className="con-head">
							<div>
								<Link to={{
									adSpaceId:this.state.adSpaceId,
									pathname:'/newForm',
									adSpaceType: this.state.adSpaceType
								}}>
									<button className="borderBtn">
										创建广告展现形式
									</button>
								</Link>
								<button className="borderBtn" onClick={()=>this.removeItem(2)}>删除</button>
								<button className="borderBtn" onClick={()=>this.updateStateByIds(0)}>开启</button>
								<button className="borderBtn" onClick={()=>this.updateStateByIds(1)}>关闭</button>
							</div>
						</div>
						<div className="table-head">
							<div  style={{width:'5%',float:'left',textAlign:'center'}}>
								<Checkbox onChange={this.onAllChange.bind(this)} checked={this.state.chooseIdArr.length==adFormArrBySpaceId.length}/>
							</div>
							{
								headArr.map((i,k)=>(
									<div key={k} style={{width:i.w,float:'left',textAlign:'center'}}>
										{i.name}
									</div>
								))
							}
						</div>
						{adFormArrBySpaceId.map((i,k)=>(
							<div className="table-body" key={k} style={{background:k%2==0?'#fafafa':'#fff'}}>
								<div  style={{width:'5%'}} className='gezi'>
									<Checkbox onChange={this.onChange.bind(this,i.id)} checked={this.state.chooseIdArr.indexOf(i.id)>-1}/>
								</div>
								<div  style={{width:'15%'}} title={i.adFormName} className='gezi'>
									{i.adFormName}
								</div>
								<div  style={{width:'20%'}} className='gezi'>
									<Switch  checked={i.spaceFormState=="OPEN"}  checkedChildren="开" unCheckedChildren="关"
											 onChange={()=>this.onSwitchChange(i.spaceFormState,i.id)}
									/>
								</div>
								<div  style={{width:'20%'}} title={i.creativeSize} className='gezi'>
									{i.creativeSize}
								</div>
								<div  style={{width:'20%'}} title={i.creativeFormat} className='gezi'>
									{i.creativeFormat}
								</div>
								<div  style={{width:'20%'}} className='gezi'>
									<Link to={{
										pathname: '/editForm',
										adSpaceId:this.state.adSpaceId,
										adSpaceType:i.adType,
										adFormId:i.id,
										spaceFormState:i.spaceFormState
									}}>编辑</Link>
								</div>
							</div>
						))}
						<div className='con-head'>
						</div>
					</div>
				</div>
			</div>
		)
	}
}
