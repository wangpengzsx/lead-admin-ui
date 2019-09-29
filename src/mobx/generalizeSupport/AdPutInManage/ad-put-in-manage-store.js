import {observable, action} from "mobx";
import Client from '../../../common/lead-api'
class AdPutInManageStore {
	@observable adArr= [];
	@observable total= 0;
	@observable oneList= [];
	@observable twoList= [];
	@action
	getAdvertiserArr(size,page,name) {//获取广告主列表
		Client.getNullArgument('adv/advList?pageSize='+size+'&pageNo='+(page-1)+'&name='+name).then(res=>{
			this.total=res.totalElements;
			this.adArr=res.content;
		})
	}
	@action
	resetAdvertiserState(ids,state,call){//修改广告主状态
		Client.getNullArgument('adv/updateAdvState?advState='+state+'&advIds='+Client.arrStr(ids)).then(res=>{
			if(res.status==200){
				call()
			}else{
				Client.showTank(false,res.message)
			}
		})
	}
	@action
	topOneList(){
		Client.getNullArgument('adv/topOneList').then(res=>{
			this.oneList=res;
		})
	}
	@action
	topTwoList(id){
		Client.getNullArgument('adv/topTwoList?parentId='+id).then(res=>{
			this.twoList=res;
		})
	}
}
const adPutInManageStore = new AdPutInManageStore();
export default adPutInManageStore
