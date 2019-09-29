import React from "react";
import Layout from "../../../layout/Layout";
import InputCom from "./moudle/InputCom";
import RadioCom from "./moudle/RadioCom";
import IdCom from "./moudle/IdCom";
import SelectCom from "./moudle/SelectCom";
import RadioInputCom from "./moudle/RadioInputCom";
import DateCom from "./moudle/DateCom";
import AdCom from "./moudle/AdCom";
import {observer} from "mobx-react";
import Client from "../../../common/lead-api";
import dealManageStore from '../../../mobx/dspManage/dealManage/deal-manage-store';
import moment from 'moment';
@observer
export default class NewDeal extends React.Component {
	constructor(){
		super()
		this.state={
			name:'',
			type:'PD',
			terminal:'APP',
			dsp:'请选择',
			billing:'',
			totalState:'NO',
			totalValue:'',
			dayState:'NO',
			dayValue:'',
			pushValue:'',
			quitRatio:'',
			dateState:'NO',
			startTime:moment().startOf('day'),
			endTime:moment().endOf('day'),
			adState:'NO'
		}
	}
	componentWillMount(){
		if(localStorage.getItem('dealId')){
			Client.getNullArgument('deal/findAllById?id='+localStorage.getItem('dealId')).then(res=>{
				this.setState({
					name:res.dealName,
					type:res.dealType,
					terminal:res.terminal,
					dsp:res.leadDsp.id,
					billing:res.dealPrice,
					totalState:res.totalPv!=''?'YES':'NO',
					totalValue:res.totalPv,
					dayState:res.dayPv!=''?'YES':'NO',
					dayValue:res.dayPv,
					pushValue:res.pushNumber,
					quitRatio:res.returnNumber,
					dateState:res.isCycle==1?'YES':'NO',
					startTime:res.startTime?moment(Client.formatDate(res.startTime)):moment().startOf('day'),
					endTime:res.endTime?moment(Client.formatDate(res.endTime)):moment().endOf('day')
				})
			})
		}else{
			dealManageStore.adState='NO'
		}
	}
	cancel(){
		this.props.history.push({pathname:'/dealManage'})
	}
	submit(){
		let {chooseArr}=dealManageStore;
		let arr=[];
		for(let i=0; i<chooseArr.length;i++){
			for(let j=0;j<chooseArr[i].sub.length;j++){
				if(chooseArr[i].isApp) {
					if(chooseArr[i].sub[j].checked){
						arr.push(
							{
								appId:chooseArr[i].id,
								spaceId:chooseArr[i].sub[j].id
							}
						)
					}
				}else{
					if(chooseArr[i].sub[j].checked){
						arr.push(
							{
								appGroupId:chooseArr[i].id,
								adType:chooseArr[i].sub[j].id
							}
						)
					}
				}
			}
		}
		let {name,
			type,
			terminal,
			dsp,
			billing,
			totalState,
			totalValue,
			dayState,
			dayValue,
			pushValue,
			quitRatio,
			dateState,
			startTime,
			endTime}=this.state;
		let {adState}=dealManageStore
		let obj={
			dealName: name,
			dealType:type,
			terminal: terminal,
			leadDsp:{id:dsp},
			dealPrice: billing,
			totalPv: totalState=='NO'?'':totalValue,
			dayPv: dayState=='NO'?'':dayValue,
			pushNumber: pushValue,
			returnNumber: quitRatio,
			isCycle: dateState=='NO'?0:1,
			startTime: startTime?(dateState=='NO'?'':startTime.format('YYYY-MM-DD')):'',
			endTime:endTime?(dateState=='NO'?'':endTime.format('YYYY-MM-DD')):'' ,
			isSpace:adState=='NO'?0:1,
			leadDealSpaceList:adState=='NO'?[]:arr
		}
		if(localStorage.getItem('dealId')){
			obj.id=localStorage.getItem('dealId')
		}
		if(name!==''&&dsp!='请选择'&&billing!=''){
			if(type=='PDB'){
				if(pushValue!=''&&quitRatio!=''){
					this.jiance(obj);
				}else{
					Client.showTank(false,'请填写必填项');
				}
			}else{
				this.jiance(obj)
			}
		}else{
			Client.showTank(false,'请填写必填项');
		}
	}
	jiance(obj){
		let {totalState,dayState,totalValue,dayValue}=this.state
		if(totalState=='YES'&&dayState=='YES'&&totalValue!=''&&dayValue!=''){
			if(parseInt(totalValue)>parseInt(dayValue)){
				this.tiaozhuan(obj)
			}else{
				Client.showTank(false,'日曝光不能大于总曝光')
			}
		}else{
			this.tiaozhuan(obj)
		}
	}
	tiaozhuan(obj){
		Client.createObject('deal/saveDeal',obj).then(res=>{
			if(res.status==200){
				this.props.history.push({pathname:'/dealManage'})
			}else{
				Client.showTank(false,res.message)
			}
		})
	}
	inputChange(e,key){
		this.setState({[key]:e})
	}
	adChange(e){
		dealManageStore.adState=e
	}
	radioChange(e,key){
		this.setState({[key]:e})
	}
	rangeDateChange(startTime,endTime){
		this.setState({startTime,endTime})
	}
	componentWillUnmount(){
		localStorage.removeItem('dealId')
		dealManageStore.adState='NO'
	}
	render() {
		let {adState}=dealManageStore;
		return (
			<div>
				<Layout history={this.props.history}/>
				<div className="content">
					<div className="list-haed">
						<span className="dah1">
							基础信息
						</span>
						<span className="xiaoh1">
							请填写基础信息，带 <i className="red">*</i> 的为必填项
						</span>
					</div>
					<div className="contentBulk">
						<InputCom label="订单名称" call={(e)=>this.inputChange(e,'name')} value={this.state.name}/>
						<RadioCom label="订单类型" call={(e)=>this.radioChange(e,'type')} arr={['PD','PDB']} value={this.state.type} disabled={localStorage.getItem('dealId')?true:false}/>
						{localStorage.getItem('dealId')?<IdCom label="订单ID" id={localStorage.getItem('dealId')}/>:null}
						<RadioCom label="投放媒体终端" call={(e)=>this.radioChange(e,'terminal')} arr={['APP','PC']} value={this.state.terminal}/>
						<SelectCom label="投放DSP平台" call={(e)=>this.radioChange(e,'dsp')} value={this.state.dsp}/>
						<InputCom label="计费单位" call={(e)=>this.inputChange(e,'billing')} value={this.state.billing} unit="元/CPM"/>
						<RadioInputCom
							label="总曝光上限"
							call={(e)=>this.inputChange(e,'totalState')}
							value={this.state.totalState}
							input_call={(e)=>this.inputChange(e,'totalValue')}
							input_value={this.state.totalValue}
						/>
						<RadioInputCom
							label="日曝光上限"
							call={(e)=>this.inputChange(e,'dayState')}
							value={this.state.dayState}
							input_call={(e)=>this.inputChange(e,'dayValue')}
							input_value={this.state.dayValue}
						/>
						<InputCom label="推送量" call={(e)=>this.inputChange(e,'pushValue')} must={this.state.type=='PDB'}
								  value={this.state.pushValue} unit="元/CPM" tips="PDB类型订单该值为必填项"/>
						<InputCom label="退量比例" call={(e)=>this.inputChange(e,'quitRatio')} must={this.state.type=='PDB'}
								  value={this.state.quitRatio} unit="%" tips="PDB类型订单该值为必填项"/>
						<DateCom label="订单有效期" call={(e)=>this.inputChange(e,'dateState')}
								 value={this.state.dateState}
								 startTime={this.state.startTime}
								 endTime={this.state.endTime}
								 date_call={(s,e)=>this.rangeDateChange(s,e)}
						/>
						<AdCom call={(e)=>this.adChange(e)} value={adState}/>
					</div>
					<div className="submit-content">
						<button className="cancelBtn" onClick={()=>this.cancel()}>取消</button>
						<button className="confirmBtn" onClick={()=>this.submit()}>确定</button>
					</div>
				</div>
			</div>
		)
	}
}
