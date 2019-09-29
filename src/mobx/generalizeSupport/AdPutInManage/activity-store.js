import {observable, action} from "mobx";
import Client from '../../../common/lead-api'
class ActivityStore {
	@observable activityArr= [];
	@observable total= 0;
	@action
	getActivityArr(size,page,name,id) {//获取广告活动列表
		Client.getNullArgument('adv/activeList?pageSize='+size+'&pageNo='+(page-1)+'&name='+name+'&planId='+id).then(res=>{
			this.activityArr=res.content;
			this.total=res.totalElements;
		})
	}
	@action
	updateActiveState(state,ids,call) {//修改活动状态
		Client.getNullArgument('adv/updateActiveState?activeState='+state+'&activeIds='+ids).then(res=>{
			if(res.status==200){
				call()
			}else{
				Client.showTank(false,res.message);
			};
		})
	}
}
const activityStore = new ActivityStore();
export default activityStore
