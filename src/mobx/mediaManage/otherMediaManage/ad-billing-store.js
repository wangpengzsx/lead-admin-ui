import {observable, action} from "mobx";
import Client from '../../../common/lead-api'
class AdBillingStore {
	@observable developerArr = [];
	@observable total = 1;
	@action
	getDeveloperApps(id1,id2,appName,appId,adType,page,size) {
		Client.getNullArgument('media/getThirdAppList?developerId='+id1+'&developerBody='+id2+'&appName='+appName+'&appId='+appId+'&adType='+adType+'&pageNo='+page+'&pageSize='+size)
			.then(res=>{
				this.developerArr=res.list;
				this.total=res.count;
			})
	}
	@action
	modificationBilling(appId,adType,divideType,ratio,cpm,callback){
		Client.getNullArgument('media/setAdTypeDivide?appId='+appId+'&adType='+adType+'&divideType='+divideType+'&cpm='+cpm+'&ratio='+ratio).then(res=>{
			callback();
		})
	}
	@action
	modificationBillingPiliang(data,callback){
		Client.createObject('media/setAdTypeDivideList',data).then(res=>{
			callback();
		})
	}
}
const adBillingStore = new AdBillingStore();
export default adBillingStore
