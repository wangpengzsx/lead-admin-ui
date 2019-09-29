import {observable, action} from "mobx";
import Client from '../../../common/lead-api'
class FlowSetStore {
	@observable leadAppsArr = [];
	@observable appsGroups = [];
	@observable parentArr = [];
	@observable parentId = '';
	@observable childArr = [];
	@observable childId = '';
	@observable total = 1;
	@observable typeObj = {};
	@action
	searchItem(callback){
		Client.getNullArgument('someQuery/getNoGroupAppList').then(res=>{
			callback(res);
		})
	}
	@action
	saveOrUpdateStrategy(leadStrategy,callback){
		Client.createObject("strategy/saveOrUpdateStrategy", leadStrategy).then(res=>{
			if(res.status=='200'){
				callback();
			}else{
				Client.showTank(false,res.message)
			}
		})
	}
	@action
	setRegularPrice(leadStrategy,callback){
		Client.createObject("strategy/setRegularPrice", leadStrategy).then(res=>{
			if(res.status)
				callback();
		})
	}
}
const flowSetStore = new FlowSetStore();
export default flowSetStore
