import { action } from "mobx";
import Client from '../../../common/lead-api';
class NewAdSpaceStore {
	@action
	createAdSpace(objData,callback){
		Client.createObject('leadAdSpaces',objData).then(res=>{
			callback(res.id);
		});
	}
}
const newAdSpaceStore = new NewAdSpaceStore();
export default newAdSpaceStore;
