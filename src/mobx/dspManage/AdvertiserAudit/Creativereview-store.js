import { observable, action} from "mobx";
import Client from '../../../common/lead-api';
function qwerty(dspId, adId, lState, adname, Time) {
	let arr = [
		{
			name: dspId,
			str: 'dspId=in=(' + dspId + ')'
		},
		{
			name: adId,
			str: 'dspCreativeId==' + adId
		},
		{
			name: adname,
			str: 'name==' + adname,
		},
		{
			name: lState,
			str: 'creativeState==' + lState
		},
		{
			name: Time,
			str: 'createTime=day=' + Time
		}
	]
	let str = '', arr1 = ['creativeType==API_DSP'];
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
class CreativereStore {
	@observable CreativeArr = [];
	@observable typeObj = {};
	@observable atotal = 1;
	@observable total = 1
	@observable id = ""
	@observable leadAppsArr = [];
	@observable leadDsps = [];
	@observable seeQArr = [];
	@observable totals = 1
	@observable seeInfoArr = []
	//数据列表
	@action
	getCeative(page, size) {
		Client.getleadArr('leadCreatives/search/spec?resource=0', { query: "creativeState=in=(UNKNOWN,ONLINE,AuditFail)", page: page - 1, size: size }).then(res => {
			this.CreativeArr = res.content
			this.atotal = res.totalElements
		})
	}
	//创建
	@action
	creatingAdvertiser(objData, callback) {
		Client.createObject('leadCreatives/search/multiUpdate', objData).then(res => {
			callback()
		})
	}
	//获取dsp
	@action
	searchItem(name, page, size) {
		Client.getleadArr("leadDsps/search/spec", { query: 'name==*' + name + '*', page: page - 1, size: size }).then(res => {
			this.leadDsps = res._embedded.leadDsps;
			this.total = res.page.totalElements;
		})
	}
	//筛选
	@action
	searchAccount(dspId, adId, lState, adname, Time, page, size) {
		let str = qwerty(dspId, adId, adname, lState, Time)
		Client.getleadArr("leadCreatives/search/spec?resource=0", { query: str, page: page, size: size }).then(res => {
			this.CreativeArr = res.content;
			this.atotal = res.totalElements;
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
	//查看
	@action
	SeeInfo(ids) {
		Client.getleadArr("leadCreatives/search/spec?resource=0", { query: 'id==' + ids }).then(res => {
			this.seeInfoArr = res.content
		})
	}
}


const creativereStore = new CreativereStore();
export default creativereStore;
