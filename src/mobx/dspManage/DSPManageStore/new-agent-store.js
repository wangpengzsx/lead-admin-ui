import { observable, action} from "mobx";
import Client from '../../../common/lead-api'
class NewAgentStore {
	@observable newAgentArr = [];
	@observable total = 1;
	@observable typeObj = {};
    @observable status = ''
	@action
	getnewAgent(size, page, name) {
		let paramStr = "?pageNo=" + page + "&pageSize=" + size + "&dspName=" + name;
		Client.getListByParam('dsp/getDspPage', paramStr).then(res => {
			this.newAgentArr = res.list;
			this.total = res.count;
		});
	}
	@action
	modifyAgents(objData, callback) {
		Client.createObject('dsp/saveOrUpdateDsp', objData).then(res => {
			callback();
		})
	}
	@action
	searchUser(page, size, name) {
		let pStr = "?pageNo=" + page + "&pageSize=" + size + "&dspName=" + name;
		Client.searchType('leadDsps', pStr).then(res => {
			this.newAgentArr = res._embedded.leadDsps;
		});
	}
}
const newAgentStore = new NewAgentStore();
export default newAgentStore;
