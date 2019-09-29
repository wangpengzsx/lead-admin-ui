import {action, observable} from "mobx";
import Client from '../../common/lead-api'
import { SSL_OP_PKCS1_CHECK_2 } from "constants";
class HomeStore {
	@observable mediaTitles= [];
	@observable mediaResult= [];
	@observable sellTitles= [];
	@observable sellResult= [];
	@observable captcha= false;
	@observable todayTime= [];
	@observable yesteTime= [];
	@observable sevenTime= [];
	@observable topPandect= [];
	@observable daysX= [];
	@observable a1= [];
	@observable a2= [];
	@observable a3= [];
	@observable a4= [];
	@observable a5= [];
	@observable a6= [];
	@observable a7= [];
	@observable a8= [];
	@action
	getOverviewMedia(startDate,endDate){
		Client.getNullArgument('stat/getAppDatas?startDate='+startDate+'&endDate='+endDate).then(res=>{
			this.mediaResult=res;
		})
	}
	@action
	getOverviewSell(startDate,endDate){
		Client.getNullArgument('stat/getChannelDatas?startDate='+startDate+'&endDate='+endDate).then(res=>{
			this.sellResult=res;
		})
	}
	@action
	homePageLineChart(startDate,endDate,channelType,appId,callback){
		Client.getNullArgument('stat/homePageLineChart?startDate='+startDate+'&endDate='+endDate+'&channelType='+channelType+'&appId='+appId).then(res=>{
			let key=[];
			let a1=[];
			let a2=[];
			let a3=[];
			let a4=[];
			let a5=[];
			let a6=[];
			let a7=[];
			let a8=[];
			for (let p1 in res.line) {
				if (res.line.hasOwnProperty(p1)){
					key.push(Client.insertGang(p1));
				}
				a1.push(0);
				if(res.line[p1].requests==null){
					a2.push(0)
				}else{
					a2.push(res.line[p1].requests);
				}
				a3.push(0);
				if(res.line[p1].displays==null){
					a4.push(0)
				}else{
					a4.push(res.line[p1].displays);
				}
				if(res.line[p1].clicks==null){
					a5.push(0)
				}else{
					a5.push(res.line[p1].clicks);
				}
				a6.push(0);
				a7.push(0);
				if(res.line[p1].ctr==null){
					a8.push(0)
				}else{
					a8.push(res.line[p1].ctr);
				}
			}
			this.daysX=key;
			this.a1=a1;
			this.a2=a2;
			this.a3=a3;
			this.a4=a4;
			this.a5=a5;
			this.a6=a6;
			this.a7=a7;
			this.a8=a8;
			let arr=[
				{
					name:'总收入',
					num:Client.toThousands(res.tal.income)
				},
				{
					name:'总请求',
					num:Client.toThousands(res.tal.requests),
				},
				{
					name:'总响应',
					num:Client.toThousands(res.tal.responses),
				},
				{
					name:'响应率',
					num:Client.addRate(res.tal.response_rate)
				},
				{
					name:'总曝光',
					num:Client.toThousands(res.tal.displays),
				},
				{
					name:'填充率',
					num:Client.addRate(res.tal.filling_rate),
				},
				{
					name:'总点击',
					num:Client.toThousands(res.tal.clicks)
				},
				{
					name:'CTR',
					num:Client.addRate(res.tal.ctr)
				},
				{
					name:'CPM',
					num:Client.toThousands(res.tal.cpm)
				},
				{
					name:'CPC',
					num:Client.toThousands(res.tal.cpc)
				}
			]
			this.topPandect=arr;
			callback();
		})
	}
	@action
	getOverview(days){
		Client.getleadArr('statistics/overview',{days:days}).then(res=>{
			let todayTime=new Date().getTime();
			let yesteTime=todayTime-1*24*60*60*1000;
			let sevenTime=todayTime-7*24*60*60*1000;
			this.todayTime=res.result[Client.formatDate(todayTime)];
			this.yesteTime=res.result[Client.formatDate(yesteTime)];
			this.sevenTime=res.result[Client.formatDate(sevenTime)];
		})
	}
}
const homeStore = new HomeStore();
export default homeStore
