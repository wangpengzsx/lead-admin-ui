import {observable, action} from "mobx";
import Client from '../../common/lead-api'
class EditAccountTypeStore {
	@observable leadUserGroups= [];
	@observable chooseAuthorities= [];
	@action
	getType(id,callback){
		Client.getRelation('leadUserGroups',id,'authorities').then(res=>{
			callback(res._embedded.leadAuthorities);
		})
	}
	@action
	replaceType(userName,email,id){
		Client.modifyObject('leadUserGroups',id,{"name":userName,"description":email}).then(res=>{})
	}
	@action
	changeAuthorities(id,idArr){//leadUsers/12/groups leadAuthorities/id
		Client.setRelation("leadUserGroups",id,"authorities","leadAuthorities",idArr).then(res=>{})
	}
	@action
	deleteItem(id){
		Client.deleteObject("leadUserGroups", id).then(res=>{})
	}
}
const editAccountTypeStore = new EditAccountTypeStore();
export default editAccountTypeStore
