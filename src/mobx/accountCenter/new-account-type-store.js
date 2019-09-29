import {observable, action} from "mobx";
import Client from '../../common/lead-api'
class NewAccountTypeStore {
	@observable leadUserGroups= [];
	@action
	createType(userName,email,callback){
		Client.createObject('leadUserGroups',{"name":userName,"description":email}).then(res=>{
			callback(res.id);
		})
	}
	@action
	chooseType(id,idArr){//leadUsers/12/groups leadAuthorities/id
		Client.setRelation("leadUserGroups",id,"authorities","leadAuthorities",idArr).then(res=>{})
	}
}
const newAccountTypeStore = new NewAccountTypeStore();
export default newAccountTypeStore
