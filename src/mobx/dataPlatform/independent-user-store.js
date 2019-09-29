import {action, observable} from "mobx";
import Client from '../../common/lead-api'
const DuibiArr=[
	{
		name:'应用DAU',
		value:'app_dau',
	},
	{
		name:'应用ARPU',
		value:'arpu',
	},
	{
		name:'媒体请求数_UV',
		value:'requests_uv',
	},
	{
		name:'ADX响应数_UV',
		value:'responses_uv',
	},
	{
		name:'响应率_UV',
		value:'requests_ratio_uv',
	},
	{
		name:'展现数_UV',
		value:'displays_uv',
	},
	{
		name:'展现率_UV',
		value:'displays_ratio_uv',
	},
	{
		name:'点击数_UV',
		value:'clicks_uv',
	},
	{
		name:'点击率_UV',
		value:'clicks_ratio_uv',
	},
	{
		name:'CPM_UV',
		value:'cpm_uv',
	},
	{
		name:'CPC_UV',
		value:'cpc_uv',
	},
	{
		name:'下载完成人数',
		value:'downloads_uv',
	},
	{
		name:'下载单价_UV',
		value:'cpd_uv',
	},
	{
		name:'安装完成人数',
		value:'installs_uv',
	},
	{
		name:'安装单价_UV',
		value:'cpi_uv',
	},
]
class IndependentUserStore {
	@observable DownloadList= [];
	@observable daysX= [];
	@observable a1= [];
	@observable a2= [];
	@observable isRate1= false;
	@observable isRate2= false;
	@observable total= 0;
	@observable storeAppArr= [];
	@observable storeOsArr= [];
	@observable storeSpaceArr= [];
	@observable storeTypeArr= [];
	@observable storeSizeArr= [];
	@action
	getIndependentUserList(pageNo,pageSize,startDate,endDate,appId,os,adType,spaceId,compareValue1,compareValue2,callback){
		let appStr=Client.returnArgument(appId);
		Client.getNullArgument('stat/mediaAuData?pageNo='+pageNo+'&pageSize='+pageSize+'&startDate='+startDate+'&endDate='+endDate+'&'+appStr+'&os='+os+'&adType='+adType+'&spaceId='+spaceId).then(res=>{
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
								this.isRate1=true;
								a1.push(res.line[p1][DuibiArr[i].value]*100);
							}else{
								this.isRate1=false;
								a1.push(res.line[p1][DuibiArr[i].value]);
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
const independentUserStore = new IndependentUserStore();
export default independentUserStore
