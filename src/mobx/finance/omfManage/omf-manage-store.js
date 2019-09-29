import {action, observable} from "mobx";
import Client from '../../../common/lead-api'
class OmfManageStore {
	@observable FinanceList= [];
	@observable total= 0;
	@action
	getFinanceList(developerId,developerId2,startDate,endDate,state,pageNo,pageSize){
		Client.getNullArgument('media/getFinanceList?developerId='+developerId
			+'&developerBody='+developerId2+'&startDate='+
			startDate+'&endDate='+endDate+'&state='+state+
			'&pageNo='+pageNo+'&pageSize='+pageSize).then(res=>{
			if(res.list==null){
				this.FinanceList=[];
			}else{
				this.FinanceList=res.list;
			}
			this.total=res.count;
		})
	}
	@action
	modificationAudit(developerId,insertDate,state,callback){
		Client.getNullArgument('media/updateFinanceState?developerId='+developerId+'&insertDate='+insertDate+'&state='+state).then(res=>{
			callback();
		})
	}
	@action
	modificationBatchAudit(data,callback){
		Client.createObject('media/updateFinanceStateList',data).then(res=>{
			callback();
		})
	}
}
const omfManageStore = new OmfManageStore();
export default omfManageStore
