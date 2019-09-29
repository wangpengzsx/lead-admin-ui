import {action, observable} from "mobx";
import Client from '../../common/lead-api'
const DuibiArr=[
	{name:'ADX请求数',value:'requests'},
	{name:'DSP响应数',value:'responses'},
	{name:'响应率',value:'response_rate'},
	{name:'DSP参与竞价数',value:'bids'},
	{name:'DSP参与竞价率',value:'bid_rate'},
	{name:'竞价胜出数',value:'wins'},
	{name:'竞价胜出率',value:'win_rate'},
	{name:'花费',value:'income'},
	{name:'花费占比',value:'income_rate'},
	{name:'展现数',value:'displays'},
	{name:'展现率',value:'display_rate'},
	{name:'CPM',value:'cpm'},
	{name:'点击数',value:'clicks'},
	{name:'点击率',value:'ctr'},
	{name:'CPC',value:'cpc'},
]
class ApiDspStore {
	@observable DownloadList= [];
	@observable daysX= [];
	@observable a1= [];
	@observable a2= [];
	@observable isRate1= false;
	@observable isRate2= false;
	@observable total= 0;
	@observable storeTypeArr= [];
	@observable storeDspArr= [];
	@observable storeAppArr= [];
	@observable dspArr= [];
	@action
	getDspName(){
		Client.getNullArgument('leadDsps/search/getDspPage?dspName=&size=9999').then(res=>{
			this.dspArr=res._embedded.leadDsps;
		})
	}
	@action
	getDownloadList(pageNo,pageSize,startDate,endDate,appId,adType,dspId,compareValue1,compareValue2,callback){
		let appArr=appId.split(',');
		let oneArr=[],groupArr=[];
		for(let i=0;i<appArr.length;i++){
			if(appArr[i].slice(0,1)=='@'){
				oneArr.push(appArr[i].slice(1))
			}else if(appArr[i].slice(0,1)=='#'){
				groupArr.push(appArr[i].slice(1))
			}
		}
		let appStr='appId='+Client.arrStr(oneArr)+'&groupId='+Client.arrStr(groupArr)
		Client.getNullArgument('stat/apiDspData?pageNo='+pageNo+'&pageSize='+pageSize+'&'+appStr+'&startDate='+startDate+'&endDate='+endDate+'&adType='+adType+'&dspId='+dspId).then(res=>{
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
			this.total=res.count;
			this.DownloadList=res.list;
			callback();
		})
	}
}

const apiDspStore = new ApiDspStore();
export default apiDspStore
