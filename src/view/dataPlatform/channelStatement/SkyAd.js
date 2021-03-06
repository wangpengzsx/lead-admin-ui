import React from "react";
import Layout from "../../../layout/Layout";
import { Checkbox, Pagination, Select } from "antd";
const Option = Select.Option;
import moment from 'moment';
import echarts from "echarts";
import { observer } from "mobx-react";
import GeneralizeManageStore from "../../../mobx/generalizeSupport/generalize-manage-store";
import SkyAdstore from "../../../mobx/dataPlatform/skyAd-store"
import Client from "../../../common/lead-api";
import ExcellentExport from 'excellentexport';
import RangePickerCom from '../component/RangePickerCom';
const headArr = [
    { name: '日期', w: '20%' },
    { name: '应用名称', w: '20%' },
    { name: '广告位类型', w: '20%' },
    { name: '广告位名称', w: '20%' },
    { name: '媒体请求数', w: '20%' },
    { name: '展现数', w: '20%' },
    { name: '展现率', w: '20%' },
    { name: '点击数', w: '20%' },
    { name: '点击率', w: '20%' },
]
const typeArr = [
    {
        name: 'banner广告',
        value: 'BANNER',
    },
    {
        name: '插屏广告',
        value: 'POPUP',
    },
    {
        name: '开屏广告',
        value: 'OPENSCREEN',
    },
    {
        name: '原生广告',
        value: 'NATIVE',
    },
    {
        name: '视频广告',
        value: 'VIDEO',
    }
]
const DuibiArr=[
	{name:'请求数',value:'requests'},
	{name:'展现数',value:'displays'},
	{name:'展现率',value:'display_rate'},
	{name:'点击数',value:'clicks'},
	{name:'点击率',value:'ctr'},
]
@observer
export default class SkyAd extends React.Component {
    constructor() {
        super()
        this.state = {
            size: 5,
            startValue: moment().startOf('day'),
            endValue: moment().endOf('day'),
            endOpen: false,
            spaceId: '',
            appId: '',
            adType: '',
            compareValue1: '请求数',
            compareValue2: '展现数',
            pageNo: 1,
            pageSize: 10,
            appArr: [],
            typeArr: [],
            spaceArr: [],
            sizeArr: [],
            geziWidth: '16.6%',
            appAll: false,
            typeAll: false,
            spaceAll: false,
            sizeAll: false
        }
    }
    componentWillMount() {
        GeneralizeManageStore.getAppArr();
        GeneralizeManageStore.getOursSpace();
        GeneralizeManageStore.getAdSpaceSizes();
        let { pageNo, pageSize, startValue, endValue, appArr, typeArr, spaceArr,compareValue1,compareValue2 } = this.state;
        let startStr = this.timeStr(startValue), endStr = this.timeStr(endValue);
		let appId = this.arrStr(appArr);
		let adType = this.arrStr(typeArr);
		let spaceId = this.arrStr(spaceArr);
        SkyAdstore.getDownloadList(pageNo, pageSize, startStr, endStr, appId, adType, spaceId,compareValue1,compareValue2,this.callback.bind(this))
    }
    componentDidMount() {
        setTimeout(() => {
            this.echatsShow()
        }, 300)
    }
	timeStr(startValue){
		if (startValue) {
			return Client.formatDate(startValue.valueOf()).replace('-', '').replace('-', '');
		}else{
			return''
		}
	}
    onPageChange(e) {
        this.setState({ pageNo: e });
        this.refreshList();
    }
    onShowSizeChange(p, e) {
        this.setState({ pageNo: p, pageSize: e });
        this.refreshList();
    }
    refreshList() {
        setTimeout(() => {
            let { pageNo, pageSize, startValue, endValue, appArr, typeArr, spaceArr,compareValue1,compareValue2 } = this.state;
			let startStr = this.timeStr(startValue), endStr = this.timeStr(endValue);
			let appId = this.arrStr(appArr);
			let adType = this.arrStr(typeArr);
			let spaceId = this.arrStr(spaceArr);
            SkyAdstore.getDownloadList(pageNo, pageSize, startStr, endStr, appId, adType, spaceId,compareValue1,compareValue2,this.callback.bind(this))
        }, 300)
    }
    echatsShow() {
        let { daysX ,a1,a2,isRate2,isRate1} = SkyAdstore
		let maxappreg = Client.calMax(a1);//a1最大值
		let maxactive = Client.calMax(a2);//a2最大值
		let interval_left=maxappreg/5;//平均间隔
		let interval_right=maxactive/5;//平均间隔
        let myChart1 = echarts.init(document.getElementById('dataEchart'));
        let option1 = {
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: [...daysX],
                axisLabel: {
                    interval: 0,
                    rotate: daysX.length > 7 ? 40 : 0
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            yAxis: [
				{
					name:this.state.compareValue1,
					type: 'value',
					max:maxappreg,
					splitNumber:5,
					interval:interval_left,
					axisLabel: {
						show: true,
						interval: 'auto',
						formatter: isRate1?'{value} %':'{value}'
					},
				},
				{
					name:this.state.compareValue2,
					type:'value',
					max:maxactive,
					splitNumber:5,
					interval:interval_right,
					axisLabel: {
						show: true,
						interval: 'auto',
						formatter: isRate2?'{value} %':'{value}'
					},
				}
			],
            legend: {
                data: [this.state.compareValue1, this.state.compareValue2]
            },
            tooltip: {
				trigger: 'axis',
				formatter:function(params) {
					var relVal = params[0].name;
					for (var i = 0, l = params.length; i < l; i++) {
						let str='';
						if(i==0){
							str='<div class="yuanqiu" style="background:#7d0022; "></div>';
						}else{
							str='<div class="yuanqiu" style="background:#4fc1e9; "></div>';
						}
						if(params[i].seriesName.indexOf('率')!=-1||params[i].seriesName.indexOf('比')!=-1) {
							relVal += '<br/>'+str + params[i].seriesName + ' : ' + params[i].value+"%";
						}else{
							relVal += '<br/>'+str + params[i].seriesName + ' : ' + params[i].value;
						}
					}
					return relVal;
				}
            },
            series: [
                {
                    name: this.state.compareValue1,
                    type: 'line',
                    lineStyle: {
                        normal: {
                            width: 1,
                            opacity: 0.7
                        }
                    },
                    data: [...a1],
                    areaStyle: {
                        normal: {
                            opacity: 0.25
                        }
                    },
                    smooth: true,
                },
                {
                    name: this.state.compareValue2,
                    type: 'line',
					yAxisIndex:1,
                    lineStyle: {
                        normal: {
                            width: 1,
                            opacity: 0.7
                        }
                    },
                    data: [...a2],
                    areaStyle: {
                        normal: {
                            opacity: 0.25
                        }
                    },
                    smooth: true,
                }
            ],
            color: ['#7d0022', '#4fc1e9'],
        };
        myChart1.setOption(option1, true);
        window.addEventListener("resize", () => { myChart1.resize(); });
    }
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
    }
    query() {
    	this.setState({pageNo:1})
        let { pageSize, startValue, endValue, appArr, typeArr, spaceArr, compareValue1,compareValue2 } = this.state;
		let startStr = this.timeStr(startValue), endStr = this.timeStr(endValue);
        let appId = this.arrStr(appArr);
        let adType = this.arrStr(typeArr);
        let spaceId = this.arrStr(spaceArr);
        let arr = [appId, adType, spaceId,];
        let num = 0;
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] == '') {
                num += 1;
            }
        }
        this.setState({
            geziWidth: 100 / (9 - num) + '%'
        })
        SkyAdstore.getDownloadList(1, pageSize, startStr, endStr, appId, adType, spaceId,compareValue1,compareValue2,this.callback.bind(this))
        SkyAdstore.storeTypeArr = this.state.typeArr;
        SkyAdstore.storeSpaceArr = this.state.spaceArr;
        SkyAdstore.storeSizeArr = this.state.sizeArr;
        SkyAdstore.storeAppArr = this.state.appArr;
    }
    callback(){
		this.echatsShow()
	}
    onCompareChange1(e) {
        this.setState({
            compareValue1: e
        })
        setTimeout(() => {
            this.query()
        }, 300)
    }
    onCompareChange2(e) {
        this.setState({
            compareValue2: e
        })
        setTimeout(() => {
            this.query()
        }, 300)
    }
    downloadExcel(e) {
        return ExcellentExport.excel(e.target, 'mediadatatable', 'Sheet Name Here');
    }
    onTypeChange(e) {
        this.setState({ typeArr: e });
    }
    onAppChange(a) {
        this.setState({ appArr: a })
    }
    onSpaceChange(e) {
        this.setState({ spaceArr: e });
    }
    onAppAllChange(e) {
        if (e.target.value) {
            this.setState({
                appArr: []
            })
        } else {
            let { appArr } = GeneralizeManageStore;
            let arr = [];
            for (let i = 0; i < appArr.length; i++) {
            	if(appArr[i].APP_ID){
					arr.push('@'+appArr[i].APP_ID);
				}else{
					arr.push('#'+appArr[i].APP_GROUP_ID);
				}
            }
            this.setState({
                appArr: arr
            })
        }
        this.setState({
            appAll: !e.target.value
        })
    }
    onTypeAllChange(e) {
        if (e.target.value) {
            this.setState({
                typeArr: []
            })
        } else {
            let arr = [];
            for (let i = 0; i < typeArr.length; i++) {
                arr.push(typeArr[i].value);
            }
            this.setState({
                typeArr: arr
            })
        }
        this.setState({
            typeAll: !e.target.value
        })
    }
    onSpaceAllChange(e) {
        if (e.target.value) {
            this.setState({
                spaceArr: []
            })
        } else {
            let { oursSpace } = GeneralizeManageStore;
            let arr = [];
            for (let i = 0; i < oursSpace.length; i++) {
                arr.push(oursSpace[i].id);
            }
            this.setState({
                spaceArr: arr
            })
        }
        this.setState({
            spaceAll: !e.target.value
        })
    }
	rangeChange(startValue,endValue){
		this.setState({
			startValue:startValue,
			endValue:endValue
		})
	}
    render() {
        let { appArr, oursSpace } = GeneralizeManageStore;
        let { DownloadList, total, storeAppArr, storeSpaceArr, storeTypeArr } = SkyAdstore;
        return (
            <div>
                <Layout history={this.props.history} />
                <div className="content">
                    <div className="contentBulk3" style={{ paddingTop: 10 }}>
                        <div className="listROwlet2">
                            <div className="form-left" style={{ width: '30%' }}>
                                日期：
							</div>
                            <div className="form-right" style={{ width: '60%' }}>
								<RangePickerCom call={(startValue,endValue)=>this.rangeChange(startValue,endValue)}/>
                            </div>
                        </div>
                        <div className="listROwlet2" style={{ minHeight: 60, lineHeight: '30px' }}>
                            <div className="form-left" style={{ width: '30%' }}>
                                应用：
							</div>
                            <div className="form-right-multiple" style={{ width: '50%' }}>
                                <Checkbox onChange={this.onAppAllChange.bind(this)}
										  indeterminate={this.state.appArr.length!=0&&this.state.appArr.length<appArr.length}
                                    checked={this.state.appArr.length==appArr.length} value={this.state.appArr.length==appArr.length} />
                                <Select
                                    mode="multiple"
                                    placeholder="请选择应用"
                                    value={this.state.appArr}
                                    maxTagCount={1}
                                    onChange={this.onAppChange.bind(this)}
                                    style={{ width: '100%', marginLeft: 10 }}
                                >
                                    {appArr.map((i, k) => (
                                        <Option key={k} value={i.APP_ID?'@'+i.APP_ID:'#'+i.APP_GROUP_ID}>{i.NAME}</Option>
                                    ))}
                                </Select>
                            </div>
                        </div>
                        <div className="listROwlet2" style={{ minHeight: 60, lineHeight: '30px' }}>
                            <div className="form-left" style={{ width: '30%' }}>
                                广告类型：
							</div>
                            <div className="form-right-multiple" style={{ width: '50%' }}>
                                <Checkbox onChange={this.onTypeAllChange.bind(this)}
										  indeterminate={this.state.typeArr.length!=0&&this.state.typeArr.length<typeArr.length}
                                    checked={this.state.typeArr.length==typeArr.length} value={this.state.typeArr.length==typeArr.length} />
                                <Select
                                    mode="multiple"
                                    placeholder="请选择广告类型"
                                    value={this.state.typeArr}
                                    maxTagCount={1}
                                    onChange={this.onTypeChange.bind(this)}
                                    style={{ width: '100%', marginLeft: 10 }}
                                >
                                    {typeArr.map((i, k) => (
                                        <Option value={i.value} key={k}>{i.name}</Option>
                                    ))}
                                </Select>
                            </div>
                        </div>
                        <div className="listROwlet2" style={{ minHeight: 60, lineHeight: '30px' }}>
                            <div className="form-left" style={{ width: '30%' }}>
                                广告位：
							</div>
                            <div className="form-right-multiple" style={{ width: '50%' }}>
                                <Checkbox onChange={this.onSpaceAllChange.bind(this)}
										  indeterminate={this.state.spaceArr.length!=0&&this.state.spaceArr.length<oursSpace.length}
                                    checked={this.state.spaceArr.length==oursSpace.length} value={this.state.spaceArr.length==oursSpace.length} />
                                <Select
                                    mode="multiple"
                                    placeholder="请选择广告位"
                                    value={this.state.spaceArr}
                                    maxTagCount={1}
                                    onChange={this.onSpaceChange.bind(this)}
                                    style={{ width: '100%', marginLeft: 10 }}
                                >
                                    {oursSpace.map(d => <Option key={d.id} value={d.id}>{d.adSpaceName}</Option>)}
                                </Select>
                            </div>
                        </div>
                    </div>
                    <div style={{ paddingBottom: 10 }}>
                        <button className="filtrateBtn" onClick={() => { this.query() }}>
                            查询
						</button>
                    </div>
                    <div className="list-haed">
                        <span className="dah1">数据趋势</span>
                    </div>
                    <div className="contentBulk">
                        <div style={{ width: '100%', height: 30 }}>
                            <div style={{ width: '20%', float: 'left' }}>
                            </div>
                            <div style={{ width: '30%', float: 'right' }}>
                                <Select value={this.state.compareValue1} style={{ width: 120 }} onChange={(e) => this.onCompareChange1(e)} size="small">
                                    {
                                        DuibiArr.map((i, k) => (
                                            <Option value={i.name} key={k} disabled={i.name == this.state.compareValue2}>{i.name}</Option>
                                        ))
                                    }
                                </Select>
                                &nbsp;&nbsp;对比&nbsp;&nbsp;
								<Select value={this.state.compareValue2} style={{ width: 120 }} onChange={(e) => this.onCompareChange2(e)} size="small">
                                    {
                                        DuibiArr.map((i, k) => (
                                            <Option value={i.name} key={k} disabled={i.name == this.state.compareValue1}>{i.name}</Option>
                                        ))
                                    }
                                </Select>
                            </div>
                        </div>
                        <div style={{ width: '100%', height: 300 }} id='dataEchart'></div>
                    </div>
                    <div className="contentBulk1">
                        <div className="con-head" style={{ padding: 10 }}>
                            <a className="borderBtn" download="somedata.xls" href="#"
                                onClick={(e) => this.downloadExcel(e)}>
                                下载报表
							</a>
                        </div>
                        <div style={{ width: '100%', overflowX: 'scroll' }}>
                            <table style={{ width: '100%' }} id="mediadatatable">
                                <thead>
                                    <tr className="table-head1" >
                                        {
                                            headArr.map((i, k) => {
                                                if (i.name == '应用名称' && storeAppArr.length == 0) {
                                                    return null
                                                } else if (i.name == '广告位类型' && storeTypeArr.length == 0) {
                                                    return null
                                                } else if (i.name == '广告位名称' && storeSpaceArr.length == 0) {
                                                    return null
                                                } else {
                                                    return (
                                                        <th key={k} style={{ width: this.state.geziWidth }} className="gezi" title={i.name}>
                                                            {i.name}
                                                        </th>
                                                    )
                                                }
                                            })
                                        }
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        DownloadList.map((i, k) => (
                                            <tr className="table-body" key={k}>
                                                <td className="gezi" title={i.event_date} style={{ width: this.state.geziWidth }}>{/*日期*/}
                                                    {i.event_date}
                                                </td>
                                                {storeAppArr.length != 0 ? (
                                                    <td className="gezi" title={i.app_name} style={{ width: this.state.geziWidth }}>{/*应用名称*/}
                                                        {i.event_date=='合计'?'--':Client.formatListData(i.app_group_id==null?i.app_name:i.group_name)}
                                                    </td>
                                                ) : null}
                                                {storeTypeArr.length != 0 ? (
                                                    <td className="gezi" title={i.ad_type} style={{ width: this.state.geziWidth }}>{/*广告类型*/}
                                                        {i.event_date=='合计'?'--':Client.adTypeEffect(Client.formatListData(i.ad_type))}
                                                    </td>
                                                ) : null}
                                                {storeSpaceArr.length != 0 ? (
                                                    <td className="gezi" title={i.space_name} style={{ width: this.state.geziWidth }}>{/*广告位名称*/}
                                                        {i.event_date=='合计'?'--':Client.formatListData(i.space_name)}
                                                    </td>
                                                ) : null}
                                                <td className="gezi" title={i.requests} style={{ width: this.state.geziWidth }}>{/*媒体请求数*/}
                                                    {Client.formatListData(i.requests)}
                                                </td>
                                                <td className="gezi" title={i.displays} style={{ width: this.state.geziWidth }}>{/*展现数*/}
                                                    {Client.formatListData(i.displays)}
                                                </td>
                                                <td className="gezi" style={{ width: this.state.geziWidth }}>{/*展现率*/}
                                                    {Client.addRate(i.display_rate) }
                                                </td>
                                                <td className="gezi" title={i.clicks} style={{ width: this.state.geziWidth }}>{/*点击数*/}
                                                    {Client.formatListData(i.clicks)}
                                                </td>
                                                <td className="gezi" style={{ width: this.state.geziWidth }}>{/*点击率*/}
                                                    {Client.addRate(i.ctr)}
                                                </td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        </div>
                        <div className='con-head'>
                            <Pagination
                                pageSizeOptions={['5', '10', '20', '50', '100']}
                                showSizeChanger
                                defaultPageSize={this.state.pageSize}
								current={this.state.pageNo}
                                onChange={this.onPageChange.bind(this)}
                                onShowSizeChange={this.onShowSizeChange.bind(this)} defaultCurrent={1} total={total} />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
