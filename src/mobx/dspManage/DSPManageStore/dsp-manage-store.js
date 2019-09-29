import { observable, action } from "mobx";
import Client from "../../../common/lead-api";
class DspManageStore {
	@observable state1 = 'no';//时段单选状态
	@observable timeDuan = [];//时段选择数组
	@observable state2 = 'no';//地域单选状态
	@observable choiceArr = [];//地域选择数组
	@observable excludeArr = [];//地域排除数组
	@observable initChoiceArr = [];//地域初始化选择数组
	@observable initExcludeArr = [];//地域初始化排除数组
	@observable value3 = [];
	@observable state4 = 'no';//
	@observable modalState4 = '';//
	@observable modalValue4 = '';//
	@observable state5 = 'no';
	@observable value5 = [];
	@observable state6 = 'no';//
	@observable modalState6 = '';//
	@observable modalValue6 = '';//
	@observable state7 = 'no';//设备单选状态
	@observable equChoiceArr = [];//设备选择数组
	@observable equExcludeArr = [];//设备排除数组
	@observable initEquChoiceArr = [];//设备初始化选择数组
	@observable initEquExcludeArr = [];//设备初始化排除数组
	@observable state8 = 'no';//
	@observable modalState8 = '';//
	@observable modalValue8 = '';//
	@action
	saveAndUpdatePretargeting(leadStrategy,callback){
		Client.createObject("dsp/saveAndUpdatePretargeting", leadStrategy).then(res=>{
			if(res.status)
				callback();
		})
	}
}
const dspManageStore = new DspManageStore();
export default dspManageStore;
