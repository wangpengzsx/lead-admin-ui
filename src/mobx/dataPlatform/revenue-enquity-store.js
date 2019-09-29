import {action, observable} from "mobx";
import Client from '../../common/lead-api'
const DuibiArr=[
	{
		name:'DAU',
		value:'app_dau'
	},
	{
		name:'ARPU',
		value:'arpu'
	},
	{
		name:'收入',
		value:'income'
	},
	{
		name:'媒体请求数',
		value:'requests'
	},
	{
		name:'ADX响应数',
		value:'responses'
	},
	{
		name:'响应率',
		value:'response_rate'
	},
	{
		name:'展现数',
		value:'displays'
	},
	{
		name:'展现率',
		value:'display_rate'
	},
	{
		name:'CPM',
		value:'cpm'
	},
	{
		name:'点击数',
		value:'clicks'
	},
	{
		name:'点击率',
		value:'ctr'
	},
	{
		name:'CPC',
		value:'cpc'
	},
]
class RevenueEnquityStore {
	@observable DownloadList= [];
	@observable daysX= [];
	@observable a1= [];
	@observable a2= [];
	@observable isRate1= false;
	@observable isRate2= true;
	@observable total= 0;
	@observable appName= '';
	@observable appId= '';
	@observable storeTypeArr= [];
	@observable devName= '';
	@observable devBody= '';
	@observable developerList= [];
	@action
	getDeveloperList(){
		Client.getNullArgument('media/getDeveloperList').then(res=>{
			this.developerList=res;
		})
	}
	@action
	getDownloadList(pageNo,pageSize,startDate,endDate,appId,adType,compareValue1,compareValue2,callback){
		Client.getNullArgument('stat/otherMediaUvData?pageNo='+pageNo+'&pageSize='+pageSize+'&startDate='+startDate+'&endDate='+endDate+'&appId='+appId+'&adType='+adType).then(res=>{
			let key=[];
			let a1=[];
			let a2=[];
			for (let p1 in res.line) {
				if (res.line.hasOwnProperty(p1))
					key.push(Client.insertGang(p1));
				for(let i=0;i<DuibiArr.length; i++){
					if(DuibiArr[i].name==compareValue1){
						if(res.line[p1][DuibiArr[i].value]==null||res.line[p1][DuibiArr[i].value]=='NaN'){//收入
							if(DuibiArr[i].name.indexOf('率')!=-1||DuibiArr[i].name.indexOf('比')!=-1){
								this.isRate1=true;
							}else{
								this.isRate1=false;
							}
							a1.push(0)
						}else{
							if(DuibiArr[i].name.indexOf('率')!=-1||DuibiArr[i].name.indexOf('比')!=-1){
								a1.push(res.line[p1][DuibiArr[i].value]*100);
								this.isRate1=true;
							}else{
								a1.push(res.line[p1][DuibiArr[i].value]);
								this.isRate1=false;
							}
						}
					}
					if(DuibiArr[i].name==compareValue2){
						if(res.line[p1][DuibiArr[i].value]==null||res.line[p1][DuibiArr[i].value]=='NaN'){//媒体请求数
							if(DuibiArr[i].name.indexOf('率')!=-1||DuibiArr[i].name.indexOf('比')!=-1){
								this.isRate2=true;
							}else{
								this.isRate2=false;
							}
							a2.push(0)
						}else{
							if(DuibiArr[i].name.indexOf('率')!=-1||DuibiArr[i].name.indexOf('比')!=-1){
								a2.push(res.line[p1][DuibiArr[i].value]*100);
								this.isRate2=true;
							}else{
								a2.push(res.line[p1][DuibiArr[i].value]);
								this.isRate2=false;
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
	/*@Param("startDate") String startDate,
	@Param("endDate") String endDate,
	@Param("developerId")  String developerId,
	@Param("developerBody")  String developerBody,
	@Param("appId") String appId,
	@Param("appId2") String appId2,
	@Param("adType") String adType,
	@RequestParam(value = "pageNo", required = false, defaultValue = "1")int pageNo,
	@RequestParam(value = "pageSize",*/
	@action
	homePageLineChart(pageNo,pageSize,startDate,endDate,developerId,developerBody,appId,appId2,adType,compareValue1,compareValue2,callback){
		Client.getNullArgument('stat/otherMediaUvData?pageNo='+pageNo+'&pageSize='+pageSize+
			'&startDate='+startDate+'&endDate='+endDate+
			'&developerId='+developerId+'&developerBody='+developerBody+
			'&appId='+appId+'&appId2='+appId2+'&adType='+adType)
			.then(res=>{
				let key=[];
				let a1=[];
				let a2=[];
				for (let p1 in res.line) {
					if (res.line.hasOwnProperty(p1))
						key.push(Client.insertGang(p1));
					for(let i=0;i<DuibiArr.length; i++){
						if(DuibiArr[i].name==compareValue1){
							if(res.line[p1][DuibiArr[i].value]==null||res.line[p1][DuibiArr[i].value]=='NaN'){//收入
								if(DuibiArr[i].name.indexOf('率')!=-1||DuibiArr[i].name.indexOf('比')!=-1){
									this.isRate1=true;
								}else{
									this.isRate1=false;
								}
								a1.push(0)
							}else{
								if(DuibiArr[i].name.indexOf('率')!=-1||DuibiArr[i].name.indexOf('比')!=-1){
									a1.push(res.line[p1][DuibiArr[i].value]*100);
									this.isRate1=true;
								}else{
									a1.push(res.line[p1][DuibiArr[i].value]);
									this.isRate1=false;
								}
							}
						}
						if(DuibiArr[i].name==compareValue2){
							if(res.line[p1][DuibiArr[i].value]==null||res.line[p1][DuibiArr[i].value]=='NaN'){//媒体请求数
								if(DuibiArr[i].name.indexOf('率')!=-1||DuibiArr[i].name.indexOf('比')!=-1){
									this.isRate2=true;
								}else{
									this.isRate2=false;
								}
								a2.push(0)
							}else{
								if(DuibiArr[i].name.indexOf('率')!=-1||DuibiArr[i].name.indexOf('比')!=-1){
									a2.push(res.line[p1][DuibiArr[i].value]*100);
									this.isRate2=true;
								}else{
									a2.push(res.line[p1][DuibiArr[i].value]);
									this.isRate2=false;
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
const revenueEnquityStore = new RevenueEnquityStore();
export default revenueEnquityStore
