import {observable, action} from "mobx";
import Client from '../../common/lead-api'
class CreativesManageStore {
	@observable CreativesArr= [];
	@observable total= 0;
	@action
	getCreativesArr(size,page) {
		Client.getList('leadCreatives',size,page).then(res=>{
			this.total=res.page.totalElements;
			this.CreativesArr=res._embedded.leadCreatives
		})
	}
	@action
	searchCreativesArr(size,page,data) {
		Client.createObject('creative/searchCreative?pageNo='+page+'&pageSize='+size,data).then(res=>{
			this.total=res.totalElements;
			this.CreativesArr=res.content;
		})
	}
	@action
	changeCreativesArr(data) {
		Client.createObject('leadCreatives/search/multiUpdate',data).then(res=>{})
	}
}
const creativesManageStore = new CreativesManageStore();
export default creativesManageStore
