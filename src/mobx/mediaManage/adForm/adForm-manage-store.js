import {observable, action} from "mobx";
import Client from '../../../common/lead-api';
class AdFormManageStroe {
	@observable adFormArr= [];
	@observable adFormArrByAdType= [];
	@observable adFormArrBySpaceId= [];
	@observable adFormArrById= {};
	@observable nativeFormarr= [];
	@observable total= 1;
	@observable typeObj ={};
	// 新建广告位与形式的关联
	@action
	relationForm(objData,callback){
		Client.createObject('leadAdSpaceFormInfoes',objData).then(res=>{
			callback(res._embedded);
		});
	}
	@action
	editSpaceForm(newAdFormId,spaceFormState,oldAdFormId,spaceId,callback){
		let temStr
		temStr = "&spaceFormState="+spaceFormState+"&oldAdFormId="+oldAdFormId+"&spaceId="+spaceId;
		Client.updateByIds("leadAdSpaceFormInfoes/search/updateSpaceForm?newAdFormId=", newAdFormId, temStr).then(res=>{
			callback();
		});
	}
	@action
	getAdForm(size,page){
		Client.getList('leadAdForms',size,page).then(res=>{
			this.adFormArr=res._embedded.leadAdForms;
			this.total=res.page.totalElements;
		});
	}
	@action
	getFormListBySpaceId(spaceId){
		let paramStr = "?spaceId="+spaceId;
		Client.getListByParam('leadAdForms/search/getFormListBySpaceId',paramStr).then(res=>{
			this.adFormArrBySpaceId=res._embedded.leadAdForms;
		});
	}
	@action
	deleteMany(ids,callback){
		Client.deleteMany("leadAdForms/search/deleteByIdIn?id=", ids).then(res=>{
			callback();
		});
	}
	// 批量修改状态
	@action
	updateStateByIds(ids,stateStr,callback){
		stateStr = "&formState="+stateStr;
		Client.updateByIds("leadAdForms/search/updateStateByIds?ids=", ids, stateStr).then(res=>{
			callback();
		});
	}
	@action
	getFormByAdType(adType,adSpaceId,adFormId){
		let paramStr = "?adType="+adType+"&adSpaceId="+adSpaceId+"&adFormId="+adFormId;
		Client.getListByParam('leadAdForms/search/findAllByAdTypeAndSpaceId',paramStr).then(res=>{
			this.adFormArrByAdType=res._embedded.leadAdForms;
		});
	}
	@action
	getFormById(id){//leadAdForms/search/findAllById
		let paramStr = "?id="+id;
		Client.getListByParam('media/form',paramStr).then(res=>{
			this.adFormArrById=res;
		});
	}
}
const adFormManageStroe = new AdFormManageStroe();
export default adFormManageStroe;
