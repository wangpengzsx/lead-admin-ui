import {observable, action} from "mobx";
import Client from '../../../common/lead-api'
class PlanStore {
	@observable planArr= [];
	@observable total= 0;
	@action
	getPlanArr(size,page,name,id) {//获取广告主列表
		Client.getNullArgument('adv/planList?pageSize='+size+'&pageNo='+(page-1)+'&name='+name+'&advId='+id).then(res=>{
			this.planArr=res.content;
			this.total=res.totalElements;
		})
	}
	@action
	updatePlanState(ids,state,call) {//获取广告主列表
		Client.getNullArgument('adv/updatePlanState?planState='+state+'&planIds='+Client.arrStr(ids)).then(res=>{
			if(res.status==200){
				call()
			}else{
				Client.showTank(false,res.message);
			};
		})
	}
}
const planStore = new PlanStore();
export default planStore
