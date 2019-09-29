import data from './menu';
let abc=[
	{
		name:'首页',
		sub:['/']
	},
	{
		name:'流量管理',
		sub:['/appManage','/newApp','/editApp','/adSpaceManage','/newAdSpace','/editAdSpace','/formManage','/newForm','/editForm',
			'/flowGroups','/newFlowGroups','/newFlowGroups1','/FlowDictionary']
	},
	{
		name:'天窗管理',
		sub:['/skylightManage']
	},
	{
		name:'推广支持',
		sub:['/generalizeManage','/newGeneralizeActivity','/GeneralizeMaterial','/uploadingOriginality','/editCreative']
	},
	{
		name:'打底设置',
		sub:['/renderSet']
	},
	{
		name:'DSP管理',
		sub:['/AgentsOpenAccounts','/newAgent','/EditAgent','/AdvertiserAudit','/CreativeReview']
	},
	{
		name:'财务中心',
		sub:['/Refunds','/AgentRefundsRefund','/AdvertiserRecharge']
	},
	{
		name:'账户中心',
		sub:['/personalDetails','/accountManage','/editAccount','/newAccount','/accountTypeManage','/editAccountType','/newAccountType']
	}

]
export default {
	arr1:[],
	str:'',
	carr:[],
    hhh(){
		for(let i=0; i<data.length;i++){
			data[i].index=''+i;
			if(data[i].subLinks){
				this.ppp(data[i].subLinks,i)
			}
		}
		return data;
	},
	yyy(path){
		let dataArr=this.hhh();
		for(let i=0; i<dataArr.length;i++){
			if(path==dataArr[i].path){
				this.str=dataArr[i].index;
			}
			if(dataArr[i].subLinks){
				this.nnn(dataArr[i].subLinks,path)
			}
		}

		let crr=[]
		if(this.str.indexOf('/')>-1){
			crr=this.str.split('/');
		}else{
			crr=this.str.split('');
		}

		for(let i=0; i<crr.length; i++){
			if(i==0){
				this.arr1.push(data[crr[parseInt(i)]]);
				this.carr=data[crr[parseInt(i)]];
			}else{
				this.arr1.push(this.carr.subLinks[crr[parseInt(i)]]);
				this.carr=this.carr.subLinks[crr[parseInt(i)]];
			}
		}
		return this.arr1
	},
	nnn(subLinksArr,path){
		for(let i=0; i<subLinksArr.length;i++){
			if(path==subLinksArr[i].path){
				this.str=subLinksArr[i].index
			}
			if(subLinksArr[i].subLinks){
				this.nnn(subLinksArr[i].subLinks,path)

			}
		}
	},
	ppp(data,j){
		for(let i=0; i<data.length;i++){
			data[i].index=j+'/'+i;
			if(data[i].subLinks){
				this.ppp(data[i].subLinks,j+'/'+i)

			}
		}
	},
	iii(path){
		for(let i=0;i<abc.length;i++){
			if(abc[i].sub.indexOf(path)>=0){
				return abc[i].name;
				break;
			}
		}

	}


};
