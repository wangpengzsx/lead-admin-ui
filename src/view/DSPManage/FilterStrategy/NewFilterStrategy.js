import React from "react";
import Layout from "../../../layout/Layout";
import {observer} from "mobx-react";
import StrategyName from './module/StrategyName'
import DspSelect from './module/DspSelect'
import MediaSelect from './module/MediaSelect'
import TypeCheckBox from './module/TypeCheckBox'
import IndustrySet from './module/IndustrySet'
import KeywordSet from './module/KeywordSet'
import filterStrategyStore from '../../../mobx/dspManage/DSPManageStore/filter-strategy-store'
import generalizeManageStore from '../../../mobx/generalizeSupport/generalize-manage-store'
import Client from "../../../common/lead-api"
@observer
export default class NewFilterStrategy extends React.Component {
	componentWillMount(){
		filterStrategyStore.getLeadDsps()
		generalizeManageStore.getAppArr()
	}
	confirm(){
		let {value1,value2,value3,value4,text5,value6}=filterStrategyStore
		if(value1!=''&&value2!='请选择'&&value3!='请选择'&&value4.length!=0){
			let obj={}
			if(value3.slice(0,1)=='@'){
				obj={
					name:value1,
					dsp:{id:parseInt(value2)},
					app:{id:value3.slice(1)},
					spaceTypes:Client.arrStr(value4),
					blackCategory:Client.arrStr(text5),
					blackWord:value6
				}
			}else{
				obj={
					name:value1,
					dsp:{id:parseInt(value2)},
					appGroup:{id:value3.slice(1)},
					spaceTypes:Client.arrStr(value4),
					blackCategory:Client.arrStr(text5),
					blackWord:value6
				}
			}
			if(localStorage.getItem('filterStrategyId')){
				obj.id=parseInt(localStorage.getItem('filterStrategyId'));
			}
			Client.createObject('dsp/saveFilter',obj).then(res=>{
				if(res.status=='200'){
					this.props.history.push({pathname:'/filterStrategy'})
					this.clearStore()
				}else{
					Client.showTank(false,res.message)
				}
			})
		}else{
			Client.showTank(false,'请填写必填项');
		}
	}
	clearStore(){
		filterStrategyStore.value1 = '';
		filterStrategyStore.value2 = '请选择';
		filterStrategyStore.value3 = '请选择';
		filterStrategyStore.value4 = [];
		filterStrategyStore.value5 = [];
		filterStrategyStore.text5 = [];
		filterStrategyStore.state5 = 'no';
		filterStrategyStore.state6 = 'no';
		filterStrategyStore.value6 = '';
	}
	cancel(){
		this.props.history.push({pathname:'/filterStrategy'})
		this.clearStore()
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
						<StrategyName/>
						<DspSelect/>
						<MediaSelect/>
						<TypeCheckBox/>
						<IndustrySet history={this.props.history}/>
						<KeywordSet/>
					</div>
					<div className="submit-content">
						<button className="cancelBtn" onClick={()=>this.cancel()}>取消</button>
						<button className="confirmBtn" onClick={this.confirm.bind(this)}>
							确定
						</button>
					</div>
				</div>
			</div>
		)
	}
}
