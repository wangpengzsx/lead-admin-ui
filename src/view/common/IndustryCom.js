import React from "react";
import {Checkbox,Icon} from 'antd';
import {observer} from "mobx-react";
import filterStrategyStore from '../../mobx/dspManage/DSPManageStore/filter-strategy-store'
import Layout from "../../layout/Layout";
@observer
export default class IndustryCom extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			chooseArr: [],
			accountName:'',
			remark:'',
			page:1,
			pageSize:10,
			nameError:false,
			isConfirm:false
		};
	}
	componentWillMount() {
		filterStrategyStore.getIndustry()
		setTimeout(()=>{
			this.setState({
				chooseArr:filterStrategyStore.industryArr
			})
		},300)
	}
	AddChecked(k){
		let arr=this.state.chooseArr;
		arr[k].checked=!arr[k].checked
		for(let i=0; i<arr[k].secondary.length; i++){
			arr[k].secondary[i].checked=arr[k].checked
		}
		this.setState({
			chooseArr:arr
		})
	}
	removeChecked(k){
		let arr=this.state.chooseArr;
		arr[k].checked=false
		for(let i=0; i<arr[k].secondary.length; i++){
			arr[k].secondary[i].checked=false
		}
		this.setState({
			chooseArr:arr
		})
	}
	AddCheckedSub(k,b){
		let arr=this.state.chooseArr;
		arr[k].secondary[b].checked=!arr[k].secondary[b].checked;
		for(let i=0; i<arr[k].secondary.length; i++){
			if(arr[k].secondary[i].checked==true){
				arr[k].checked=true;
				break;
			}
		}
		this.setState({
			chooseArr:arr
		})
	}
	removeCheckedSub(k,b){
		let arr=this.state.chooseArr;
		arr[k].secondary[b].checked=false;
		this.setState({
			chooseArr:arr
		})
	}
	toggle(k){
		let arr=this.state.chooseArr;
		arr[k].selected=!arr[k].selected;
		this.setState({
			chooseArr:arr
		})
	}
	confirm(){
		let value=[],text=[]
		let arr=this.state.chooseArr;
		for(let i=0; i<arr.length;i++){
			if(arr[i].checked){
				value.push(arr[i].id);
				text.push(arr[i].desc);
			}
			for(let j=0; j<arr[i].secondary.length;j++){
				if(arr[i].secondary[j].checked){
					value.push(arr[i].secondary[j].id);
					text.push(arr[i].secondary[j].desc);
				}
			}
		}
		filterStrategyStore.value5=value;
		filterStrategyStore.text5=text
		this.props.history.push('/newFilterStrategy')
	}
	allChoose(){
		this.toggleCheckFun(true);
	}
	allRemove(){
		this.toggleCheckFun(false);
	}
	toggleCheckFun(bo){
		let arr=this.state.chooseArr;
		for(let i=0; i<arr.length; i++){
			arr[i].checked=bo;
			for(let j=0; j<arr[i].secondary.length;j++){
				arr[i].secondary[j].checked=bo;
			}
		}
		this.setState({
			chooseArr:arr
		})
	}
	isName(name){
		name==''?this.setState({nameError:true}): this.setState({nameError:false})
	}
	render() {
		let {chooseArr}=this.state;
		return (
			<div ref='win'>
				<Layout history={this.props.history}/>
				<div className="content">
					<div className="list-haed">
						<span className="dah1">
							行业分配
						</span>
						<span className="xiaoh1">
							请为策略至少分配一个行业
						</span>
					</div>
					<div className="contentBulk">
						<div style={{height:450}}>
							<div style={{width:'5%',height:450,float:'left'}}>
							</div>
							<div style={{width:'40%',height:450,float:'left'}}>
								<div className="allChoose">
									<button className="typeBtn"
											onClick={()=>this.allChoose()}>全选</button>
								</div>
								<div className="chooseDrection">
									<span>
										行业名称
									</span>
									<span>
										选择
									</span>
								</div>
								<div className="chooseContent">
									{chooseArr.map((i,k)=>(
										<div key={k} style={{marginBottom:10}}>
											<div className="chooseItem" style={{backgroundColor:i.checked?'#f4f4f4':'#fff'}}>
												<div onClick={()=>this.toggle(k)}>
													{i.secondary.length!=0?(i.selected?
														(<Icon type="down" theme="outlined" style={{marginRight:10}}/>):
														(<Icon type="right" theme="outlined" style={{marginRight:10}}/>)):null}
													{i.desc}
												</div>
												<Checkbox onChange={this.AddChecked.bind(this,k)} checked={i.checked}/>
											</div>
											{i.selected?i.secondary.map((a,b)=>(
												<div className="chooseItem1" key={b} style={{backgroundColor:a.checked?'#f4f4f4':'#fff'}}>
													<div>
														{a.desc}
													</div>
													<Checkbox onChange={this.AddCheckedSub.bind(this,k,b)} checked={a.checked}/>
												</div>
											)):null}
										</div>
									))}
								</div>
							</div>
							<div style={{width:'10%',height:450,float:'left',display:'flex',alignItems:'center',justifyContent:'center'}}>
								<img src={require('../../image/zhuanhuan.png')} alt=""/>
							</div>
							<div style={{width:'40%',height:450,float:'left'}}>
								<div className="allChoose">
									<button className="typeBtn" onClick={()=>this.allRemove()}>清空</button>
								</div>
								<div className="chooseDrection">
									<span>
										权限名称
									</span>
									<span>
										清除
									</span>
								</div>
								<div className="chooseContent">
									{chooseArr.map((i,k)=>(
										<div key={k} style={{marginBottom:10}}>
											{i.checked?(
												<div className="chooseItem" style={{backgroundColor:'#f4f4f4'}}>
													<div onClick={()=>this.toggle(k)}>
														{i.secondary.length!=0?(i.selected?
															(<Icon type="down" theme="outlined" style={{marginRight:10}}/>):
															(<Icon type="right" theme="outlined" style={{marginRight:10}}/>)):null}
														{i.desc}
													</div>
													<div>
														<Icon type="close-circle" onClick={()=>this.removeChecked(k)}/>
													</div>
												</div>
											):null}
											{i.selected?i.secondary.map((a,b)=>(
												a.checked?
													<div className="chooseItem1" key={b} style={{backgroundColor:'#f4f4f4'}}>
														<div>
															{a.desc}
														</div>
														<div>
															<Icon type="close-circle" onClick={()=>this.removeCheckedSub(k,b)}/>
														</div>
													</div>:null
											)):null}
										</div>
									))}
								</div>
							</div>
						</div>
					</div>
					<div className="submit-content">
						<button className="cancelBtn" onClick={()=>this.props.history.push('/newFilterStrategy')}>取消</button>
						<button className="confirmBtn" onClick={()=>{this.confirm()}}>确定</button>
					</div>
				</div>
			</div>
		)
	}
}
