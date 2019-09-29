import jq from "jquery";
import { hashHistory } from 'react-router-dom';
/**
 base methods
 返回值：
 200 OK - for plain GET
 201 Created - for POST/PUT request which create new resources
 204 No Content - for PUT/PATCH/DELETE request which return nothing
 */
const baseURI = '/lead-admin-api/';
const jsonType = 'application/json';
const textType = 'text/uri-list';
function insertStr(soure, start, newStr){
	return soure.slice(0, start) + newStr + soure.slice(start);
}
const ajax=function(httpMethod, relationData, contentType, pathElementArray, settings ) {
	if(contentType.indexOf('/json')>-1){
		relationData=JSON.stringify(relationData);
	}
	let str=''
	if(settings){
		str=baseURI + pathElementArray.join('/')+settings;
	}else{
		str=baseURI + pathElementArray.join('/')
	}
	return new Promise(function(resolve, reject){
		jq.ajax({
			url: str,
			method: httpMethod,
			contentType: contentType,
			type:'json',
			data: relationData,
			beforeSend:function(){
				$('#reload').fadeIn()
			},
			success: function (res) { resolve(res) },
			error:   function (err) {
				console.log(err);
				if(err.status=='401'){

					window.location.href='/loginPage'
				}else{
					reject(err)
				};
			},
			complete:function(){
				$('#reload').fadeOut()
			}
		})
	})
}

const ajaxlogin=function(httpMethod, relationData, contentType, pathElementArray,suc,errfun ) {
	if(contentType.indexOf('/json')>-1){
		relationData=JSON.stringify(relationData);
	}
	let str=baseURI + pathElementArray.join('/')
	return new Promise(function(resolve, reject){
		jq.ajax({
			url: str,
			method: httpMethod,
			contentType: contentType,
			type:'json',
			cache:false,
			data: relationData,
			success: function (res) {
				resolve(res)
				suc(res)
			},
			error:   function (err) {
				reject(err)
				errfun(err)
			}
		})
	})
}

const ajaxForMany=function(httpMethod, relationData, contentType, pathElementArray,idsArr ,manyParam) {
	if(contentType.indexOf('/json')>-1){
		relationData=JSON.stringify(relationData);
	}
	let str=''
	if(idsArr!=""&idsArr!=null){
		str=baseURI + pathElementArray + idsArr.join();
	}else{
		str=baseURI + pathElementArray;
	}
	if(manyParam!=null){
		str = str + manyParam;
	}
	return new Promise(function(resolve, reject){
		jq.ajax({
			url: str,
			method: httpMethod,
			contentType: contentType,
			type:'json',
			data: relationData,
			success: function (res) { resolve(res) },
			error:   function (err) {
				console.log(err);
				if(err.status=='401'){
					//window.location.href='/loginPage'
				}else{
					reject(err)
				};
			}
		})
	})
}

const ajaxUploder=function(filepath ,relationData ) {
	return new Promise(function(resolve, reject){
		jq.ajax({
			url:baseURI+filepath ,
			type:'POST',
			data: relationData,
			dataType: 'json',
			cache: false,
			processData: false,
			contentType: false,
			success: function (res) { resolve(res) },
			error:   function (err) {
				if(err.status=='401'){
					window.location.href='/loginPage'
				}else{
					reject(err)
				};
			}
		})
	})
}

export default  {
	noChinese(str){
		var reg=/^[\u4e00-\u9fa5]+$/;
		return reg.test(str);
	},
	isUrl(str){
		var reg=/^((ht|f)tps?):\/\/[\w\-]+(\.[\w\-]+)+([\w\-\.,@?^=%&:\/~\+#]*[\w\-\@?^=%&\/~\+#])?$/;
		return reg.test(str);
	},
	isPhone(str){
		var reg=/^(1[0-9]\d{9})$/;
		return reg.test(str);
	},
	isNumber(str){
		var reg=/[\d]/
		return reg.test(str);
	},
	isInt(str){
		var reg=/^[1-9]\d*$/
		return reg.test(str);
	},
	isNumber1(str){
		var reg=/^(\+)?\d+(\.\d+)?$/
		return reg.test(str);
	},
	isMax20(str){
		var reg=/^.{0,20}$/
		return reg.test(str);
	},
	isMax13(str){
		var reg=/^.{0,13}$/
		return reg.test(str);
	},
	isMax40(str){
		var reg=/^.{1,40}$/
		return reg.test(str);
	},
	isAppBao(str){
		var reg=/([a-zA-Z_][a-zA-Z0-9_]*[.])*([a-zA-Z_][a-zA-Z0-9_]*)$/;
		return reg.test(str);
	},
	isPassword(str) {
		var reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/;
		return reg.test(str);
	},
	isPassword1(str){
		let reg=/^[a-z0-9]{6,16}$/;
		return reg.test(str);
	},
	isPassword2(str){
		let reg=/^[a-z0-9]{1,}$/;
		return reg.test(str);
	},
	isEmail(str){
		var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
		return reg.test(str);
	},
	imgFile:location.origin+'/lead-admin-api/file/img/',
	base:location.origin+'/lead-admin-api',
	uploder(path,data){
		return ajaxUploder(path,data);
	},
	login(objType, objData,suc,err) {
		return ajaxlogin('POST', objData, jsonType, [objType],suc,err);
	},
	getNullArgument(objType){
		return ajax('GET', null, jsonType, [objType]);
	},
	getleadArr(objType,objData){
		return ajax('GET', objData, textType, [objType]);
	},
	searchType(objType){
		return ajax('GET', null, jsonType, [objType]);
	},
	/** 数据的增删改查 */
	getObject(objType, objId) {
		return ajax('GET', null, jsonType, [objType, objId]);
	},
	createObject(objType, objData) {
		return ajax('POST', objData, jsonType, [objType]);
	},

	deleteObject(objType, objId) {
		return ajax('DELETE', null, jsonType, [objType, objId]);
	},
	replaceObject(objType, objId, objData) {
		return ajax('PUT', objData, jsonType, [objType, objId]);
	},
	modifyObject(objType, objId, objData) {
		return ajax('PATCH', objData, jsonType, [objType, objId]);
	},
	getList(objType,size,page,tempsort) {
		let str='?size='+size+'&page='+(page-1)+'&sort='+tempsort;
		return ajax('GET', null, jsonType, [objType],str);
	},
	deleteList(objType, objId) { //TODO
		return ajax('DELETE', null, jsonType, [objType, objId]);
	},
	/** 数据关联获取 */
	getRelation(objType, objId, relType) {
		return ajax('GET', null, textType, [objType, objId, relType]);
	},
	// 用新的关联数据替换
	setRelation(objType, objId, relField, relDataType, dataArr) {
		let str= dataArr.map((i)=> '/'+relDataType+'/'+i).join('\n');
		return ajax('PUT', str, textType, [objType,objId,relField]);
	},
	// 将关联数据合并到原关联
	addRelation(objType, objId, relField, relDataType, dataArr) {
	    let str= dataArr.map((i)=> '/'+relDataType+'/'+i).join('\n')
		return ajax('PATCH', str, textType, [objType, objId, relField]);
	},
	delRelation(objType, objId, relType, relId) {
		return ajax('DELETE', null, textType, [objType, objId, relType, relId]);
	},
	formatDateTime(inputTime) {
		let date = new Date(inputTime);
		let y = date.getFullYear();
		let m = date.getMonth() + 1;
		m = m < 10 ? ('0' + m) : m;
		let d = date.getDate();
		d = d < 10 ? ('0' + d) : d;
		let h = date.getHours();
		h = h < 10 ? ('0' + h) : h;
		let minute = date.getMinutes();
		let second = date.getSeconds();
		minute = minute < 10 ? ('0' + minute) : minute;
		second = second < 10 ? ('0' + second) : second;
		return y + '-' + m + '-' + d+' '+h+':'+minute+':'+second;
	},
	formatDate(inputTime) {
		let date = new Date(inputTime);
		let y = date.getFullYear();
		let m = date.getMonth() + 1;
		m = m < 10 ? ('0' + m) : m;
		let d = date.getDate();
		d = d < 10 ? ('0' + d) : d;
		return y + '-' + m + '-' + d;
	},
	formatMonth(inputTime){
		let date = new Date(inputTime);
		let y = date.getFullYear();
		let m = date.getMonth() + 1;
		m = m < 10 ? ('0' + m) : m;
		let d = date.getDate();
		d = d < 10 ? ('0' + d) : d;
		return y + m ;
	},
	// 批量删除
	deleteMany(pathHead, ids) {
		return ajaxForMany('GET', null, jsonType, [pathHead, ids],null);
	},
	// 根据ids修改某属性
	updateByIds(pathHead, ids ,manyParam){
		return ajaxForMany('GET', null, jsonType, pathHead, [ids],manyParam);
	},
	addRate(item){//增加%
		return item==null||item=='NaN'?'--':Number(item * 100).toFixed(2) + '%';
	},
	toFixed(item){//保留2位小数
		return item==null||item=='NaN'?'--':Number(item).toFixed(2) ;
	},
	toThousands(item){
		return item==null||item=='NaN'?'--':this.toThousandsCh(item);
	},
	formatListData(item){
		return item==null||item=='NaN'?'--':item;
	},
	formatListData1(item){
		return item==null||item=='NaN'?'--':(item==1?'分成比例':'CPM');
	},
	// 根据参数 查询数据
	getListByParam(pathHead,paramStr) {
		return ajax('GET', null, jsonType, [pathHead],paramStr);
	},
	//删除数组对象中的重复元素
	removeDuplicatedItem(arr) {
		for(var i = 0; i < arr.length-1; i++){
			for(var j = i+1; j < arr.length; j++){
				if(arr[i].name==arr[j].name){
					arr.splice(j,1);
					j--;
				}
			}
		}
		return arr;
	},
	removeDuplicatedItem2(arr,id) {
		for(var i = 0; i < arr.length-1; i++){
			for(var j = i+1; j < arr.length; j++){
				if(arr[i][id]==arr[j][id]){
					arr.splice(j,1);
					j--;
				}
			}
		}
		return arr;
	},
	//数组去重
	unique(arr){
		var hash=[];
		for (var i = 0; i < arr.length; i++) {
			if(hash.indexOf(arr[i])==-1){
				hash.push(arr[i]);
			}
		}
		return hash;
	},
	//数组中是否包含某个数组
	isContained(a, b){
		if(!(a instanceof Array) || !(b instanceof Array)) return false;
		if(a.length < b.length) return false;
		let aStr = a.toString();
		for(var i = 0, len = b.length; i < len; i++){
			if(aStr.indexOf(b[i]) == -1) return false;
		}
		return true;
	},
	adTypeArrEffect(type){
		let arr= [
			{ label: 'banner广告', value: 'BANNER' },
			{ label: '开屏广告', value: 'OPENSCREEN' },
			{ label: '插屏广告', value: 'POPUP' },
			{ label: '原生广告', value: 'NATIVE' },
			{ label: '视频广告', value: 'VIDEO' },
		];
		let arr1=type?type.split(','):[];
		let str='';
		for(let i=0; i<arr1.length; i++){
			for(let j=0; j<arr.length; j++){
				if(arr1[i]==arr[j].value){
					if(i==arr1.length-1){
						str += arr[j].label
					}else{
						str += arr[j].label+','
					}
				}
			}
		}
		return str;
	},
	adTypeEffect(type){
		let arr= [
			{ label: 'banner广告', value: 'BANNER' },
			{ label: '开屏广告', value: 'OPENSCREEN' },
			{ label: '插屏广告', value: 'POPUP' },
			{ label: '原生广告', value: 'NATIVE' },
			{ label: '视频广告', value: 'VIDEO' },
		];
		for(let i=0; i<arr.length; i++){
			if(type==arr[i].value){
				return arr[i].label
			}
		}
		return '--';
	},
	channelEffect(type){
		let arr =[
			{
				name:'打底',
				value:'FALLBACK_DSP'
			},
			{
				name:'天窗',
				value:'DORMANT'
			},
			{
				name:'apidsp',
				value:'API_DSP'
			},
			{
				name:'推广',
				value:'POPU_PLAN'
			}
		]
		for(let i=0; i<arr.length; i++){
			if(type==arr[i].value){
				return arr[i].name
			}
		}
		return '--';
	},
	effect(ddd){
		if(ddd==null){
			return ''
		}else{
			let str=''
			if(typeof ddd=='object'){
				if(ddd.indexOf('APPLICATION_OPEN')>-1){
					str+='应用内打开 '
				}
				if(ddd.indexOf('BROWSER_OPEN')>-1){
					str+='浏览器内打开 '
				}
				if(ddd.indexOf('START_DOWNLOAD')>-1){
					str+='直接下载 '
				}
				if(ddd.indexOf('CONFIRM_DOWNLOAD')>-1){
					str+='确认后下载 '
				}
			}else{
				if(ddd.split(',').indexOf('APPLICATION_OPEN')>-1){
					str+='应用内打开 '
				}
				if(ddd.split(',').indexOf('BROWSER_OPEN')>-1){
					str+='浏览器内打开 '
				}
				if(ddd.split(',').indexOf('START_DOWNLOAD')>-1){
					str+='直接下载 '
				}
				if(ddd.split(',').indexOf('CONFIRM_DOWNLOAD')>-1){
					str+='确认后下载 '
				}
			}
			return str
		}
	},
	showTank(b,text){
		jq('#tank').fadeIn();
		if(b){
			jq('.sucImg2').css({'display':'none'})
			jq('.sucImg').css({'display':'inline-block'})
		}else{
			jq('.sucImg2').css({'display':'inline-block'})
			jq('.sucImg').css({'display':'none'})
		}
		jq('#tankText').html(text);
		setTimeout(()=>{
			jq('#tank').fadeOut();
		},3000)
	},
	showTank1(b,text){
		jq('#tank').fadeIn();
		if(b){
			jq('.sucImg2').css({'display':'none'})
			jq('.sucImg').css({'display':'inline-block'})
		}else{
			jq('.sucImg2').css({'display':'inline-block'})
			jq('.sucImg').css({'display':'none'})
		}
		jq('#tankText').html(text);

	},
	calMax(arr) {
		var max = arr[0];
		for ( var i = 1; i < arr.length; i++) {// 求出一组数组中的最大值
			if (max < arr[i]) {
				max = arr[i];
			}
		}
		var maxint,maxval;
		if(max>1){
			maxint = Math.ceil(max / 10);// 向上取整
			maxval = maxint * 10;// 最终设置的最大值
		}else{
			maxval=100;
		}
		return maxval;// 输出最大值
	},
	calMax1(arr) {
		var max = arr[0];
		for ( var i = 1; i < arr.length; i++) {// 求出一组数组中的最大值
			if (max < arr[i]) {
				max = arr[i];
			}
		}
		var maxint,maxval;
		if(max==0) {
			maxval=1
		}else{
			maxint = Math.ceil(max / 10);// 向上取整
			maxval = maxint * 10;// 最终设置的最大值
		}
		return maxval;// 输出最大值
	},
	insertGang(p1){
		let str=''
		str=insertStr(p1,4,'/');
		str=insertStr(str,7,'/');
		return str;
	},
	substring(str,index){
		return str.length>index?str.slice(0,index-1)+'...':str;
	},
	arrStr(arr) {
		let str = ''
		for (let i = 0; i < arr.length; i++) {
			if (i == arr.length - 1) {
				str += arr[i];
			} else {
				str += arr[i] + ',';
			}
		}
		return str;
	},
	returnArgument(appId){
		let appArr=appId?appId.split(','):[];
		let oneArr=[],groupArr=[];
		for(let i=0;i<appArr.length;i++){
			if(appArr[i].slice(0,1)=='@'){
				oneArr.push(appArr[i].slice(1))
			}else if(appArr[i].slice(0,1)=='#'){
				groupArr.push(appArr[i].slice(1))
			}
		}
		return 'appId='+this.arrStr(oneArr)+'&groupId='+this.arrStr(groupArr)
	},
	toThousandsCh(num) {//整数会计模式
		num = (num || 0).toString();
		var decimal;
		if(num.lastIndexOf('.')!=-1){
			decimal = num.split('.')[1];
		}
		num = num.split('.')[0].replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
		if(decimal){
			num+='.'+decimal;
		}
		return num;
	}
}
