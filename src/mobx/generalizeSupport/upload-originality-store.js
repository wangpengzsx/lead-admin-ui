import {observable, action} from "mobx";
import Client from '../../common/lead-api'
class UploadOriginalityStore {
	@observable forms= [];
	@observable formId= '';
	@observable sizeArr= [];
	@observable sizeId= '';
	@observable SpaceFormListInfo= [];
	@observable fields= [];
	@action
	getleadAdForms(type) {
		Client.getNullArgument('leadAdForms/search/findAllByAdType?adType='+type).then(res=>{
			this.forms=res._embedded.leadAdForms;
			this.formId=res._embedded.leadAdForms[0].id;
			this.getSizeArr(res._embedded.leadAdForms[0].id);
		})
	}
	@action
	getleadAdFormsA(type) {
		Client.getNullArgument('leadAdForms/search/findAllByAdType?adType='+type).then(res=>{
			this.forms=res._embedded.leadAdForms;
		})
	}
	@action
	getSizeArr(id){
		Client.getNullArgument('media/form?id='+id).then(res=>{
			this.sizeArr=res.sizeList;
			this.sizeId=res.sizeList[0].id;
			for(let i=0; i<res.fields.length; i++){
				res.fields[i].error=false
				res.fields[i].filename='未选择任何文件'
			}
			this.fields=res.fields;
		})
	}
	@action
	getSizeArrA(id,field){
		Client.getNullArgument('media/form?id='+id).then(res=>{
			this.sizeArr=res.sizeList;
			for(let i=0; i<res.fields.length; i++){
				for(let j=0; j<field.length; j++){
					if(res.fields[i].name==field[j].name){
						console.log(111);
						res.fields[i].error=false
						res.fields[i].filename=field[j].fileName
					}
				}
			}
			this.fields=res.fields;
		})
	}
	@action
	getAdSpace(data){
		Client.getleadArr('someQuery/getSpaceFormListInfo',data).then(res=>{
			this.SpaceFormListInfo=res;
		})
	}
	@action
	createOriginality(data,callback){
		Client.createObject('creative/saveCreative',data).then(res=>{
			if(res.status){
				callback()
			}else{
				alert(res.message)
			}
		})
	}
}
const uploadOriginalityStore = new UploadOriginalityStore();
export default uploadOriginalityStore
