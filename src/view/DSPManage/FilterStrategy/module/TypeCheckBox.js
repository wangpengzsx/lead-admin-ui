import React from "react";
import {Checkbox} from "antd";
const CheckboxGroup = Checkbox.Group;
const plainOptions = [ {label:'Banner',value:'BANNER'},
	{label:'开屏广告',value:'OPENSCREEN'},
	{label:'插屏广告',value:'POPUP'},
	{label:'原生广告',value:'NATIVE'},
	{label:'视频广告',value:'VIDEO'}];
import {observer} from "mobx-react";
import filterStrategyStore from '../../../../mobx/dspManage/DSPManageStore/filter-strategy-store'
@observer
export default class TypeCheckBox extends React.Component {
	constructor(){
		super()
		this.state={
			value:'',
			indeterminate:false,
			checkAll:false
		}
	}
	onCheckAllChange(e){
		if(e.target.checked){
			filterStrategyStore.value4=['BANNER','OPENSCREEN','POPUP','NATIVE','VIDEO']
			this.setState({
				indeterminate:false,
				checkAll:true
			})
		}else{
			filterStrategyStore.value4=[]
			this.setState({
				indeterminate:false,
				checkAll:false
			})
		}
	}
	onChange(e){
		if(e.length==5){
			this.setState({
				checkAll:true,
				indeterminate:false
			})
		}else if(e.length<5){
			this.setState({
				checkAll:false,
				indeterminate:true
			})
			if(e.length==0){
				this.setState({
					indeterminate:false
				})
			}
		}
		filterStrategyStore.value4=e
	}
	render() {
		let {value4}=filterStrategyStore
		return (
			<div className="accountListRow" style={{height:30}}>
				<div className="form-left">
					<i className="red">*</i>适用广告类型：
				</div>
				<div className="form-right-multiple" style={{display:'block'}}>
					<Checkbox
						indeterminate={value4.length>0&&value4.length<5}
						onChange={(e)=>this.onCheckAllChange(e)}
						checked={value4.length==5}
					>
						全部
					</Checkbox>
					<CheckboxGroup options={plainOptions}
								   value={[...value4]}
								   onChange={(e)=>this.onChange(e)}/>
				</div>
			</div>
		)
	}
}
