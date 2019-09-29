import React from "react";
import Layout from "../../../layout/Layout";
import RangePickerCom from "../component/RangePickerCom";
import SeaSelect from "./moudle/SeaSelect";
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
export default class HourDimensionality extends React.Component {
	constructor(){
		super()
		this.state={
			typeArr:[],
			wayArr:[],
			startValue:'',
			endValue:''
		}
	}
	onChange(arr,key){
		this.setState({[key]:arr})
	}
	rangeChange(startValue,endValue){
		this.setState({startValue,endValue})
	}
	query(){
		console.log()
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
						<SeaSelect label="广告类型" option={typeArr} call={(arr)=>this.onChange(arr,'typeArr')}/>
						<SeaSelect label="交易方式" option={dealArr} call={(arr)=>this.onChange(arr,'wayArr')}/>
					</div>
					<div style={{ paddingBottom: 10 }}>
						<button className="filtrateBtn" onClick={() => { this.query() }}>
							查询
						</button>
					</div>
				</div>
			</div>
		)
	}
}
