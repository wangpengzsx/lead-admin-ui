import {observable, action} from "mobx";
import Client from '../../../common/lead-api'
class FlowGroupsStore {
	@observable appsGroups=[];
	@observable total=1;
	@action
	getleadAppsGroups(size, page) {
		Client.getList('leadAppGroups', size, page).then(res => {
			this.appsGroups=res._embedded.leadAppGroups;
			this.total=res.page.totalElements;
		})
	}
	@action
	createLeadAppsGroups(data,callback,errCallback) {
		Client.createObject('leadAppGroups',data).then(res => {
			if(res.id)
				callback(res.id)
		}).catch(err=>{
			errCallback(err)
		})
	}
	@action
	modifyLeadAppsGroups(id,data,callback,errCallback){
		Client.modifyObject('leadAppGroups',id,data).then(res => {
			if(res.id)
				callback(res.id)
		}).catch(err=>{
			errCallback(err)
		})
	}
	@action
	searchleadAppsGroups(name,size, page) {
		Client.getleadArr('leadAppGroups/search/spec', {query:'name==*'+name+'*;state!=DELETED',page:page-1,size:size,sort:'name'}).then(res => {
			this.appsGroups=res._embedded.leadAppGroups;
			this.total=res.page.totalElements;
		})
	}
	@action
	changeLeadGroups(data,callback){
		Client.createObject('leadAppGroups/search/multiUpdate',data).then(res=>{
			callback();
		})
	}
	@action
	uploadExcel(data,id,state,callback){
		Client.uploder('media/changeGroupMember?groupId='+id+'&removeOldApps='+state,data).then(res=>{
			callback();
		})
	}
}
const flowGroupsStore = new FlowGroupsStore();
export default flowGroupsStore
