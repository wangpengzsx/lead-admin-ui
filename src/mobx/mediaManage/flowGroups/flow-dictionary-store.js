import {observable, action} from "mobx";
import Client from '../../../common/lead-api'
class FlowDictionaryStore {
	@observable flowGroups=[];
	@action
	getSpaceFormListInfo(data) {
		Client.getleadArr('someQuery/getSpaceFormListInfo',data).then(res => {
			this.flowGroups=res;
		})
	}
}
const flowDictionaryStore = new FlowDictionaryStore();
export default flowDictionaryStore
