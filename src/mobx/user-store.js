import {action, observable} from "mobx";
import Client from '../common/lead-api'
class UserStore {
	@observable userInfo= {};
	@observable captcha= false;
	@action
	getUserInfo(callback){
		Client.getNullArgument('auth/currentUser').then(res=>{
			this.userInfo={
				userName:res.data.userName,
				createTime:res.data.createTime,
			}
			callback(res.data.id,res.data.email);
		})
	}
}
const userStore = new UserStore();
export default userStore
