import {observable,action} from "mobx";
import Client from '../../common/lead-api'
class AccountManageStore {
	@observable leadUsersArr = [];
	@observable total = 1;
	@observable typeObj = {};
	@action
	getleadUsers(size, page, callback) {
		Client.getList('leadUsers', size, page).then(res => {
			this.leadUsersArr = res._embedded.leadUsers;
			this.total = res.page.totalElements;
			callback(res._embedded.leadUsers);
		})
	}
	@action
	searchleadUsers(name) {
		Client.searchType('leadUsers/search/findByUserNameContainingIgnoreCase?userName=' + name).then(res => {
			this.leadUsersArr = res._embedded.leadUsers;
		})
	}
	@action
	getAccountType(id) {
		Client.getRelation("leadUsers", id, "groups").then(res => {
			this.typeObj[id] = res._embedded.leadUserGroups
		})
	}
}
const accountManageStore = new AccountManageStore();
export default accountManageStore
