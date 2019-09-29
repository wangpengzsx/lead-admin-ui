import React from "react";
import Layout from "../../../../layout/Layout";
import {Checkbox} from "antd";
export default class TimeFrameCom extends React.Component {
	constructor(){
		super();
		this.state={
			timeArr:this.initNoState(),
			allTimeState:false,
		}
	}
	componentWillMount(){
		let arr=localStorage.getItem('timeDuan')?JSON.parse(localStorage.getItem('timeDuan')):[]
		this.initHasState(arr);
	}
	initNoState(){
		let arr=[];
		for(let i=1;i<8;i++){
			let obj={
				name:'星期'+this.numToChar(i-1),
				state:false,
				value:String(i),
				hours:[]
			}
			for(let j=0;j<24;j++){
				let ccc={
					name:String(j),
					start:j,
					end:j+1,
					state:false,
					value:String(i)+j,
					tDuan:this.aaa(j)
				}
				obj.hours.push(ccc);
			}
			arr.push(obj);
		}
		return arr;
	}
	initHasState(wenDuan){
		let arr=this.state.timeArr;
		for(let i=0;i<arr.length;i++){
			for(let b=0;b<wenDuan.length;b++){
				if(wenDuan[b].name==arr[i].name){
					for(let h=0;h<wenDuan[b].duan.length;h++){
						for(let j=0;j<arr[i].hours.length;j++){
							let name=parseInt(arr[i].hours[j].name);
							let startTime=parseInt(wenDuan[b].duan[h].split('~')[0].slice(0,2));
							let endTime=parseInt(wenDuan[b].duan[h].split('~')[1].slice(0,2));
							if(name>=startTime&&name<endTime)
								arr[i].hours[j].state=true;
						}
					}
				}
			}
		}
		localStorage.setItem('initArr',JSON.stringify(arr));
		this.setState({
			timeArr:arr,
		})
	}
	aaa(j){
		return this.add(j)+":00~"+this.add(j+1)+":00"
	}
	add(j){
		if(j<10){
			j="0"+j;
		}
		return j;
	}
	onAllTimeChange(e){
		let arr=this.state.timeArr;
		arr=this.forArr(arr,e.target.checked);
		this.setState({timeArr:arr,allTimeState:e.target.checked})
	}
	forArr(arr,state){
		for(let i=0;i<arr.length;i++){
			for(let j=0;j<arr[i].hours.length;j++){
				arr[i].hours[j].state=state;
			}
		}
		return arr;
	}
	onDayTimeChange(e,value){
		let arr=this.state.timeArr;
		for(let i=0;i<arr.length;i++){
			if(arr[i].value==value){
				arr[i].state=e.target.checked;
				for(let j=0;j<arr[i].hours.length;j++){
					arr[i].hours[j].state=e.target.checked;
				}
			}
		}
		this.setState({
			timeArr:arr
		})
	}
	hourMap(arr){
		return arr.map((i,k)=> (<i style={{background:i.state?'#dfe9fd':'#fff'}} key={k} onClick={()=>this.OneClick(i.state,i.value)}>{i.name}</i>))
	}
	OneClick(state,value){
		let na=value.slice(0,1);
		let arr=this.state.timeArr;
		for(let i=0;i<arr.length;i++){
			if(na==arr[i].value){
				for(let j=0;j<arr[i].hours.length;j++){
					if(value==arr[i].hours[j].value){
						arr[i].hours[j].state=!state;
					}
				}
			}
		}
		this.setState({
			timeArr:arr
		})
	};
	onDuanChange(e,start,end){
		let arr=this.state.timeArr;
		for(let i=0;i<arr.length;i++){
			for(let j=start;j<end;j++){
				arr[i].hours[j].state=e.target.checked;
			}
		}
		this.setState({
			timeArr:arr
		})
	}
	duanState(start,end){
		let arr=this.state.timeArr;
		let aaa=true
		for(let i=0;i<arr.length;i++){
			for(let j=start;j<end;j++){
				if(arr[i].hours[j].state==false){
					aaa=false;
				}
			}
		}
		return aaa;
	}
	rowState(index){
		let arr=this.state.timeArr;
		let aaa=true
		for(let j=0;j<arr[index].hours.length;j++){
			if(arr[index].hours[j].state==false){
				aaa=false;
			}
		}
		return aaa;
	}
	strSlice(str){
		return str.slice(0,5)+'~'+str.slice(str.length-5)
	}
	numToChar(i){
		let arr=['一','二','三','四','五','六','日'];
		return arr[i];
	}
	backTimeDuan(){
		let arr=this.state.timeArr;
		let aaa=[];
		for(let i=0;i<arr.length;i++){
			let ccc=[];
			let str='';
			let shiStr=[];
			for(let j=0;j<arr[i].hours.length;j++){
				if(arr[i].hours[j+1]){
					if(arr[i].hours[j].state==true&&arr[i].hours[j].end==arr[i].hours[j+1].start){
						str+=arr[i].hours[j].tDuan
					}
				}else{
					if(arr[i].hours[j].state==true&&j==23){
						str+=arr[i].hours[j].tDuan
					}
				}
				if(arr[i].hours[j].state==false||j==23){
					if(str!=''){
						str=this.strSlice(str);
						ccc.push(str);
					}
					str='';
				}
				if(arr[i].hours[j].state==true){
					shiStr.push(arr[i].hours[j].name);
				}
			}
			let obj={
				name:'星期'+this.numToChar(i),
				duan:ccc,
				DuanArr:shiStr
			}
			if(ccc.length>0) aaa.push(obj);
		}
		return aaa;
	}
	confirm(){
		this.props.history.push({
			pathname:'/AddPutInStrategy',
			timeDuan:this.backTimeDuan()
		})
		localStorage.setItem('timeDuan',JSON.stringify(this.backTimeDuan()));
	}
	cancelbackTimeDuan(){
		let arr=localStorage.getItem('initArr')?JSON.parse(localStorage.getItem('initArr')):[];
		let aaa=[];
		for(let i=0;i<arr.length;i++){
			let ccc=[];
			let str='';
			let shiStr=[];
			for(let j=0;j<arr[i].hours.length;j++){
				if(arr[i].hours[j+1]){
					if(arr[i].hours[j].state==true&&arr[i].hours[j].end==arr[i].hours[j+1].start){
						str+=arr[i].hours[j].tDuan
					}
				}else{
					if(arr[i].hours[j].state==true&&j==23){
						str+=arr[i].hours[j].tDuan
					}
				}
				if(arr[i].hours[j].state==false||j==23){
					if(str!=''){
						str=this.strSlice(str);
						ccc.push(str);
					}
					str='';
				}
				if(arr[i].hours[j].state==true){
					shiStr.push(arr[i].hours[j].name);
				}
			}
			let obj={
				name:'星期'+this.numToChar(i),
				duan:ccc,
				DuanArr:shiStr
			}
			if(ccc.length>0) aaa.push(obj);
		}
		return aaa;
	}
	backSet(){
		this.props.history.push({
			pathname:'/AddPutInStrategy',
			timeDuan:this.cancelbackTimeDuan()
		})
		localStorage.setItem('timeDuan',JSON.stringify(this.cancelbackTimeDuan()));
		localStorage.removeItem('initArr')
	}
	render() {
		return (
			<div>
				<Layout history={this.props.history}/>
				<div className="content">
					<div className="contentBulk1" style={{padding:'10px'}}>
						<table className="tab-cont" style={{width:'100%'}}>
							<thead>
								<tr>
									<th width="4%">
										<Checkbox onChange={(e)=>this.onAllTimeChange(e)}
												  checked={this.duanState(0,24)}
												  ></Checkbox>
									</th>
									<th width="4%">
										日期
									</th>
									<th width="20%">
										<Checkbox onChange={(e)=>this.onDuanChange(e,0,6)}
												  checked={this.duanState(0,6)}
												  style={{marginRight:20,width:140}}>00:00~06:00</Checkbox>
									</th>
									<th width="20%">
										<Checkbox onChange={(e)=>this.onDuanChange(e,6,12)}
												  checked={this.duanState(6,12)}
												  style={{marginRight:20,width:140}}>06:00~12:00</Checkbox>
									</th>
									<th width="20%">
										<Checkbox onChange={(e)=>this.onDuanChange(e,12,18)}
												  checked={this.duanState(12,18)}
												  style={{marginRight:20,width:140}}>12:00~18:00</Checkbox>
									</th>
									<th width="20%">
										<Checkbox onChange={(e)=>this.onDuanChange(e,18,24)}
												  checked={this.duanState(18,24)}
												  style={{marginRight:20,width:140}}>18:00~24:00</Checkbox>
									</th>
								</tr>
							</thead>
							<tbody>
							{this.state.timeArr.map((i,k)=>(
								<tr key={k}>
									<td width="4%">
										<Checkbox onChange={(e)=>this.onDayTimeChange(e,i.value)}
												  checked={this.rowState(k)}
										></Checkbox>
									</td>
									<td width="4%">
										{i.name}
									</td>
									<td width="20%">
										{this.hourMap(i.hours.slice(0,6))}
									</td>
									<td width="20%">
										{this.hourMap(i.hours.slice(6,12))}
									</td>
									<td width="20%">
										{this.hourMap(i.hours.slice(12,18))}
									</td>
									<td width="20%">
										{this.hourMap(i.hours.slice(18,24))}
									</td>
								</tr>
							))}
							</tbody>
						</table>
					</div>
					<div className="submit-content">
						<button className="cancelBtn" onClick={()=>{this.backSet()}}>取消</button>
						<button className="confirmBtn" onClick={this.confirm.bind(this)}>
							确定
						</button>
					</div>
				</div>
			</div>
		)
	}
}
