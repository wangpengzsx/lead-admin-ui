import React from "react";
import {observer} from "mobx-react";
import addPutInStrategyStore from "../../../../mobx/renderSet/PutInStrategyManage/add-putin-strategy-store"
import putInStrategyStore from "../../../../mobx/renderSet/PutInStrategyManage/putIn-strategy-store"
import {Checkbox} from "antd";
@observer
export default class Strategy4 extends React.Component {
	constructor(){
		super()
		this.state={
			choiceArr:[]
		}
	}
	onChange(e){
		let arr=addPutInStrategyStore.value4;
		if(e.target.checked){
			arr.push(e.target.value)
		}else{
			let index=arr.indexOf(e.target.value)
			arr.splice(index,1)
		}
		addPutInStrategyStore.value4=arr
	}
	render() {
		let {value4}=addPutInStrategyStore;
		let {disableArr}=putInStrategyStore;
		return (
			<div className="accountListRow" style={{height:30}}>
				<div className="form-left">
					<i className="red">*</i>广告平台类型：
				</div>
				<div className="form-right-multiple" style={{display: 'inherit'}}>
					<Checkbox
						checked={value4.indexOf('BANNER')>-1}
						disabled={disableArr.indexOf('BANNER')>-1}
						value="BANNER"
						onChange={(e)=>this.onChange(e)}>
						Banner
					</Checkbox>
					<Checkbox
						checked={value4.indexOf('OPENSCREEN')>-1}
						disabled={disableArr.indexOf('OPENSCREEN')>-1}
						value="OPENSCREEN"
						onChange={(e)=>this.onChange(e)}>
						开屏广告
					</Checkbox>
					<Checkbox
						checked={value4.indexOf('POPUP')>-1}
						disabled={disableArr.indexOf('POPUP')>-1}
						value="POPUP"
						onChange={(e)=>this.onChange(e)}>
						插屏广告
					</Checkbox>
					<Checkbox
						checked={value4.indexOf('NATIVE')>-1}
						disabled={disableArr.indexOf('NATIVE')>-1}
						value="NATIVE"
						onChange={(e)=>this.onChange(e)}>
						原生广告
					</Checkbox>
					<Checkbox
						checked={value4.indexOf('VIDEO')>-1}
						disabled={disableArr.indexOf('VIDEO')>-1}
						value="VIDEO"
						onChange={(e)=>this.onChange(e)}>
						视频广告
					</Checkbox>
				</div>
			</div>
		)
	}
}
