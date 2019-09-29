import React from "react";
import Layout from "../../layout/Layout";
import {Checkbox,Icon} from "antd";
import area from "../../common/euqArea";
import dspManageStore from "../../mobx/dspManage/DSPManageStore/dsp-manage-store"
import {observer} from "mobx-react";
@observer
export default class EquipmentSetCom extends React.Component {
	constructor(){
		super();
		this.state={
			area: area,
			choiceArr:dspManageStore.equChoiceArr,
			excludeArr:dspManageStore.equExcludeArr
		}
	}
	componentWillMount(){
		let arr=this.state.area;
		for(let i=0;i<arr.length;i++){
			arr[i].choiceName=arr[i].name;
			for(let j=0;j<arr[i].children.length;j++){
				arr[i].children[j].choiceName=arr[i].name+'/'+arr[i].children[j].name;
				for(let h=0;h<arr[i].children[j].children.length;h++){
					arr[i].children[j].children[h].choiceName=arr[i].name+'/'+arr[i].children[j].name+'/'+arr[i].children[j].children[h].name;
				}
			}
		}
		this.setState({
			area:arr,
		})
		this.initArea(this.state.choiceArr,'checked');
		this.initArea(this.state.excludeArr,'exclude');
	}
	componentDidMount(){
		dspManageStore.initEquChoiceArr=dspManageStore.equChoiceArr;
		dspManageStore.initEquExcludeArr=dspManageStore.equExcludeArr;
	}
	initArea(choiceArr,checked) {
		let indeterminate='indeterminate';
		if(checked=='exclude'){
			indeterminate='excludeIndeterminate';
		}
		let arr = area;
		for (let i = 0; i < arr.length; i++) {
			arr[i][checked] = false;
			let a=0;
			for (let j = 0; j < arr[i].children.length; j++) {
				arr[i].children[j][checked] = false;
				let u=0;
				for (let h = 0; h < arr[i].children[j].children.length; h++) {
					let state=false
					for(let y=0; y<choiceArr.length;y++){
						if(choiceArr[y]==arr[i].children[j].children[h].name){
							state=true;
							u++;
						}
					}
					arr[i].children[j].children[h][checked] = state;
				}
				if(u==arr[i].children[j].children.length){
					arr[i].children[j][checked]=true;
					arr[i].children[j][indeterminate]=false;
				}else if(u>0&&u<arr[i].children[j].children.length){
					arr[i].children[j][checked]=false;
					arr[i].children[j][indeterminate]=true;
				}else if(u==0){
					arr[i].children[j][checked]=false;
					arr[i].children[j][indeterminate]=false;
				}
				if(arr[i].children[j][checked]){
					a++;
				}
			}
			if(a==arr[i].children.length){
				arr[i][checked]=true;
				arr[i][indeterminate]=false;
			}else if(a>0&&a<arr[i].children.length){
				arr[i][checked]=false;
				arr[i][indeterminate]=true;
			}else if(a==0){
				arr[i][checked]=false;
				arr[i][indeterminate]=false;
			}
		}
		this.together(arr);
		this.setState({area:arr});
	}
	allRemove(){
		let arr=this.state.area;
		arr=this.initArr(arr);
		this.setState({
			area:arr,
			choiceArr:[],
			excludeArr:[]
		})
	}
	initArr(arr){
		for(let i=0;i<arr.length;i++){
			arr[i].checked=false;
			arr[i].exclude=false;
			arr[i].indeterminate=false;
			arr[i].excludeIndeterminate=false;
			arr[i].choiceName=arr[i].name;
			for(let j=0;j<arr[i].children.length;j++){
				arr[i].children[j].checked=false;
				arr[i].children[j].exclude=false;
				arr[i].children[j].indeterminate=false;
				arr[i].children[j].excludeIndeterminate=false;
				arr[i].children[j].choiceName=arr[i].name+'/'+arr[i].children[j].name;
				for(let h=0;h<arr[i].children[j].children.length;h++){
					arr[i].children[j].children[h].checked=false;
					arr[i].children[j].children[h].exclude=false;
					arr[i].children[j].children[h].choiceName=arr[i].name+'/'+arr[i].children[j].name+'/'+arr[i].children[j].children[h].name;
				}
			}
		}
		return arr;
	}
	toggle(k){
		let arr=this.state.area;
		arr[k].selected=!arr[k].selected;
		this.setState({
			area:arr
		})
	}
	toggle1(k,b){
		let arr=this.state.area;
		arr[k].children[b].selected=!arr[k].children[b].selected;
		this.setState({
			area:arr
		})
	}
	AddChecked(k){
		let arr=this.state.area;
		arr[k].indeterminate=false;
		arr[k].excludeIndeterminate=false;
		arr[k].checked=!arr[k].checked;
		arr[k].exclude=!arr[k].checked?false:false;
		for(let i=0; i<arr[k].children.length; i++){
			arr[k].children[i].checked=arr[k].checked;
			arr[k].children[i].exclude=arr[k].exclude;
			arr[k].children[i].indeterminate=false;
			arr[k].children[i].excludeIndeterminate=false;
			for(let j=0; j<arr[k].children[i].children.length;j++){
				arr[k].children[i].children[j].checked=arr[k].checked;
				arr[k].children[i].children[j].exclude=arr[k].exclude;
			}
		}
		this.together(arr);
		this.setState({
			area:arr
		})
	}
	excludeChecked(k){
		let arr=this.state.area;
		arr[k].indeterminate=false;
		arr[k].excludeIndeterminate=false;
		arr[k].exclude=!arr[k].exclude;
		arr[k].checked=!arr[k].exclude?false:false;
		for(let i=0; i<arr[k].children.length; i++){
			arr[k].children[i].exclude=arr[k].exclude;
			arr[k].children[i].checked=arr[k].checked;
			arr[k].children[i].indeterminate=false;
			arr[k].children[i].excludeIndeterminate=false;
			for(let j=0; j<arr[k].children[i].children.length;j++){
				arr[k].children[i].children[j].exclude=arr[k].exclude;
				arr[k].children[i].children[j].checked=arr[k].checked;
			}
		}
		this.together(arr);
		this.setState({
			area:arr
		})
	}
	AddCheckedSub(k,b){
		let arr=this.state.area;
		arr=this.matchSub(arr,k,b,'checked','exclude');
		arr=this.match(arr,k,'exclude','excludeIndeterminate');
		arr=this.match(arr,k,'checked','indeterminate');
		this.together(arr);
		this.setState({
			area:arr
		})
	}
	excludeCheckedSub(k,b){
		let arr=this.state.area;
		arr=this.matchSub(arr,k,b,'exclude','checked');
		arr=this.match(arr,k,'exclude','excludeIndeterminate');
		arr=this.match(arr,k,'checked','indeterminate');
		this.together(arr);
		this.setState({
			area:arr
		})
	}
	matchSub(arr,k,b,checked,exclude){
		arr[k].children[b].indeterminate=false;
		arr[k].children[b].excludeIndeterminate=false;
		arr[k].children[b][checked]=!arr[k].children[b][checked];
		arr[k].children[b][exclude]=!arr[k].children[b][checked]?false:false;
		for(let j=0;j<arr[k].children[b].children.length;j++){
			arr[k].children[b].children[j][checked]=arr[k].children[b][checked];
			arr[k].children[b].children[j][exclude]=arr[k].children[b][exclude];
		}
		return arr;
	}
	AddCheckedSubChild(k,b,d){
		let arr=this.state.area;
		arr=this.matchSubChild(arr,k,b,d,'checked','exclude')
		arr=this.matchMulti(arr,k,b,'checked','indeterminate');
		arr=this.matchMulti(arr,k,b,'exclude','excludeIndeterminate');
		arr=this.match(arr,k,'exclude','excludeIndeterminate');
		arr=this.match(arr,k,'checked','indeterminate');
		this.together(arr);
		this.setState({
			area:arr
		})
	}
	excludeCheckedSubChild(k,b,d){
		let arr=this.state.area;
		arr=this.matchSubChild(arr,k,b,d,'exclude','checked');
		arr=this.matchMulti(arr,k,b,'exclude','excludeIndeterminate');
		arr=this.matchMulti(arr,k,b,'checked','indeterminate');
		arr=this.match(arr,k,'checked','indeterminate');
		arr=this.match(arr,k,'exclude','excludeIndeterminate');
		this.together(arr);
		this.setState({
			area:arr
		})
	}
	matchSubChild(arr,k,b,d,checked,exclude){
		arr[k].children[b].children[d][checked]=!arr[k].children[b].children[d][checked];
		arr[k].children[b].children[d][exclude]=!arr[k].children[b].children[d][checked]?false:false;
		return arr;
	}
	matchMulti(arr,k,b,checked,indeterminate){
		let j=0;
		for(let i=0; i<arr[k].children[b].children.length; i++){
			if(arr[k].children[b].children[i][checked]==true){
				j++;
			}
		}
		if(j==arr[k].children[b].children.length){
			arr[k].children[b][checked]=true;
			arr[k].children[b][indeterminate]=false;
		}else{
			if(j==0){
				arr[k].children[b][indeterminate]=false;
			}else{
				arr[k].children[b][indeterminate]=true;
			}
			arr[k].children[b][checked]=false;
		}
		return arr;
	}
	match(arr,k,checked,indeterminate){
		let j=0;
		for(let i=0; i<arr[k].children.length; i++){
			if(arr[k].children[i][checked]==true){
				j++;
			}
		}
		if(j==arr[k].children.length){
			arr[k][checked]=true;
			arr[k][indeterminate]=false;
		}else{
			if(j==0){
				arr[k][indeterminate]=false;
			}else{
				arr[k][indeterminate]=true;
			}
			arr[k][checked]=false;
		}
		return arr;
	}
	backColor(checked,exclude){
		if(checked){
			return '#f4f4f4';
		}else if(exclude){
			return '#edeaed';
		}else{
			return '#fff';
		}
	}
	together(arr){
		this.choiceTerritory(arr);
		this.excludeTerritory(arr);
	}
	choiceTerritory(arr){
		let choiceArr=[];
		for(let i=0;i<arr.length;i++){
			for(let j=0;j<arr[i].children.length;j++){
				for(let h=0;h<arr[i].children[j].children.length;h++){
					if(arr[i].children[j].children[h].checked==true){
						choiceArr.push(arr[i].children[j].children[h].name);
					}
				}
			}
		}
		this.setState({choiceArr:choiceArr})
	}
	excludeTerritory(arr){
		let excludeArr=[];
		for(let i=0;i<arr.length;i++){
			for(let j=0;j<arr[i].children.length;j++){
				for(let h=0;h<arr[i].children[j].children.length;h++){
					if(arr[i].children[j].children[h].exclude==true){
						excludeArr.push(arr[i].children[j].children[h].name);
					}
				}
			}
		}
		this.setState({excludeArr:excludeArr})
	}
	removeChecked(name){
		this.removeItem(name,'checked');
	}
	removeExclude(name){
		this.removeItem(name,'exclude');
	}
	removeItem(name,checked) {
		let arr=[]
		if(checked=='checked'){
			arr=this.state.choiceArr
		}else{
			arr=this.state.excludeArr
		}
		let index=arr.indexOf(name);
		arr.splice(index,1)
		this.initArea(arr,checked)
	}
	confirm(){
		dspManageStore.equChoiceArr=this.state.choiceArr;
		dspManageStore.equExcludeArr=this.state.excludeArr;
		this.props.history.goBack()
	}
	cancel(){
		dspManageStore.equChoiceArr=dspManageStore.initEquChoiceArr;
		dspManageStore.equExcludeArr=dspManageStore.initEquExcludeArr;
		this.props.history.goBack()
		dspManageStore.initEquChoiceArr=[];
		dspManageStore.initEquExcludeArr=[];
	}
	render() {
		return (
			<div>
				<Layout history={this.props.history}/>
				<div className="content">
					<div className="contentBulk1" style={{padding:'10px'}}>
						<div style={{height:450}}>
							<div style={{width:'5%',height:450,float:'left'}}>
							</div>
							<div style={{width:'40%',height:450,float:'left'}}>
								<div className="allChoose">
								</div>
								<div className="chooseDrection">
									<span>
										名称
									</span>
									<span>
										选择 排除
									</span>
								</div>
								<div className="chooseContent">
									{this.state.area.map((i,k)=>(
										<div key={k} style={{marginBottom:10}}>
											<div className="chooseItem" style={{backgroundColor:this.backColor(i.checked,i.exclude)}}>
												<div onClick={()=>this.toggle(k)}>
													{i.children.length!=0?(i.selected?
														(<Icon type="down" theme="outlined" style={{marginRight:10}}/>):
														(<Icon type="right" theme="outlined" style={{marginRight:10}}/>)):null}
													{i.name}
												</div>
												<span>
													<Checkbox onChange={this.AddChecked.bind(this,k)} indeterminate={i.indeterminate} checked={i.checked}/>
													<Checkbox onChange={this.excludeChecked.bind(this,k)} indeterminate={i.excludeIndeterminate} checked={i.exclude}/>
												</span>
											</div>
											{i.selected?i.children.map((a,b)=>(
												<div key={b} style={{marginBottom:10}}>
													<div className="chooseItem1" style={{backgroundColor:this.backColor(a.checked,a.exclude)}}>
														<div onClick={()=>this.toggle1(k,b)}>
															{a.children.length!=0?(a.selected?
																(<Icon type="down" theme="outlined" style={{marginRight:10}}/>):
																(<Icon type="right" theme="outlined" style={{marginRight:10}}/>)):null}
															{a.name}
														</div>
														<span>
															<Checkbox onChange={this.AddCheckedSub.bind(this,k,b)} indeterminate={a.indeterminate} checked={a.checked}/>
															<Checkbox onChange={this.excludeCheckedSub.bind(this,k,b)} indeterminate={a.excludeIndeterminate} checked={a.exclude}/>
														</span>
													</div>
													{a.selected?a.children.map((c,d)=>(
														<div className="chooseItem2" key={d} style={{backgroundColor:this.backColor(c.checked,c.exclude)}}>
															<div>
																{c.name}
															</div>
															<span>
																<Checkbox onChange={this.AddCheckedSubChild.bind(this,k,b,d)} checked={c.checked}/>
																<Checkbox onChange={this.excludeCheckedSubChild.bind(this,k,b,d)} indeterminate={c.excludeIndeterminate} checked={c.exclude}/>
															</span>
														</div>
													)):null}
												</div>
											)):null}
										</div>
									))}
								</div>
							</div>
							<div style={{width:'10%',height:450,float:'left',display:'flex',alignItems:'center',justifyContent:'center'}}>
								<img src={require('../../image/zhuanhuan.png')} alt=""/>
							</div>
							<div style={{width:'40%',height:450,float:'left'}}>
								<div className="allChoose">
									<button className="typeBtn" onClick={()=>this.allRemove()}>清空</button>
								</div>
								<div className="chooseDrection">
									<span>
										选择展示
									</span>
									<span>
									</span>
								</div>
								<div className="chooseContent">
									{
										this.state.choiceArr.length!=0?(
											<div>
												已选择
											</div>
										):null
									}
									{
										this.state.choiceArr.map((i,k)=>(
											<div className="chooseItem" key={k} style={{background:'#f4f4f4'}}>
												<div>
													{i}
												</div>
												<div>
													<Icon type="close-circle" onClick={()=>this.removeChecked(i)}/>
												</div>
											</div>
										))
									}
									{
										this.state.excludeArr.length!=0?(
											<div>
												已排除
											</div>
										):null
									}
									{
										this.state.excludeArr.map((i,k)=>(
											<div className="chooseItem" key={k} style={{background:'#edeaed'}}>
												<div>
													{i}
												</div>
												<div>
													<Icon type="close-circle" onClick={()=>this.removeExclude(i)}/>
												</div>
											</div>
										))
									}
								</div>
							</div>
						</div>
					</div>
					<div className="submit-content">
						<button className="cancelBtn" onClick={this.cancel.bind(this)}>取消</button>
						<button className="confirmBtn" onClick={this.confirm.bind(this)}>
							确定
						</button>
					</div>
				</div>
			</div>
		)
	}
}
