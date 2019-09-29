import {action, observable} from "mobx";
import Client from '../../../common/lead-api'
class RefundStore {
	@observable leadDsps= [];
	@observable leadFinances= [];
	@observable total= 0;
	@observable leadDsptotal= 0;
	@observable DspNameArr = [];
	@action
	getAllDspName(){
		Client.getleadArr('leadDsps/search/spec',{query:'name==**'}).then(res=>{
			this.DspNameArr=res._embedded.leadDsps;
		})
	}
	@action
	searchItem(name,page,size){
		Client.getleadArr("leadDsps/search/spec", {query:'name==*'+name+'*',page:page-1,size:size}).then(res=>{
			this.leadDsps=res._embedded.leadDsps;
			this.leadDsptotal=res.page.totalElements;
		})
	}
	@action
	searchAccount(id,type,time,page,size){
		if(id==''&&type==''&&time==''){
			Client.getleadArr("leadFinances",{page:page-1,size:size}).then(res=>{
				this.leadFinances=res._embedded.leadFinances;
				this.total=res.page.totalElements;
			})
		}else{
			let str=''
			if(id!=''&&type==''&&time==''){
				str='leadDsp=in=(id:'+id+')'
			}else if(id==''&&type!=''&&time==''){
				str='adFinaceType=='+type
			}else if(id==''&&type==''&&time!=''){
				str='createTime=day='+time
			}else if(id!=''&&type!=''&&time==''){
				str='leadDsp=in=(id:'+id+');adFinaceType=='+type
			}else if(id==''&&type!=''&&time!=''){
				str='adFinaceType=='+type+';createTime=day='+time
			}else if(id!=''&&type==''&&time!=''){
				str='leadDsp=in=(id:'+id+');createTime=day='+type
			}else if(id!=''&&type!=''&&time!=''){
				str='leadDsp=in=(id:'+id+');adFinaceType=='+type+';createTime=day='+time
			}
			Client.getleadArr("leadFinances/search/spec", {query:str,page:page-1,size:size}).then(res=>{
				this.leadFinances=res._embedded.leadFinances;
				this.total=res.page.totalElements;
			})
		}
	}
	@action
	rechargeDsp(data){
		Client.createObject("finance/saveFinance", data).then(res=>{
		})
	}
}
const refundStore = new RefundStore();
export default refundStore
