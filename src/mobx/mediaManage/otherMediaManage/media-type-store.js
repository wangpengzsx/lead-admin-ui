import {observable, action} from "mobx";
import Client from '../../../common/lead-api'
class MediaTypeStore {
	@observable leadAppsArr = [];
	@observable total = 1;
	@action
	getleadApps(name,appid,packageName,appType,size, page) {
		let str=''
		if(appType==''){
			str='appName==*'+name+'*;id==*'+appid+'*;packageName==*'+packageName+'*'
		}else{
			str='appName==*'+name+'*;id==*'+appid+'*;packageName==*'+packageName+'*;appType=='+appType
		}
		Client.getleadArr('leadApps/search/spec', {query:str,page:page-1,size:size,sort:'name'})
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
const mediaTypeStore = new MediaTypeStore();
export default mediaTypeStore
