import {observable, action} from "mobx";
import Client from '../../../common/lead-api'
class AdPermissionStore {
	@observable leadAppsArr = [];
	@observable total = 1;
	@action
	getleadApps(name,appid,packageName,size, page) {
		Client.getleadArr('leadApps/search/spec', {query:'appName==*'+name+'*;id==*'+appid+'*;packageName==*'+packageName+'*',page:page-1,size:size,sort:'name'})
			.then(res=>{
				this.leadAppsArr=res._embedded.leadApps;
				this.total=res.page.totalElements;
			})
	}
	@action
	modifyApp1(id,objData,callback){
		Client.modifyObject('leadApps',id,objData).then(res=>{
			callback();
		})
	}
}
const adPermissionStore = new AdPermissionStore();
export default adPermissionStore
