import {observable} from "mobx";
import Client from '../../../common/lead-api'
class PutInStrategyStore {
	@observable fallArr = [];
	@observable mediaArr = [];
	@observable mediaArr1 = [];
	@observable stratgyArr = [];
	@observable disableArr = [];
	@observable total = 10;
	@observable
	getFallbackArr() {
		Client.getleadArr('leadFallbackDsps/search/spec',{query:'state==OPEN'}).then(res=>{
			let arr=[{name:'全部',value:''}];
			for(let i=0;i<res._embedded.leadFallbackDsps.length;i++){
				arr.push({value:res._embedded.leadFallbackDsps[i].id,name:res._embedded.leadFallbackDsps[i].name})
			}
			this.fallArr=arr;
		})
	}
	@observable
	getMediaArr() {
		Client.getNullArgument('someQuery/getNoGroupAppList').then(res=>{
			let arr=[{name:'全部',value:''}];
			for(let i=0;i<res.length;i++){
				if(res[i].APP_ID){
					arr.push({value:'@'+res[i].APP_ID,name:res[i].NAME})
				}else{
					arr.push({value:'#'+res[i].APP_GROUP_ID,name:res[i].NAME})
				}
			}
			this.mediaArr=arr;
		})
	}
	@observable
	getStratgyArr(fallbackDspId,appId,appGroupId,state,adType,page,size) {
		Client.getNullArgument('strategy/getStrategyList?fallbackDspId='+fallbackDspId+'&appId='+appId+'&appGroupId='+appGroupId
		+'&state='+state+'&adType='+adType+'&pageNo='+page+'&pageSize='+size).then(res=>{
			this.stratgyArr=res.allList;
			this.total=res.count;
		})
	}
	@observable
	getAdTypeList(dspId,appId,appGroupId,strategyId) {
		Client.getNullArgument('strategy/getAdTypeList?fallbackDspId='+dspId+'&appId='+appId+'&appGroupId='+appGroupId+'&strategyId='+strategyId).then(res=>{
			this.disableArr=res;
		})
	}
}
const putInStrategyStore = new PutInStrategyStore();
export default putInStrategyStore
