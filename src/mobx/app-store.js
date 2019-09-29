import {action, observable} from "mobx";
class AppStore {
	@observable appState= 1;
	@action
	getUserInfo(){
		this.appState=5;
	}
}
const appStore = new AppStore();
export default appStore
