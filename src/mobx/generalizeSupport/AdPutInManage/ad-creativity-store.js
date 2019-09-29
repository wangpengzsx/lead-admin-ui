import {observable, action} from "mobx";
import Client from '../../../common/lead-api'
function findObject(json, key) {
	if (!json||typeof(json)!="object") return null;
	switch(typeof key) {
		case "object": return key;
		case "number":
		case "string":
			if (json.id == key) {
				return json;
			} else {
				if (Array.isArray(json)) {
					return json.map(function(e){return findObject(e,key);}).find(function(e){return e!=null;});
				} else {
					return Object.entries(json).map(function(e){return findObject(e[1],key);}).find(function(e){return e!=null;});
				}
			}
	}
	return null;
}
class AdCreativityStore {
	@observable creativityArr= [];
	@observable choiceCreativityArr= [];
	@observable choiceArr= [];
	@observable putInType= '';
	@observable putInTypeValue= '';
	@observable putInMedia= '';
	@observable total= 0;
	@observable total1= 0;
	@action
	getCreativityArr(size,page,name,id) {
		Client.getNullArgument('adv/creativeList?pageSize='+size+'&pageNo='+(page-1)+'&name='+name+'&activeId='+id).then(res=>{
			for(let i=0;i<res.content.length;i++){
				if(res.content[i].leadCreative!=null){
					if(typeof res.content[i].leadCreative==='number'){
						res.content[i].leadCreative=findObject(res.content,res.content[i].leadCreative)
					}
				}
			}
			this.creativityArr=res.content;
			this.total1=res.totalElements;
		})
	}
	@action
	updateCreativesState(state,ids,call) {
		Client.getNullArgument('adv/updateActiveCreativeState?acState='+state+'&acIds='+ids).then(res=>{
			if(res.status==200){
				call()
			}else{
				Client.showTank(false,res.message)
			};
		})
	}
	@action
	getHoldMedia(id) {//获取广告主列表
		Client.getNullArgument('adv/getHoldMedia?activeId='+id).then(res=>{
			this.putInType=res.adType;
			this.putInTypeValue=res.adType_value;
			let arr=[]
			for(let i=0;i<res.leadAppList.length;i++){
				arr.push(res.leadAppList[i].appName)
			}
			for(let i=0;i<res.leadAppGroupList.length;i++){
				arr.push(res.leadAppGroupList[i].name)
			}
			this.putInMedia=Client.arrStr(arr)
			this.getChoiceCreativityArr(1,10,'',res.adType_value)
		})
	}
	@action
	getChoiceCreativityArr(page,size,name,adType) {//获取广告主列表
		Client.getNullArgument('adv/allCreativeList?pageNo='+(page-1)+'&pageSize='+size+'&name='+name+'&adType='+adType).then(res=>{
			this.choiceCreativityArr=res.content;
			this.total=res.totalElements;
		})
	}
}
const adCreativityStore = new AdCreativityStore();
export default adCreativityStore
