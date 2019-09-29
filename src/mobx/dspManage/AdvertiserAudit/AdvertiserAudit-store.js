import { observable, action} from "mobx";
import Client from '../../../common/lead-api';
function qwerty(dspId, adId, lState, adname, Time,otherAdId) {
	let arr = [
		{
			name: dspId,
			str: 'dspId=in=(' + dspId + ')'
		},
		{
			name: adId,
			str: 'id==' + adId
		},
		{
			name: adname,
			str: 'name==' + adname,
		},
		{
			name: otherAdId,
			str: 'advertiserId==' + otherAdId
		},
		{
			name: lState,
			str: 'lookState==' + lState
		},
		{
			name: Time,
			str: 'modifyTime=day=' + Time
		}
	]
	let str = '', arr1 = [];
	for (let i = 0; i < arr.length; i++) {
		if (arr[i].name != '') {
			arr1.push(arr[i].str)
		}
	}
	for (let i = 0; i < arr1.length; i++) {
		if (i == arr1.length - 1) {
			str += arr1[i]
		} else {
			str += arr1[i] + ';'
		}
	}
	return str;
}
class AdvertiserManageStore {
	@observable AdvertiserArr = [];
	@observable typeObj = {};
	@observable total = 1;
	@observable id = ""
	@observable leadAppsArr = [];
	@observable leadDsps = [];
	@observable seeQArr = [];
	@observable totals = 1
	@observable seeInfoArr = []
	//新建  审核
	@action
	creatingAdvertiser(objData,callback) {
		Client.createObject('leadAdvertisers/search/multiUpdate', objData).then(res => {
			callback()
		})
	}
	@action
	creatingAdvertiser1(objData,objData1,callback) {
		Client.createObject('leadAdvertisers/search/multiUpdate', objData).then(res => {
			Client.createObject('leadAdvertisers/search/multiUpdate',objData1).then(res1 =>{
				callback()
			})
		})
	}
	//筛选
	@action
	searchAccount(dspId, adId, lState, adname, Time,otherAdId, page, size) {
		let str = qwerty(dspId, adId, adname, lState, Time,otherAdId)
		Client.getleadArr("leadAdvertisers/search/spec", { query: str, page: page , size: size }).then(res => {
			this.AdvertiserArr = res._embedded.leadAdvertisers;
			this.total = res.page.totalElements;
		})
	}
	@action
	SeeQ(seeId, page, size) {
		let str = 'leadAdvertiser==(id:' + seeId + ')'
		Client.getleadArr("leadQualificationses/search/spec", { query: str, page: page - 1, size: size }).then(res => {
			this.seeQArr = res._embedded.leadQualificationses;
			this.totals = res.page.totalElements;
		})
	}
}
const advertiserManageStore = new AdvertiserManageStore();
export default advertiserManageStore;
