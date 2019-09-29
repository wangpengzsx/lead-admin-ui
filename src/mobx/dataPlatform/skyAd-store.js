import { action, observable} from "mobx";
import Client from '../../common/lead-api'
const DuibiArr=[
	{name:'请求数',value:'requests'},
	{name:'展现数',value:'displays'},
	{name:'展现率',value:'display_rate'},
	{name:'点击数',value:'clicks'},
	{name:'点击率',value:'ctr'},
]
class SkyAdstore {
	@observable DownloadList = [];
	@observable daysX = [];
	@observable a1 = [];
	@observable a2 = [];
	@observable isRate1 = false;
	@observable isRate2 = false;
	@observable total = 0;
	@observable storeAppArr = [];
	@observable storeOsArr = [];
	@observable storeSpaceArr = [];
	@observable storeTypeArr = [];
	@observable storeSizeArr = [];
	@action
	getDownloadList(pageNo, pageSize, startDate, endDate, appId, adType, spaceId,compareValue1,compareValue2,callback) {
		let appStr=Client.returnArgument(appId);
		Client.getNullArgument('stat/dormantData?pageNo=' + pageNo + '&pageSize=' + pageSize + '&startDate=' + startDate + '&endDate=' + endDate + '&' + appStr + '&adType=' + adType + '&spaceId=' + spaceId).then(res => {
			let key=[];
			let a1=[];
			let a2=[];
			for (let p1 in res.line) {
				if (res.line.hasOwnProperty(p1))
					key.push(Client.insertGang(p1));
				for(let i=0;i<DuibiArr.length; i++){
					if(DuibiArr[i].name==compareValue1){
						if(res.line[p1][DuibiArr[i].value]==null||res.line[p1][DuibiArr[i].value]=='NaN'){
							if(DuibiArr[i].name.indexOf('率')!=-1||DuibiArr[i].name.indexOf('比')!=-1){
								this.isRate1=true;
							}else{
								this.isRate1=false;
							}
							a1.push(0)
						}else{
							if(DuibiArr[i].name.indexOf('率')!=-1||DuibiArr[i].name.indexOf('比')!=-1){
								this.isRate1=true;
								a1.push(res.line[p1][DuibiArr[i].value]*100);
							}else{
								this.isRate1=false;
								a1.push(res.line[p1][DuibiArr[i].value]);
							}
						}
					}
					if(DuibiArr[i].name==compareValue2){
						if(res.line[p1][DuibiArr[i].value]==null||res.line[p1][DuibiArr[i].value]=='NaN'){
							if(DuibiArr[i].name.indexOf('率')!=-1||DuibiArr[i].name.indexOf('比')!=-1){
								this.isRate2=true;
							}else{
								this.isRate2=false;
							}
							a2.push(0)
						}else{
							if(DuibiArr[i].name.indexOf('率')!=-1||DuibiArr[i].name.indexOf('比')!=-1){
								this.isRate2=true;
								a2.push(res.line[p1][DuibiArr[i].value]*100);
							}else{
								this.isRate2=false;
								a2.push(res.line[p1][DuibiArr[i].value]);
							}

						}
					}
				}
			}
			this.daysX=key;
			this.a1=a1;
			this.a2=a2;
			this.total = res.count;
			this.DownloadList = res.list;
			callback();
		})
	}
}
const skyAdStore = new SkyAdstore();
export default skyAdStore
