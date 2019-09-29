import { observable, action } from "mobx";
import Client from "../../../common/lead-api";
class FilterStrategyStore {
	@observable value1 = '';
	@observable value2 = '请选择';
	@observable value3 = '请选择';
	@observable value4 = [];
	@observable value5 = [];
	@observable text5 = [];
	@observable state5 = 'no';
	@observable value6 = '';
	@observable state6 = 'no';
	@observable dspArr = [];
	@observable strategyArr = [];
	@observable total = 0;
	@observable industryArr = [];
	@action
	getLeadDsps(){
		Client.getNullArgument('leadDsps').then(res=>{
			this.dspArr=res._embedded.leadDsps
		})
	}
	@action
	getStrategy(name,page,size){
		Client.getNullArgument("dsp/filterList?pageNo="+(page-1)+"&pageSize="+size+"&name="+name).then(res=>{
			this.strategyArr=res.content;
			this.total=res.totalElements;
		})
	}
	@action
	getIndustry() {
		Client.getNullArgument("dsp/filterCategories").then(res => {
			let arr = res
			for (let i = 0; i < arr.length; i++) {
				arr[i].selected = false;
				arr[i].checked = false;
				if (arr[i].secondary) {
					for (let j = 0; j < arr[i].secondary.length; j++) {
						arr[i].secondary[j].checked = false;
					}
				}
			}
			for(let h=0;h<this.text5.length;h++){
				for (let i = 0; i < arr.length; i++) {
					if(this.text5[h]==arr[i].desc){
						arr[i].checked = true;
					}
					if (arr[i].secondary) {
						for (let j = 0; j < arr[i].secondary.length; j++) {
							if(this.text5[h]==arr[i].secondary[j].desc){
								arr[i].secondary[j].checked = true;
							}
						}
					}
				}
			}
			this.industryArr = arr;
		})
	}
	@action
	deleteStrategy(data,callback){
		let str=Client.arrStr(data);
		Client.getNullArgument('dsp/filterDel?ids='+str).then(res=>{
			callback();
		})
	}
}
const filterStrategyStore = new FilterStrategyStore();
export default filterStrategyStore;
