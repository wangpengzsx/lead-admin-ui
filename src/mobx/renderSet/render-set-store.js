import {action, observable} from "mobx";
import Client from '../../common/lead-api'
const DuibiArr=[
	{name:'请求数',value:'requests'},
	{name:'响应数',value:'responses'},
	{name:'响应率',value:'response_rate'},
	{name:'曝光数',value:'displays'},
	{name:'曝光率',value:'display_rate'},
	{name:'点击数',value:'clicks'},
	{name:'CTR',value:'ctr'},
	{name:'CPM',value:'cpm'},
	{name:'CPC',value:'cpc'},
	{name:'收入',value:'income'},
]
class RenderSetStore {
	@observable FallbackDsps= [];
	@observable FallbackDspAfter= [];
	@observable captcha= false;
	@observable juxiao= [];
	@observable baidu= [];
	@observable guandian= [];
	@observable days= [];
	@observable selectArr= [];
	@observable lineKeyArr= [];
	@observable lineDataArr= [];
	@observable stripKeyArr= [];
	@observable stripDataArr1= [];
	@observable stripDataArr2= [];
	@observable checkedNameArr= [];
	@observable FallbackList= [];
	@observable FallbackCheckArr= [];
	@observable FallbackDefCheckArr= [];
	@action
	getLeadFallbackDsps(startDate,endDate,callback){
		Client.getNullArgument('dsp/fallBackDspData?startDate='+startDate+'&endDate='+endDate+'&fallBackName=').then(res=>{
			let key=[];
			let data=[];
			for (let p1 in res.line) {
				if (res.line.hasOwnProperty(p1))
					key.push(Client.insertGang(p1));
				data.push(res.line[p1]);
			}
			this.lineKeyArr=key;
			this.lineDataArr=data;
			this.FallbackList=res.list;
			if(callback){
				callback();
			}
		})
	}
	@action
	getLeadFallbackEcharts(startDate,endDate,radioValue,compareValue,callback){
		Client.getNullArgument('dsp/fallBackDspData?startDate='+startDate+'&endDate='+endDate+'&fallBackName=').then(res=>{
			let checkArr=[];
			for(let i=0; i<res.list.length-1;i++){
				checkArr.push({value:res.list[i].fallback_id,label:res.list[i].fallback_name});
			}
			this.FallbackCheckArr=checkArr
			let checkedArr=[];
			let checkedName=[];
			if(radioValue.length==0){
				checkedArr=[checkArr[0].value,checkArr[1].value]
				checkedName=[this.compareName(checkArr,checkArr[0].value),this.compareName(checkArr,checkArr[1].value)]
			}else{
				checkedArr=radioValue;
				if(radioValue.length==1){
					checkedName=[this.compareName(checkArr,radioValue[0])]
				}else{
					checkedName=[this.compareName(checkArr,radioValue[0]),this.compareName(checkArr,radioValue[1])]
				}
			}
			let stripData1=[]
			let stripData2=[]
			if(checkedArr.length==1){
				stripData1=this.exportArr(checkedArr,res.histogram,0,compareValue)
				stripData2=[];
			}else{
				stripData1=this.exportArr(checkedArr,res.histogram,0,compareValue)
				stripData2=this.exportArr(checkedArr,res.histogram,1,compareValue)
			}
			this.checkedNameArr=checkedName;
			this.stripKeyArr=this.exportKey(res.histogram);
			this.stripDataArr1=stripData1;
			this.stripDataArr2=stripData2;
			if(callback){
				callback(checkArr);
			}
		})
	}
	compareName(checkArr,id){
		for(let i=0;i<checkArr.length;i++){
			if(id==checkArr[i].value){
				return checkArr[i].label;
			}
		}
	}
	exportKey(histogram){
		let stripKey=[];
		for (let p1 in histogram) {
			if (histogram.hasOwnProperty(p1))
				stripKey.push(Client.insertGang(p1));
		}
		return stripKey
	}
	exportArr(checkedArr,histogram,index,compareValue){
		let stripData1=[];
		for (let p1 in histogram) {
			if(histogram[p1].length==0){
				stripData1.push(0)
			}else{
				let aaa=true;
				for(let j=0; j<histogram[p1].length; j++){
					if(checkedArr[index]==histogram[p1][j].fallback_id){
						for(let i=0;i<DuibiArr.length; i++) {
							if (DuibiArr[i].name == compareValue) {
								stripData1.push(histogram[p1][j][DuibiArr[i].value])
								aaa=false;
							}
						}
					}
				}
				if(aaa){
					stripData1.push(0);
				}
			}
		}
		return stripData1
	}
	@action
	geFallbackDsp(){
		Client.getNullArgument('statistics/fallbackDsp').then(res=>{
			this.FallbackDspAfter=res.result;
		})
	}
	@action
	getFallbackDspDay(){
		Client.getNullArgument('statistics/fallbackDspDay').then(res=>{
			let arr=res.titles;
			arr.splice(0,1);
			arr.splice(1,1);
			arr.splice(2,1);
			this.selectArr=arr;
			let baidu=[],guandian=[],juxiao=[],days=[];
			for(let i=0; i<res.result.length; i++){
				if(days.indexOf(res.result[i].statDate)<0){
					days.push(res.result[i].statDate);
				}
				if(res.result[i].name=='百度'){
					baidu.push(res.result[i]);
				}
				if(res.result[i].name=='广点通'){
					guandian.push(res.result[i]);
				}
				if(res.result[i].name=='聚效'){
					juxiao.push(res.result[i]);
				}
			}
			for(let i=0; i<days.length; i++){
				if(i%2==0){
					days[i]='\n'+days[i];
				}
			}
			this.days=days;
			this.baidu=baidu;
			this.juxiao=juxiao;
			this.guandian=guandian;
		})
	}
	@action
	changeLeadFallbackDsps(state,arr){
		Client.getNullArgument('dsp/updateFallDspState?state='+state+'&ids='+arr.join()).then(res=>{})
	}
}
const renderSetStore = new RenderSetStore();
export default renderSetStore
