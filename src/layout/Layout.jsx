import React from 'react';
import {Icon} from "antd";
import "./Layout.css"
import Client from "../common/lead-api";
import config from "../common/config";
import data from "../common/menu";

export default class Layout extends React.Component {
	constructor(props) {
		super(props);
		this.toggle = this.toggle.bind(this);
		this.state = {
			data: data,
			name: '首页',
			navArr: [],
			navIndex:'首页',
			userName:''
		};
	}
	componentWillMount(){
		if(location.pathname!='/putInStrategyManage'&&location.pathname!='/adMapSet'&&location.pathname!='/AddPutInStrategy'&&location.pathname!='/territorySetCom'&&location.pathname!='/timeFrameCom'&&location.pathname!='/fixedBidSet'){
			localStorage.removeItem('putInPage')
		}
		if(location.pathname!='/adMapSet'){
			localStorage.removeItem('strategyId1')
		}
		if(location.pathname!='/AddPutInStrategy'&&location.pathname!='/territorySetCom1'
			&&location.pathname!='/timeFrameCom1'&&location.pathname!='/equipmentSetCom1'){
			localStorage.removeItem('strategyId')
			localStorage.removeItem('zongArr')
		};
		if(location.pathname!='/GeneralizeMaterial'&&location.pathname!='/editCreative'){
			localStorage.removeItem("allFormatState");
			localStorage.removeItem("choiceFormats");
			localStorage.removeItem("statusState");
			localStorage.removeItem("allSizeState");
			localStorage.removeItem("choiceSizes");
			localStorage.removeItem("choiceTypes");
			localStorage.removeItem("allTypeState");
			localStorage.removeItem("time");
		};
		config.arr1 = [];
		if(location.pathname!='/skylightManage' &&location.pathname!='/editAdSkylight'){
			localStorage.removeItem('editd');
			localStorage.removeItem('appd');
			localStorage.removeItem('typed');
			localStorage.removeItem('sized')
		}
		this.setState({
			navArr: config.yyy(location.pathname),
			navIndex:config.iii(location.pathname)
		})
		let history = this.props.history;
		if(localStorage.getItem('aaa')){
			if(localStorage.getItem('aaa') == 'false'){
				history.push('/loginPage');
			}
		}else{
			history.push('/loginPage');
		}
	}
	componentDidMount(){
		Client.getNullArgument('auth/currentUser').then(res=>{
			this.setState({
				userName:res.data.userName
			})
		})
	}
	aaa(name){
		this.setState({name: name})
	}
	click(name){
		let arr = this.state.data;
		for(let i = 0; i < arr.length;i++){
			if(name == arr[i].name){
				arr[i].show = true;
			}else{
				arr[i].show = false;
			}
		}
		this.setState({
			data: arr
		})
	}
	click1(name){
		let arr = this.state.data;
		for(let i = 0; i < arr[6].subLinks.length;i++){
			if(name == arr[6].subLinks[i].name){
				arr[6].subLinks[i].show = true;
			}else{
				arr[6].subLinks[i].show = false;
			}
		}
		this.setState({
			data: arr,
			name:name
		})
	}
	mouseLeave1(name){
		let arr = this.state.data;
		for(let i = 0; i < arr[6].subLinks.length;i++){
			if(name == arr[6].subLinks[i].name){
				arr[6].subLinks[i].show = false;
			}
		}
		this.setState({
			data: arr,
		})
	}
	mouseLeave(){
		let arr = this.state.data;
		for(let i = 0; i < arr.length;i++){
			arr[i].show = false;
		}
		this.setState({
			data: arr
		})
	}
	toggle() {
		this.setState({
			isOpen: !this.state.isOpen
		});
	}
	dropOut(){
		let history = this.props.history;
		this.mouseLeave();
		Client.getNullArgument('auth/logout').then(res=>{
			if(res.status == '200'){
				localStorage.removeItem('aaa', false);
				history.push('/loginPage');
			}
		})
	}
	skipSub(path){
		if(path=='/putInStrategyManage'){
			localStorage.removeItem('fallbackId')
		}
		if(path=='/logout'){
			this.dropOut()
		}else{
			this.props.history.push({pathname: path})
		}
	}
	mapSub(subLinks){
		return(
			<ul className="posi">
				{subLinks.map((i, k)=>(
					<li key={k}
						className="subli" onMouseEnter={()=>this.aaa(i.name)}
						onClick={()=>this.skipSub(i.path)}
						title={i.name}
						style={{
							whiteSpace: 'nowrap',
							overflow: 'hidden',
							textOverflow: 'ellipsis'
					}}>
						{i.name}
					</li>
				))}
			</ul>
		)
	}
	mapSub1(subLinks){
		return(
			<ul className="posi1">
				{subLinks.map((i, k)=>(
					<li key={k}
						className="subli" onMouseEnter={()=>this.aaa(i.name)}
						onClick={()=>this.skipSub(i.path)}
						title={i.name}
						style={{
							whiteSpace: 'nowrap',
							overflow: 'hidden',
							textOverflow: 'ellipsis'
						}}>
						{i.name}
					</li>
				))}
			</ul>
		)
	}
	dateMapSub(subLinks){
		return(
			<ul className="posi">
				{subLinks.map((i, k)=>(
					<li key={k}
						className="subli" onMouseEnter={()=>this.click1(i.name)}
						onMouseLeave={()=>this.mouseLeave1(i.name)}
						title={i.name}
						style={{
							background: this.state.name == i.name ? '#ccc' : '#fff',
							whiteSpace: 'nowrap',
							textOverflow: 'ellipsis',
							position:'relative'
						}}>
						{i.name}
						{i.subLinks && i.show && i.ischild? this.mapSub1(i.subLinks): null}

					</li>
				))}
			</ul>
		)
	}
	skip(path){
		if(path=='/'||path=='/skylightManage'||path=='/renderSet'){
			this.props.history.push(path);
		}
	}
	changIndex(name){
		this.setState({
			navIndex:name
		})
	}
	render() {
		return(
			<div>
				<div className='App-header'>
					<div className="wid-120">
						<div style={{width:'7%',height:50,float:'left'}}>
							<img src={require('../image/lenovologo.png')} alt="" className="logoimg"/>
						</div>
						<div className="adx fu-po">
							<img src={require('../image/logo.png')} alt=""/>
						</div>
						<ul className='float-l-ul'>
							{this.state.data.map((i, k)=>{
								return(
									<li key={k}
										className="float-l fu-po"
										style={{float:k==this.state.data.length-1?'right':'left'}}
										onClick={()=>this.changIndex(i.name)}
										onMouseLeave={()=>this.mouseLeave()} onMouseEnter={()=>this.click(i.name)}>
											<div style={{width: "100%", height: 50, color: '#fff',position:'relative'}}
												 onClick={()=>this.skip(i.path)}
											>
												{k==this.state.data.length-1?<Icon type="user"
													  style={{fontSize: 20}}/>:null}
												{k==this.state.data.length-1?this.state.userName:i.name}
												{this.state.navIndex==i.name?(
													<div style={{width:'100%',height:4,backgroundColor:'#fff',position:'absolute',left:0,bottom:0}}>
													</div>
												):null}
											</div>
										{i.subLinks && i.show && i.ischild? (i.name=='数据平台'?this.dateMapSub(i.subLinks):this.mapSub(i.subLinks) ): null}
									</li>
								)
							})}
						</ul>
					</div>
				</div>
				{
					this.props.hasNav?null:(
						<div className="nav-layout">
							<div className="nav120">
								{this.state.navArr.map((i, k)=>(
									<span key={k}
										  onClick={()=>k != this.state.navArr.length - 1 && k != 0 ? this.props.history.push({pathname: i.path}) : null}
										  style={{color: k != this.state.navArr.length - 1 && k != 0 ? '#3b92f4' : '#000', cursor: 'pointer'}}>
								{i.name + '>'}
							</span>
								))}
							</div>
						</div>
					)
				}
			</div>
		)
	}
}

