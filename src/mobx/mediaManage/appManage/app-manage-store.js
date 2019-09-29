import {observable, action} from "mobx";
import Client from '../../../common/lead-api'
class AppManageStore {
	@observable leadAppsArr = [];
	@observable parentArr = [];
	@observable parentId = '';
	@observable childArr = [];
	@observable childId = '';
	@observable total = 1;
	@observable typeObj = {};
	@action
	getleadApps(size, page) {
		let paramStr = "?pageNo="+page+"&pageSize="+size;
		Client.getListByParam('media/getAppPage',paramStr).then(res=>{
			this.leadAppsArr=res.content;
			this.total=res.totalElements;
		});
	}
	@action
	createApp(objData,childId,callback){
		Client.createObject('leadApps',objData).then(res=>{
			Client.setRelation('leadApps',res.id,'appCategory','leadAppCategories',[childId]).then(res=>{})
			callback();
		})
	}
	@action
	modifyApp(id,objData,childId,callback){
		Client.modifyObject('leadApps',id,objData).then(res=>{
			Client.setRelation('leadApps',res.id,'appCategory','leadAppCategories',[childId]).then(res=>{})
			callback();
		})
	}
	@action
	modifyApp1(id,objData,callback){
		Client.modifyObject('leadApps',id,objData).then(res=>{
			callback();
		})
	}
	@action
	deleteItem(id){
		Client.deleteObject("leadApps", id).then(res=>{})
	}
	@action
	searchItem(name,page,size){
		Client.getleadArr("leadApps/search/spec", {query:'isGroup==0;state!=DELETED;appName==*'+name+'*;appType==LENOVO',page:page-1,size:size,sort:'appName'}).then(res=>{
			this.leadAppsArr=res._embedded.leadApps;
			this.total=res.page.totalElements;
		})
	}
	@action
	searchAllItem(name,page,size){
		Client.getleadArr("leadApps/search/spec", {query:'state!=DELETED;appName==*'+name+'*',page:page-1,size:size,sort:'appName'}).then(res=>{})
	}
	@action
	deleteLeadApp(data,callback){
		Client.createObject('leadApps/search/multiUpdate',data).then(res=>{
			callback();
		})
	}
	@action
	getAppCategories(){
		Client.getleadArr('leadAppCategories/search/spec',{query:'parent==null',size:999,sort:'id'}).then(res=>{
			this.parentArr=res._embedded.leadAppCategories;
			this.parentId=res._embedded.leadAppCategories[0].id;
			Client.getleadArr('leadAppCategories/search/spec',{query:'parent==id:'+res._embedded.leadAppCategories[0].id,size:999,sort:'id'}).then(res=>{
				this.childArr=res._embedded.leadAppCategories;
				this.childId=res._embedded.leadAppCategories[0].id;
			})
		})
	}
	@action
	getAppCategories1(){
		Client.getleadArr('leadAppCategories/search/spec',{query:'parent==null',size:999,sort:'id'}).then(res=>{
			this.parentArr=res._embedded.leadAppCategories;
		})
	}
	@action
	getChildAppCategories(id){
		Client.getleadArr('leadAppCategories/search/spec',{query:'parent==id:'+id,size:999,sort:'id'}).then(res=>{
			this.childArr=res._embedded.leadAppCategories;
			this.childId=res._embedded.leadAppCategories[0].id;
		})
	}
	@action
	getChildAppCategories1(id){
		Client.getleadArr('leadAppCategories/search/spec',{query:'parent==id:'+id,size:999,sort:'id'}).then(res=>{
			this.childArr=res._embedded.leadAppCategories;
		})
	}
}
const appManageStore = new AppManageStore();
export default appManageStore
