import {observable,action} from "mobx";
import Client from '../../common/lead-api'
class NewAccountStore {
	@observable leadUserGroups= [];
	@observable total= 50;
	@observable accountTypeGroup= [];
	@action
	getleadUserGroups(size,page){
		Client.getList('leadUserGroups',size,page).then(res=>{
			this.total=res.page.totalElements;
			this.leadUserGroups=res._embedded.leadUserGroups;
		})
	}
	@action
	searchUserGroups(name){
		Client.searchType('leadUserGroups/search/findByNameContainingIgnoreCase?name='+name).then(res=>{
			this.leadUserGroups=res._embedded.leadUserGroups;
		})
	}
	@action
	modifyUser(id,userName,email){
		Client.modifyObject('leadUsers', id,{"userName":userName,"email":email}).then(res=>{})
	}
	@action
	choosetype(id,idArr){//leadUsers/12/groups leadAuthorities/id
		Client.setRelation("leadUsers",id,"groups","leadAuthorities",idArr).then(res=>{})
	}
	@action
	getAccountType(id,callback){
		Client.getRelation("leadUsers",id,"groups").then(res=>{
			callback(res._embedded.leadUserGroups)
		})
	}
}
const newAccountStore = new NewAccountStore();
export default newAccountStore
