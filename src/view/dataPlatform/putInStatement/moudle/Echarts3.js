import React from "react";
import echarts from 'echarts';
import 'echarts/map/js/china';
export default class Echarts3 extends React.Component {
	componentDidMount() {
		this.createMap(this.mapNode);
	}
	setMapElement = n => {
		this.mapNode = n;
	};
	createMap = element => {
		const myChart = echarts.init(element);
		const option = {
			xAxis: {
				type: 'value'
			},
			grid: {
				left: '3%',
				right: '4%',
				bottom: '3%',
				containLabel: true
			},
			yAxis: {
				type: 'category',
				data: ['河北', '山东', '河南', '江苏', '湖南', '安徽', '浙江', '云南', '广东','广西']
			},
			series: [{
				data: [120, 200, 150, 80, 70, 110, 130,120,110,30],
				type: 'bar'
			}],
			color:['#2e88ff']
		};
		myChart.setOption(option, true);
	};
	render() {
		return (
			<div style={{ width: '40%', height: 300, float:'left' }} id='dataEchart' ref={this.setMapElement}></div>
		)
	}
}
