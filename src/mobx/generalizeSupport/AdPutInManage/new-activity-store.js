import {observable} from "mobx";
class NewActivityStore {
	@observable actName= '';
	@observable actTerminal= 'APP';
	@observable adType= '';
	@observable dealType= '';
	@observable actDealList= [];
	@observable dayBudgetState= 'NO';
	@observable dayBudget= '';
	@observable useUpType= 'QUICK';
	@observable networkState= 'NO';
	@observable network= [];
	@observable operatorState= 'NO';
	@observable operators= [];
	@observable activePrice= '';
	@observable dayPvState= 'NO';
	@observable dayPv= '';
	@observable dayCvState= 'NO';
	@observable dayCv= '';
	@observable mediaState= 'no';
	@observable mediaValue= [];
	@observable mediaLabelValue= [];
	@observable dealArr= [];
}
const newActivityStore = new NewActivityStore();
export default newActivityStore
