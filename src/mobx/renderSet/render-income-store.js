import { observable, action } from "mobx";
import Client from "../../common/lead-api";
class RenderIncomeStore {
	@observable dspTask = [];//时段单选状态
	@observable total = 0;//总数
	@action
	searchAccount(fallbackDspId,name,page,size) {
		Client.getNullArgument("strategy/getTaskList?name="+name+'&fallbackDspId='+fallbackDspId+'&pageNo='+page+'&pageSize='+size).then(res => {
			this.dspTask=res.allList;
			this.total=res.count
		})
	}
}
const renderIncomeStore = new RenderIncomeStore();
export default renderIncomeStore;
