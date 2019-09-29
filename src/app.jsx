import React from "react";
import {observer} from "mobx-react";
import './styles/index.scss';
import './styles/antd.css';
import "./styles/common.css";
import {Spin} from "antd";
import $ from "jquery";
import Home from "./view/home/Home";
import Login from "./view/Login/Login";

import AccountTypeManage from "./view/accountCenter/accountTypeManage/AccountTypeManage";
import EditAccountType from "./view/accountCenter/accountTypeManage/EditAccountType";
import NewAccountType from "./view/accountCenter/accountTypeManage/NewAccountType";
import NewAccount from "./view/accountCenter/accountManage/NewAccount";
import EditAccount from "./view/accountCenter/accountManage/EditAccount";
import AccountCenter from "./view/accountCenter/AccountCenter";
import AccountManage from "./view/accountCenter/accountManage/AccountManage";

import DealManage from "./view/DSPManage/DealManage/DealManage";
import NewDeal from "./view/DSPManage/DealManage/NewDeal";
import DSPAccountManage from './view/DSPManage/DSPAccountManage/DSPAccountManage'
import FlowReserveSet from './view/DSPManage/DSPAccountManage/FlowReserveSet'
import EditAgent from './view/DSPManage/DSPAccountManage/editagent'
import FilterStrategy from './view/DSPManage/FilterStrategy/FilterStrategy'
import NewFilterStrategy from './view/DSPManage/FilterStrategy/NewFilterStrategy'
import PersonalDetails from "./view/accountCenter/personalDetails/PersonalDetails";

import RenderSet from "./view/renderSet/renderAdmanage/RenderSet";
import PutInStrategyManage from "./view/renderSet/putInStrategyManage/PutInStrategyManage";
import AddPutInStrategy from "./view/renderSet/putInStrategyManage/AddPutInStrategy";
import RenderAdIncomeManage from "./view/renderSet/renderAdIncomeManage/RenderAdIncomeManage";
import NewTask from "./view/renderSet/renderAdIncomeManage/NewTask";
import PreviewTask from "./view/renderSet/renderAdIncomeManage/PreviewTask";
import TimeFrameCom from "./view/renderSet/putInStrategyManage/component/TimeFrameCom";
import TimeFrameCom1 from "./view/common/TimeFrameCom";
import TerritorySetCom from "./view/renderSet/putInStrategyManage/component/TerritorySetCom";
import TerritorySetCom1 from "./view/common/TerritorySetCom";
import EquipmentSetCom from "./view/renderSet/putInStrategyManage/component/EquipmentSetCom";
import EquipmentSetCom1 from "./view/common/EquipmentSetCom";
import IndustryCom from "./view/common/IndustryCom";
import FixedBidSet from "./view/renderSet/putInStrategyManage/FixedBidSet";
import AdMapSet from "./view/renderSet/putInStrategyManage/AdMapSet";

import AdSpaceManage from "./view/mediaManage/AdSpaceManage/AdSpaceManage";
import NewAdSpace from "./view/mediaManage/AdSpaceManage/NewAdSpace";
import EditAdSpace from "./view/mediaManage/AdSpaceManage/EditAdSpace";

import FormManage from "./view/mediaManage/FormManage/FormManage";
import NewForm from "./view/mediaManage/FormManage/NewForm";
import EditForm from "./view/mediaManage/FormManage/EditForm";

import SkylightManage from "./view/skylightManage/SkylightManage";
import EditAdSkylight from "./view/skylightManage/EditAdSkylight";
import NewSky from './view/skylightManage/newSky';

import AppManage from "./view/mediaManage/AppManage/AppManage";
import NewApp from "./view/mediaManage/AppManage/NewApp";
import EditApp from "./view/mediaManage/AppManage/EditApp";
import FlowGroups from "./view/mediaManage/flowGroups/FlowGroups";
import NewFlowGroups from "./view/mediaManage/flowGroups/NewFlowGroups";
import FlowDictionary from "./view/mediaManage/flowGroups/FlowDictionary";

import AdPermissionSet from "./view/mediaManage/OtherMediaManage/AdPermissionSet";
import AdBillingSet from "./view/mediaManage/OtherMediaManage/AdBillingSet";
import MediaTypeManage from "./view/mediaManage/OtherMediaManage/MediaTypeManage";

import AdPutInManage from "./view/GeneralizeSupport/AdPutInManage/AdPutInManage";
import PlanList from "./view/GeneralizeSupport/AdPutInManage/PlanList";
import ActivityList from "./view/GeneralizeSupport/AdPutInManage/ActivityList";
import CreativityList from "./view/GeneralizeSupport/AdPutInManage/CreativityList";
import NewDsp from "./view/GeneralizeSupport/AdPutInManage/NewDsp";
import NewPlan from "./view/GeneralizeSupport/AdPutInManage/NewPlan";
import NewActivity from "./view/GeneralizeSupport/AdPutInManage/NewActivity";
import NewCreativity from "./view/GeneralizeSupport/AdPutInManage/NewCreativity";
import NewGeneralizeActivity from "./view/GeneralizeSupport/GeneralizeManage/NewGeneralizeActivity";
import GeneralizeManage from "./view/GeneralizeSupport/GeneralizeManage/GeneralizeManage";
import GeneralizeMaterial from "./view/GeneralizeSupport/GeneralizeMaterial/GeneralizeMaterial";
import UploadingOriginality from "./view/GeneralizeSupport/GeneralizeMaterial/UploadingOriginality";
import NativeCreative from "./view/GeneralizeSupport/GeneralizeMaterial/NativeCreative";
import EditCreative from "./view/GeneralizeSupport/GeneralizeMaterial/EditCreative";
import NewAgent from "./view/DSPManage/DSPAccountManage/NewAgent";

import AdvertiserAudit from './view/DSPManage/AdvertiserAudit/AdvertiserAudit';
import Creativereview from './view/DSPManage/creativityAudit/Creativereview';

import Refunds from './view/finance/APIDSP/Refunds.js';
import FinancialRecords from './view/finance/APIDSP/FinancialRecords';
// import AgentsConsumeWater from './view/finance/Agent_unused/AgentsConsumeWater';
// import AgentRefundsRefund from './view/finance/Agent_unused/AgentRefundsRefund';
// import FinancialRecordsOfAgents from './view/finance/Agent_unused/FinancialRecordsOfAgents';
// import AdvertiserRecharge from './view/finance/Advertiser_unused/AdvertiserRecharge';
// import AdvertisersFinancialRecords from './view/finance/Advertiser_unused/AdvertisersFinancialRecords';
// import AdvertisersConsumeWater from './view/finance/Advertiser_unused/AdvertisersConsumeWater';
import OMFMange from './view/finance/OtherMediaFinanceManage/OMFMange';

import MediaIncomeAnalyze from './view/dataPlatform/mediaStatement/MediaIncomeAnalyze';
import IndependentUser from './view/dataPlatform/mediaStatement/IndependentUser'
import RevenueEnquiry from './view/dataPlatform/mediaStatement/RevenueEnquiry'
import ChannelRevenue from './view/dataPlatform/channelStatement/ChannelRevenue'
import APIDSP from './view/dataPlatform/channelStatement/APIDSP'
import BottomingAds from './view/dataPlatform/channelStatement/BottomingAds'
import PromotionSupport from './view/dataPlatform/channelStatement/PromotionSupport'
import SkyAd from './view/dataPlatform/channelStatement/SkyAd'
import PutInEffect from './view/dataPlatform/putInStatement/PutInEffect'
import HourDimensionality from './view/dataPlatform/putInStatement/HourDimensionality'
import TerritoryDimensionality from './view/dataPlatform/putInStatement/TerritoryDimensionality'

import {BrowserRouter , Route,hashHistory} from  "react-router-dom";
@observer
export default class App extends React.Component {
	remove(){
		$('#tank').fadeOut();
	}
	render() {
		return (
			<div>
				<BrowserRouter history={hashHistory} >
					<div >
						<Spin id='reload' size="large" tip="Loading..." ></Spin>
						<div  id='tank'>
							<img src={require('./image/sucess.png')} alt="" className="sucImg"/>
							<img src={require('./image/error.png')} alt="" className="sucImg2"/>
							<span id="tankText"></span>
							<span className="shanchu" onClick={()=>this.remove()}>×</span>
						</div>

						<Route exact path="/" component={Home} />
						<Route path="/loginPage" component={Login} />
						<Route path="/accountTypeManage" component={AccountTypeManage} />
						<Route path="/editAccountType" component={EditAccountType} />
						<Route path="/newAccountType" component={NewAccountType} />
						<Route path="/accountCenter" component={AccountCenter} />
						<Route path="/accountManage" component={AccountManage} />
						<Route path="/putInEffect" component={PutInEffect} />
						<Route path="/hourDimensionality" component={HourDimensionality} />
						<Route path="/territoryDimensionality" component={TerritoryDimensionality} />

						<Route path="/dealManage" component={DealManage} />
						<Route path="/newDeal" component={NewDeal} />
						<Route path="/editDeal" component={NewDeal} />
						<Route path="/DSPAccountManage" component={DSPAccountManage}/>
						<Route path="/filterStrategy" component={FilterStrategy}/>
						<Route path="/newFilterStrategy" component={NewFilterStrategy}/>
						<Route path="/flowReserveSet" component={FlowReserveSet}/>
						<Route path="/EditAgent" component={EditAgent}/>
						<Route path="/newAgent" component={NewAgent}/>
						<Route path="/personalDetails" component={PersonalDetails} />
						<Route path="/newAccount" component={NewAccount} />
						<Route path="/editAccount" component={EditAccount} />
						<Route path="/appManage" component={AppManage} />
						<Route path="/newApp" component={NewApp} />
						<Route path="/editApp" component={EditApp} />

						<Route path="/adPermissionSet" component={AdPermissionSet} />
						<Route path="/adBillingSet" component={AdBillingSet} />
						<Route path="/mediaTypeManage" component={MediaTypeManage} />

						<Route path="/adSpaceManage" component={AdSpaceManage} />
						<Route path="/newAdSpace" component={NewAdSpace} />
						<Route path="/editAdSpace" component={EditAdSpace} />

						<Route path="/formManage" component={FormManage} />
						<Route path="/newForm" component={NewForm} />
						<Route path="/editForm" component={EditForm} />
						<Route path="/skylightManage" component={SkylightManage} />
						<Route path="/editAdSkylight" component={EditAdSkylight} />
						<Route path="/newSky" component={NewSky} />
						<Route path="/flowGroups" component={FlowGroups} />
						<Route path="/newFlowGroups" component={NewFlowGroups} />
						<Route path="/newFlowGroups1" component={NewFlowGroups} />
						<Route path="/flowDictionary" component={FlowDictionary} />
						<Route path="/adPutInManage" component={AdPutInManage} />
						<Route path="/planList" component={PlanList} />
						<Route path="/activityList" component={ActivityList} />
						<Route path="/creativityList" component={CreativityList} />
						<Route path="/newDsp" component={NewDsp} />
						<Route path="/newPlan" component={NewPlan} />
						<Route path="/newActivity" component={NewActivity} />
						<Route path="/newCreativity" component={NewCreativity} />
						<Route path="/newGeneralizeActivity" component={NewGeneralizeActivity} />
						<Route path="/generalizeManage" component={GeneralizeManage} />
						<Route path="/generalizeMaterial" component={GeneralizeMaterial} />
						<Route path="/uploadingOriginality" component={UploadingOriginality} />
						<Route path="/nativeCreative" component={NativeCreative} />

                        <Route path="/AdvertiserAudit" component={AdvertiserAudit}/>
						<Route path="/Creativereview" component={Creativereview}/>

						<Route path="/renderSet" component={RenderSet} />
						<Route path="/putInStrategyManage" component={PutInStrategyManage} />
						<Route path="/addPutInStrategy" component={AddPutInStrategy} />
						<Route path="/renderAdIncomeManage" component={RenderAdIncomeManage} />
						<Route path="/newTask" component={NewTask} />
						<Route path="/previewTask" component={PreviewTask} />

						<Route path="/timeFrameCom" component={TimeFrameCom} />
						<Route path="/timeFrameCom1" component={TimeFrameCom1} />
						<Route path="/territorySetCom" component={TerritorySetCom} />
						<Route path="/territorySetCom1" component={TerritorySetCom1} />
						<Route path="/equipmentSetCom" component={EquipmentSetCom} />
						<Route path="/equipmentSetCom1" component={EquipmentSetCom1} />
						<Route path="/industryCom" component={IndustryCom} />
						<Route path="/fixedBidSet" component={FixedBidSet} />
						<Route path="/adMapSet" component={AdMapSet} />


						<Route path="/Refunds" component={Refunds}/>
						<Route path="/FinancialRecords" component={FinancialRecords}/>
						{/*<Route path="/AgentRefundsRefund" component={AgentRefundsRefund}/>
						<Route path="/FinancialRecordsOfAgents" component={FinancialRecordsOfAgents}/>
						<Route path="/AgentsConsumeWater" component={AgentsConsumeWater}/>
						<Route path="/AdvertiserRecharge" component={AdvertiserRecharge}/>
						<Route path="/AdvertisersFinancialRecords" component={AdvertisersFinancialRecords}/>
						<Route path="/AdvertisersConsumeWater" component={AdvertisersConsumeWater}/>*/}
						<Route path="/oMFMange" component={OMFMange}/>
						<Route path="/editCreative" component={EditCreative}/>
						<Route path="/mediaIncomeAnalyze" component={MediaIncomeAnalyze}/>
						<Route path="/independentUser" component={IndependentUser}/>
                        <Route path="/revenueEnquiry" component={RevenueEnquiry}/>
						<Route path="/channelRevenue" component={ChannelRevenue}/>
						<Route path="/aPIDSP" component={APIDSP}/>
						<Route path="/bottomingAds" component={BottomingAds}/>
						<Route path="/promotionSupport" component={PromotionSupport}/>
						<Route path="/skyAd" component={SkyAd}/>
					</div>
				</BrowserRouter>
			</div>
		)
	}
}
