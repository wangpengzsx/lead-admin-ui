import {observable, action} from "mobx";
import Client from '../../common/lead-api'
class GeneralizeManageStore {
	@observable GenerArr= [];
	@observable total = 1;
	@observable totalEle = 1;
	@observable typeObj = {};
	@observable appArr = [];
	@observable AdForms = [];
	@observable AdSpaceSizes = [];
	@observable adSizes = [];
	@observable SpaceFormListInfo = [];
	@observable creativeArr = [];
	@observable spaceCreatives = [];
	@observable checkAdSpaces = [];
	@observable checkAdCreatives = [];
	@observable SpaceFormList=[];
	@observable dormantRatio='';
	@observable oursSpace=[];
	@action
	getGenerArr(size,page) {
		Client.getList('leadPopularizePlans',size,page).then(res=>{
			this.GenerArr=res._embedded.leadPopularizePlans;
		})
	}
	@action
	searchGenerArr(name,page,size){
		Client.getleadArr("leadPopularizePlans/search/spec", {query:'status!=DELETED;name==*'+name+'*',page:page-1,size:size,sort:'name'}).then(res=>{
			this.GenerArr=res._embedded.leadPopularizePlans;
			this.total=res.page.totalElements;
		})
	}
	@action
	changeLeadPlans(data,callback){
		Client.createObject('leadPopularizePlans/search/multiUpdate',data).then(res=>{
			callback()
		})
	}
	@action
	createPopularizePlans(data,callback,errCallback){
		Client.createObject('popu/savePopPlan',data).then(res=>{
			if(res.status==200){
				callback()
			}else{
				alert(res.message);
			};
		}).catch(err=>{
			errCallback(err);
		})
	}
	@action
	getAdFormsArr(){
		Client.getNullArgument('leadAdForms').then(res=>{
			this.AdForms=res._embedded.leadAdForms;
		})
	}
	@action
	getAppArr(){
		Client.getNullArgument('someQuery/getNoGroupAppList').then(res=>{
			this.appArr=res;
		})
	}
	@action
	getOursSpace(){
		Client.getleadArr('leadAdSpaces/search/getOursSpace',{adSpaceName:''}).then(res=>{
			this.oursSpace=res._embedded.leadAdSpaces;
		})
	}
	@action
	getAdSpaceSizes(){
		Client.getNullArgument('media/getHeightXWidth').then(res=>{
			this.adSizes=res;
		})
	}
	@action
	getSpaceFormListInfo(data){
		Client.getleadArr('someQuery/getSpaceFormListInfo',data).then(res=>{
			this.SpaceFormListInfo=res;
		})
	}
	@action
	getSpaceFormList(data){
		Client.getleadArr('dormant/getDormantList',data).then(res=>{
			this.SpaceFormList=res.allList;
			this.dormantRatio=res.DORMANT_RATIO
		})
	}
	@action
	getCreativeSpace(data){
		Client.getleadArr('creative/getCreativeForPop',data).then(res=>{
			this.creativeArr=res.creativeList;
			this.totalEle=res.count;
		})
	}
	@action
	checkAdSpace(data){
		Client.getleadArr('popu/getByAdPopuId',data).then(res=>{
			this.checkAdSpaces=res;
		})
	}
	@action
	checkAdCreative(data){
		Client.getleadArr('leadCreatives/search/getByPopuId',data).then(res=>{
			this.checkAdCreatives=res._embedded.leadCreatives;
		})
	}
}
const generalizeManageStore = new GeneralizeManageStore();
export default generalizeManageStore
