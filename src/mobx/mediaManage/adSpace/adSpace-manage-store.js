import {observable, action} from "mobx";
import Client from '../../../common/lead-api'
class AdSpaceManageStore {
	@observable adSpaceArr= [];
	@observable total= 1;
	@observable typeObj ={};
	@observable adSpaceArrByAppId= [];
	@observable adSpaceArrById= [];
	@observable spaceSizeArrByAdType= [];
	@action
	getleadAdSpace(size,page){
		let paramStr = "?pageNo="+page+"&pageSize="+size;
		Client.getListByParam('media/getSpacePage',paramStr).then(res=>{
			this.adSpaceArr=res.content;
			this.total=res.totalElements;
		});
	}
	// 根据appid 获取广告位列表
	@action
	findAllByleadAppId(leadAppId){
		let paramStr = "?leadAppId="+leadAppId;
		Client.getListByParam('leadAdSpaces/search/findAllByleadAppId',paramStr).then(res=>{
			this.adSpaceArrByAppId=res._embedded.leadAdSpaces;
		});
	}
	@action
	findAllById(id){
		let paramStr = "?id="+id;
		Client.getListByParam('leadAdSpaces/search/findAllById',paramStr).then(res=>{
			this.adSpaceArrById=res._embedded.leadAdSpaces;
		});
	}
	@action
	deleteItem(id){
		Client.deleteObject("leadAdSpaces", id).then(res=>{});
	}
	@action
	deleteMany(ids,callback){
		Client.deleteMany("leadAdSpaces/search/deleteByIdIn?id=", ids).then(res=>{
			callback();
		});
	}
	// 批量修改状态
	@action
	updateStateByIds(ids,stateStr,callback){
		stateStr = "&spaceState="+stateStr;
		Client.updateByIds("leadAdSpaces/search/updateStateByIds?ids=", ids, stateStr).then(res=>{
			callback();
		});
	}
	// 批量修改名称
	@action
	updateNames(ids,nameStr,callback){
		nameStr = "&adSpaceName=" + nameStr;
		Client.updateByIds("leadAdSpaces/search/updateNameByIds?ids=", ids, nameStr).then(res=>{
			callback();
		});
	}
	@action
	getSpaceSizeByAdType(adType){
		let paramStr = "?adType="+adType;
		Client.getListByParam('leadAdSpaceSizes/search/findAllByAdType',paramStr).then(res=>{
			this.spaceSizeArrByAdType=res._embedded.leadAdSpaceSizes;
		});
	}
	@action
	searchLeadAdSpaces(appId,name,page,size){
		let str='';
		if(appId){
			str='leadApp=in=(id:'+appId+');isGroup==0;spaceState!=DELETED;adSpaceName==*'+name+'*'
		}else{
			str='isGroup==0;spaceState!=DELETED;adSpaceName==*'+name+'*'
		}
		Client.getleadArr('leadAdSpaces/search/spec',{query:str,page:page-1,size:size,sort:'id'}).then(res=>{
			this.adSpaceArr=res._embedded.leadAdSpaces;
			this.total=res.page.totalElements;
		})
	}
}
const adSpaceManageStore = new AdSpaceManageStore();
export default adSpaceManageStore;
