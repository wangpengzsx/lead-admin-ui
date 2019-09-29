import React from "react";
import echarts from 'echarts';
import 'echarts/map/js/china';
export default class Echarts1 extends React.Component {
	componentDidMount() {
		this.createMap(this.mapNode);
	}
	setMapElement = n => {
		this.mapNode = n;
	};
	createMap = element => {
		const myChart = echarts.init(element);
		const option = {
			title : {
				text: 'iphone销量',
				subtext: '纯属虚构',
				left: 'center'
			},
			tooltip : {
				trigger: 'item'
			},
			visualMap: {
				min: 0,
				max: 2500,
				left: 'left',
				top: 'bottom',
				text:['高','低'],           // 文本，默认为数值文本
				calculable : true
			},
			series : [
				{
					name: 'iphone3',
					type: 'map',
					mapType: 'china',
					roam: false,
					label: {
						normal: {
							show: false
						},
						emphasis: {
							show: true
						}
					},
					data:[
						{name: '北京',value: Math.round(Math.random()*1000)},
						{name: '天津',value: Math.round(Math.random()*1000)},
						{name: '上海',value: Math.round(Math.random()*1000)},
						{name: '重庆',value: Math.round(Math.random()*1000)},
						{name: '河北',value: Math.round(Math.random()*1000)},
						{name: '河南',value: Math.round(Math.random()*1000)},
						{name: '云南',value: Math.round(Math.random()*1000)},
						{name: '辽宁',value: Math.round(Math.random()*1000)},
						{name: '黑龙江',value: Math.round(Math.random()*1000)},
						{name: '湖南',value: Math.round(Math.random()*1000)},
						{name: '安徽',value: Math.round(Math.random()*1000)},
						{name: '山东',value: Math.round(Math.random()*1000)},
						{name: '新疆',value: Math.round(Math.random()*1000)},
						{name: '江苏',value: Math.round(Math.random()*1000)},
						{name: '江西',value: Math.round(Math.random()*1000)},
						{name: '湖北',value: Math.round(Math.random()*1000)},
						{name: '广西',value: Math.round(Math.random()*1000)},
						{name: '甘肃',value: Math.round(Math.random()*1000)},
						{name: '山西',value: Math.round(Math.random()*1000)},
						{name: '内蒙古',value: Math.round(Math.random()*1000)},
						{name: '陕西',value: Math.round(Math.random()*1000)},
						{name: '吉林',value: Math.round(Math.random()*1000)},
						{name: '福建',value: Math.round(Math.random()*1000)},
						{name: '贵州',value: Math.round(Math.random()*1000)},
						{name: '广东',value: Math.round(Math.random()*1000)},
						{name: '青海',value: Math.round(Math.random()*1000)},
						{name: '西藏',value: Math.round(Math.random()*1000)},
						{name: '四川',value: Math.round(Math.random()*1000)},
						{name: '宁夏',value: Math.round(Math.random()*1000)},
						{name: '海南',value: Math.round(Math.random()*1000)},
						{name: '台湾',value: Math.round(Math.random()*1000)},
						{name: '香港',value: Math.round(Math.random()*1000)},
						{name: '澳门',value: Math.round(Math.random()*1000)}
					]
				}
			]
		};
		myChart.setOption(option, true);
	};
	render() {
		return (
			<div style={{ width: '60%', height: 300, float:'left' }} id='dataEchart' ref={this.setMapElement}></div>
		)
	}
}
