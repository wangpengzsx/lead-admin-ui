import React from "react";
import Layout from "../../../layout/Layout";
import RangePickerCom from "../component/RangePickerCom";
import SeaSelect from "./moudle/SeaSelect";
import {Radio} from "antd";
const typeArr=[{ name: 'banner广告', value: 'BANNER' },
	{ name: '开屏广告', value: 'OPENSCREEN' },
	{ name: '插屏广告', value: 'POPUP' },
	{ name: '原生广告', value: 'NATIVE' },
	{ name: '视频广告', value: 'VIDEO' },]
const dealArr=[
	{ name: 'RTB', value: 'RTB' },
	{ name: 'PD', value: 'PD' },
	{ name: 'PDB', value: 'PDB' }
];
import Echarts1 from './moudle/Echarts1';
import Echarts2 from './moudle/Echarts2';
import Echarts3 from './moudle/Echarts3';
export default class TerritoryDimensionality extends React.Component {
	constructor(){
		super();
		this.state={
			region:'province',
		}
	}
	onToggleChange(e){
		this.setState({
			region:e.target.value
		})
	}
	render() {
		return (
			<div>
				<Layout history={this.props.history}/>
				<div className="content">
					<div className="contentBulk3" style={{ paddingTop: 10 }}>
						<div className="listROwlet2" style={{ minHeight: 60, lineHeight: '30px' }}>
							<div className="form-left" style={{ width: '30%' }}>
								日期：
							</div>
							<div className="form-right-multiple" style={{ width: '60%' }}>
								<RangePickerCom call={(startValue,endValue)=>this.rangeChange(startValue,endValue)}/>
							</div>
						</div>
						<SeaSelect label="广告类型" option={typeArr} call={(arr)=>this.onChange(arr)}/>
						<SeaSelect label="交易方式" option={dealArr} call={(arr)=>this.onChange(arr)}/>
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
						<div style={{ width: '100%', height: 40 }}>
							<Radio.Group value={this.state.region} onChange={(e)=>this.onToggleChange(e)}>
								<Radio.Button value="province">省级分布</Radio.Button>
								<Radio.Button value="city">地级市分布</Radio.Button>
							</Radio.Group>

						</div>
						{this.state.region=='province'?<Echarts1/>:<Echarts2/>}
						<Echarts3/>
					</div>
				</div>
			</div>
		)
	}
}
