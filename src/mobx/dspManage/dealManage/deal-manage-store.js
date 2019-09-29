import { observable, action } from "mobx";
import Client from "../../../common/lead-api";
class DealManageStore {
	@observable tableList=[];
	@observable chooseArr=[];
	@observable adState='NO';
	@observable total=0;
	@action
	getDealList(page,size,name){
		Client.getNullArgument("deal/dealList?pageNo="+(page-1)+"&pageSize="+size+"&name="+name).then(res=>{
			this.tableList = res.content;
			this.total=res.totalElements;
		})
	}
	@action
	getChoiceSpace(){
		Client.getNullArgument('media/choiceSpace').then(res=>{
			let arr=[];
			for(let i=0;i<res.spaceList.length;i++){
				arr.push(
					{
						name:res.spaceList[i].appName,
						id:res.spaceList[i].appId,
						checked:false,
						selected:false,
						isApp:true
					}
				)
			}
			arr=Client.removeDuplicatedItem2(arr,'id')
			for(let i=0;i<arr.length;i++){
				let subArr=[];
				for(let j=0;j<res.spaceList.length;j++){
					if(arr[i].id==res.spaceList[j].appId){
						subArr.push({
							name:res.spaceList[j].adSpaceName,
							id:res.spaceList[j].id,
							checked:false
						})
					}
				}
				arr[i].sub=subArr
			}
			for(let i=0;i<res.groupList.length;i++){
				let obj={
					name:res.groupList[i].name,
					id:res.groupList[i].id,
					checked:false,
					selected:false,
					isApp:false,
					sub:[
						{ name: 'banner广告', id: 'BANNER',checked:false, },
						{ name: '开屏广告', id: 'OPENSCREEN',checked:false, },
						{ name: '插屏广告', id: 'POPUP',checked:false, },
						{ name: '原生广告', id: 'NATIVE' ,checked:false,},
						{ name: '视频广告', id: 'VIDEO',checked:false, }
					]
				}
				arr.push(obj)
			}
			this.chooseArr=arr;
			if(localStorage.getItem('dealId')){
				Client.getNullArgument('deal/findAllById?id='+localStorage.getItem('dealId')).then(res=>{
					if(res.leadDealSpaceList.length>0){
						this.adState='YES';
					}
					for(let i=0;i<res.leadDealSpaceList.length;i++){
						for(let j=0;j<arr.length;j++){
							for(let h=0;h<arr[j].sub.length;h++){
								if(res.leadDealSpaceList[i].appId){
									if(res.leadDealSpaceList[i].appId==arr[j].id&&res.leadDealSpaceList[i].spaceId==arr[j].sub[h].id){
										arr[j].checked=true;
										arr[j].sub[h].checked=true;
									}
								}else{
									if(res.leadDealSpaceList[i].appGroupId==arr[j].id&&res.leadDealSpaceList[i].adType==arr[j].sub[h].id){
										arr[j].checked=true;
										arr[j].sub[h].checked=true;
									}
								}
							}
						}
					}
					this.chooseArr=arr;
				})
			}
		})
	}
}

const dealManageStore = new DealManageStore();
export default dealManageStore;
