import {action} from "mobx";
import Client from '../../../common/lead-api'
class EditAdSpaceStore {
	@action
	editAdSpace(id,objData,callback){
		Client.modifyObject('leadAdSpaces',id,objData).then(res=>{
			callback();
		});
	}
}
const editAdSpaceStore = new EditAdSpaceStore();
export default editAdSpaceStore;
