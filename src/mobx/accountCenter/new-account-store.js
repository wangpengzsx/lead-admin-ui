import {observable, action} from "mobx";
import Client from '../../common/lead-api'
class NewAccountStore {
	@observable leadUserGroups= [];
	@action
	getleadUserGroups(){
		Client.getList('leadUserGroups').then(res=>{
			this.leadUserGroups=res._embedded.leadUserGroups
		})
	}
	@action
	createUser(userName,email,callback){
		Client.createObject('leadUsers',{"userName":userName,"email":email,"password":userName}).then(res=>{
			callback(res.id);
		})
	}
	@action
	choosetype(id,idArr){//leadUsers/12/groups leadAuthorities/id
		Client.addRelation("leadUsers",id,"groups","leadAuthorities",idArr).then(res=>{})
	}
}
const newAccountStore = new NewAccountStore();
export default newAccountStore
