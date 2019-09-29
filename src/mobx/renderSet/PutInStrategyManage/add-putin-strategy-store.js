import {observable} from "mobx";
class AddPutInStrategyStore {
	@observable value1= '请选择';
	@observable value2= '';
	@observable value3= '请选择';
	@observable value4= [];
	@observable state1= 'no';
	@observable inputValue= '';
	@observable state5= 'no';
	@observable modalState5= '';
	@observable value5= '';
	@observable state6= 'no';
	@observable modalState6= '';
	@observable value6= '';
	@observable dateState= 'no';
	@observable startTime= '';
	@observable endTime= '';
	@observable excludeDates= [];
}
const addPutInStrategyStore = new AddPutInStrategyStore();
export default addPutInStrategyStore
