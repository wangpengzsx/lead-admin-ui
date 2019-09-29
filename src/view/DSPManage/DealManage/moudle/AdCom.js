import React from "react";
import {Radio} from "antd";
import {Checkbox,Icon} from 'antd';
import dealManageStore from '../../../../mobx/dspManage/dealManage/deal-manage-store';
import {observer} from "mobx-react";
@observer
export default class AdCom extends React.Component {
	constructor(){
		super()
		this.state={
			value:''
		}
	}
	componentWillMount(){
		dealManageStore.getChoiceSpace()
	}
	onChange(e){
		this.props.call(e.target.value)
	}
	AddChecked(k){
		let arr=dealManageStore.chooseArr;
		arr[k].checked=!arr[k].checked
		for(let i=0; i<arr[k].sub.length; i++){
			arr[k].sub[i].checked=arr[k].checked
		}
		dealManageStore.chooseArr=arr;
	}
	removeChecked(k){
		let arr=dealManageStore.chooseArr;
		arr[k].checked=false
		for(let i=0; i<arr[k].sub.length; i++){
			arr[k].sub[i].checked=false
		}
		dealManageStore.chooseArr=arr;
	}
	AddCheckedSub(k,b){
		let arr=dealManageStore.chooseArr;
		arr[k].sub[b].checked=!arr[k].sub[b].checked;
		for(let i=0; i<arr[k].sub.length; i++){
			if(arr[k].sub[i].checked==true){
				arr[k].checked=true;
				break;
			}
		}
		dealManageStore.chooseArr=arr;
	}
	removeCheckedSub(k,b){
		let arr=dealManageStore.chooseArr;
		arr[k].sub[b].checked=false;
		dealManageStore.chooseArr=arr;
	}
	toggle(k){
		let arr=dealManageStore.chooseArr;
		arr[k].selected=!arr[k].selected;
		dealManageStore.chooseArr=arr;
	}
	allChoose(){
		this.toggleCheckFun(true);
	}
	allRemove(){
		this.toggleCheckFun(false);
	}
	toggleCheckFun(bo){
		let arr=dealManageStore.chooseArr;
		for(let i=0; i<arr.length; i++){
			arr[i].checked=bo;
			for(let j=0; j<arr[i].sub.length;j++){
				arr[i].sub[j].checked=bo;
			}
		}
		dealManageStore.chooseArr=arr;
	}
	render() {
		let {chooseArr}=dealManageStore;
		return (
			<div>
				<div className="accountListRow" style={{height:30}}>
					<div className="form-left">
						<i className="red">*</i> 可用广告位：
					</div>
					<div className="form-right-multiple" style={{display:'block'}}>
						<Radio.Group onChange={(e)=>this.onChange(e)} value={this.props.value}>
							<Radio value="NO" >不限制</Radio>
							<Radio value="YES" >指定广告位</Radio>
						</Radio.Group>
					</div>
				</div>
				{this.props.value=='YES'?<div style={{height:450}}>
					<div style={{width:'5%',height:450,float:'left'}}>
					</div>
					<div style={{width:'40%',height:450,float:'left'}}>
						<div className="allChoose">
							<button className="typeBtn"
									onClick={()=>this.allChoose()}>全选</button>
						</div>
						<div className="chooseDrection">
							<span>
								权限名称
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
											{i.sub.length!=0?(i.selected?
												(<Icon type="down" theme="outlined" style={{marginRight:10}}/>):
												(<Icon type="right" theme="outlined" style={{marginRight:10}}/>)):null}
											{i.name}
										</div>
										<Checkbox onChange={this.AddChecked.bind(this,k)} checked={i.checked}/>
									</div>
									{i.selected?i.sub.map((a,b)=>(
										<div className="chooseItem1" key={b} style={{backgroundColor:a.checked?'#f4f4f4':'#fff'}}>
											<div>
												{a.name}
											</div>
											<Checkbox onChange={this.AddCheckedSub.bind(this,k,b)} checked={a.checked}/>
										</div>
									)):null}
								</div>
							))}
						</div>
					</div>
					<div style={{width:'10%',height:450,float:'left',display:'flex',alignItems:'center',justifyContent:'center'}}>
						<img src={require('../../../../image/zhuanhuan.png')} alt=""/>
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
												{i.sub.length!=0?(i.selected?
													(<Icon type="down" theme="outlined" style={{marginRight:10}}/>):
													(<Icon type="right" theme="outlined" style={{marginRight:10}}/>)):null}
												{i.name}
											</div>
											<div>
												<Icon type="close-circle" onClick={()=>this.removeChecked(k)}/>
											</div>
										</div>
									):null}
									{i.selected?i.sub.map((a,b)=>(
										a.checked?
											<div className="chooseItem1" key={b} style={{backgroundColor:'#f4f4f4'}}>
												<div>
													{a.name}
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
				</div>:null}
			</div>
		)
	}
}
