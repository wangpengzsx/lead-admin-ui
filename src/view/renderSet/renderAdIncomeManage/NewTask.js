import React from "react";
import Layout from "../../../layout/Layout";
import LabelSelect from "./components/LabelSelect";
import LabelInput from "./components/LabelInput";
import LabelPicker from "./components/LabelPicker";
import Client from "../../../common/lead-api";
import putInStrategyStore from "../../../mobx/renderSet/PutInStrategyManage/putIn-strategy-store";
import {observer} from "mobx-react";
import moment from 'moment';
@observer
export default class NewTask extends React.Component {
	constructor(props){
		super(props)
		this.state={
			inputValue:this.props.location.id?this.props.location.name:'',
			adValue:this.props.location.id?this.props.location.dspId:'请选择',
			filename:'未选择任何文件',
			fileUrl:null,
			month:moment()
		}
	}
	componentWillMount(){
		if(this.props.location.id){
			Client.getNullArgument('strategy/findTaskById?taskId='+this.props.location.id).then(res=>{
				this.setState({
					month:moment(res.taskCycle.slice(0,4)+'-'+res.taskCycle.slice(4)),
					inputValue:res.name,
					adValue:res.leadFallbackDsp.id,
					filename:res.fileName==null?'未选择任何文件':res.fileName,
					fileUrl:res.fileUrl
				})
			})
		}
		putInStrategyStore.getFallbackArr()
	}
	selectCallback(e,c){
		this.setState({[e]:c})
	}
	inputCallback(e,c){
		this.setState({[e]:c})
	}
	onFileChange(e){
		if(e.target.files[0]) {
			this.setState({
				filename: e.target.files[0].name
			})
		}
	}
	submit(){
		let {adValue,inputValue,filename,month}=this.state;
		if(adValue=='请选择'){
			Client.showTank(false,'请选择广告平台')
		}else if(inputValue==''){
			Client.showTank(false,'请填写名称')
		}else if(filename=='未选择任何文件'){
			Client.showTank(false,'请选择上传文件')
		}else{
			let file=$(this.refs["filename"])[0].files[0];
			let fd =new FormData();
			fd.append('incomes',file);
			Client.createObject('strategy/saveOrUpdateTask',{
				leadFallbackDsp:{id:adValue},
				id: this.props.location.id?this.props.location.id:'',
				state: 0,
				name: inputValue,
				taskCycle:Client.formatMonth(month),
				fileName:this.props.location.id?this.state.filename:$(this.refs["filename"])[0].files[0].name
			}).then(res=>{
				if(res.status==500){
					alert(res.message)
				}else{
					this.callback(res.data.id)
				}
			})
		}
	}
	callback(id){
		let file=$(this.refs["filename"])[0].files[0];
		let fd =new FormData();
		fd.append('incomes',file);
		if(file){
			Client.uploder('strategy/updateExcel?id='+id,fd).then(res=>{
				this.props.history.push({pathname:'/renderAdIncomeManage'})
			})
		}else{
			this.props.history.push({pathname:'/renderAdIncomeManage'})
		}
	}
	pickerCall(e){
		this.setState({
			month:e
		})
	}
	render() {
		let {fallArr}=putInStrategyStore
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
						<LabelInput placeholder="请填写任务名称" value={this.state.inputValue} call={(e)=>this.inputCallback('inputValue',e)} label="任务名称"/>
						<LabelSelect typeArr={fallArr} value={this.state.adValue} call={this.selectCallback.bind(this,'adValue')} label="广告平台名称"/>
						<LabelPicker call={(e)=>this.pickerCall(e)} value={this.state.month}/>
						<div className="accountListRow">
							<div className="form-left">
								<i className="red">*</i>&nbsp; 上传文件：
							</div>
							<div className="form-right">
								<input className="fileButton" type="file" title=""
									   style={{width:58,height:30}} ref="filename"
									   accept=".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
									   onChange={(e)=>this.onFileChange(e)} />
								<button>
									选择文件
								</button>
								<div style={{paddingLeft:10,height:30,lineHeight:'30px',display:'inline-block'}}>{this.state.filename}</div>
								<a href={Client.base+"/sample/task.xlsx"}>模板下载</a>
							</div>
						</div>
					</div>
					<div className="submit-content">
						<button className="cancelBtn" onClick={()=>this.props.history.push({pathname: '/renderAdIncomeManage'})}>取消</button>
						<button className="confirmBtn" onClick={()=>this.submit()}>确定</button>
					</div>
				</div>
			</div>
		)
	}
}
