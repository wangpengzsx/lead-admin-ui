import React ,{Component}from "react";
import AdFormManageStroe from "../../../mobx/mediaManage/adForm/adForm-manage-store";
import {observer} from "mobx-react";
import {Link} from "react-router-dom";
import Layout from "../../../layout/Layout";
@observer
export default class NewForm extends Component {
	constructor(props){
		super(props);
		this.state={
			adSpaceId:this.props.location.adSpaceId,
			adSpaceType:this.props.location.adSpaceType,
			adFormId:'',
			height:'',
			width:'',
			creativeFormat:'',
			creativeSize:'',
			formTitleLen:'',
			formContentLen:'',
			videoLength:'',
			logoId:'',
			logoDep:'',
			nativeDiv:'none',
			nativeDivLogo:'none'
		};
	}
	//页面加载时访问的方法
	componentWillMount(){
		AdFormManageStroe.adFormArrById.fields=[];
		//获取形式列表
		AdFormManageStroe.getFormByAdType(this.state.adSpaceType,this.state.adSpaceId,"");
	}
	adFormChange(e){
		//调取contort层的  通过id 获取详情
		AdFormManageStroe.getFormById(e.target.value);
		this.setState({adFormId: e.target.value});
	}
	confirm(){
		AdFormManageStroe.relationForm({adSpace:"/leadAdSpaces/"+this.state.adSpaceId,adForm:"/leadAdForms/"+this.state.adFormId,spaceFormState:0},
			this.callback.bind(this));
	}
	callback(id){
		this.props.history.push({
			pathname:'/formManage',
			adSpaceId:this.state.adSpaceId,
			adSpaceType:this.state.adSpaceType
		});
	}
	render() {
		let {adFormArrByAdType}=AdFormManageStroe;
		let {adFormArrById} = AdFormManageStroe;
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
						<div>
							<div style={{width:'100%',height:30,marginBottom:10}}>
								<div className="form-left">
									<span style={{color:'red'}}>*</span> &nbsp;&nbsp;广告展现形式:
								</div>
								<div className="form-right" >
									<select name="spaceId" className="border1" onChange={this.adFormChange.bind(this)}>
										<option value="-1">请选择广告模板</option>
										{adFormArrByAdType.map((i,k)=>(
											<option key={i.id} value={i.id}>
												{i.adFormName}
											</option>
										))}
									</select>
								</div>
							</div>
							<div style={{width:'100%',height:30,marginBottom:10}}>
								<div className="form-left">
									<i className="red">*</i>&nbsp; 素材规格:
								</div>
								<div className="form-right">
									{adFormArrById.creativeFormat}
								</div>
							</div>
							<div style={{width:'100%',height:30,marginBottom:10}}>
								<div className="form-left">
									<i className="red">*</i>&nbsp; 素材大小:
								</div>
								<div className="form-right">
									{adFormArrById.creativeSize}KB
								</div>
							</div>
							{adFormArrById.fields?
								adFormArrById.fields.map((j,h)=>(
										<div style={{width:'100%',height:30,marginBottom:10}}>
											<div className="form-left">
												<i className="red">*</i>&nbsp; {j.displayName}
											</div>
											<div className="form-right">
													{j.constraints.map((n,m)=>(
														<i>
															{n.desc},
														</i>
													)
												)}
											</div>
										</div>
									)
								):null
							}
							<div className="submit-content">
								<Link to={{pathname:'/formManage'}}>
									<button className="cancelBtn">取消</button>
								</Link>
								<button className="confirmBtn" onClick={this.confirm.bind(this)}>
									确定
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
}
