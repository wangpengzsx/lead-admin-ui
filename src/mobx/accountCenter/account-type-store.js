import {observable, action} from "mobx";
import Client from "../../common/lead-api"
class AccountTypeStore {
	@observable chooseArr= [];
	@observable piatchOnArr= [];
	@action
	fetchAuthorities(){
		Client.getNullArgument('leadAuthorities?size=999').then(res=>{
			let arr=res._embedded.leadAuthorities,arr1=[];
			for(let i=0; i<arr.length; i++){
				if(arr[i].parentId==null){
					arr[i].sub=[];
					arr[i].checked=false;
					arr[i].selected=false;
					arr1.push(arr[i]);
				}
			}
			for(let i=0; i<arr.length; i++){
				for(let j=0; j<arr1.length; j++)
					if(arr[i].parentId==arr1[j].id){
						arr[i].checked=false;

						arr1[j].sub.push(arr[i]);
					}
			}
			this.chooseArr=arr1;
		})
	}
}
const accountTypeStore = new AccountTypeStore();
export default accountTypeStore
