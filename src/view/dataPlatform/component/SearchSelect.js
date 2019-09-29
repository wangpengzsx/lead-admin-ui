import Client from "../../../common/lead-api";
import React from "react";
import { Select ,Checkbox} from "antd";
const Option = Select.Option;
let timeout;
let currentValue;
export default class SearchInput extends React.Component {
	state = {
		data: [],
		value: undefined,
	}
	handleSearch = (value) => {
		this.fetch(value, data => this.setState({ data }));
	}
	handleChange = (value) => {
		this.setState({ value });
		this.props.call(value);
	}
	fetch(value, callback) {
		if (timeout) {
			clearTimeout(timeout);
			timeout = null;
		}
		currentValue = value;
		let that=this;
		function fake() {
			if(that.props.comTitle=='appName'){
				Client.getleadArr("leadApps/search/spec", {query:'state!=DELETED;appName==*'+value+'*',page:0,size:1000,sort:'appName'}).then(res=>{
					callback(res._embedded.leadApps)
				})
			}else if(that.props.comTitle=='appId'){
				Client.getleadArr("leadApps/search/spec", {query:'state!=DELETED;id==*'+value+'*',page:0,size:1000,sort:'appName'}).then(res=>{
					callback(res._embedded.leadApps)
				})
			}else if(that.props.comTitle=='devName'){
				Client.getNullArgument('media/getDeveloperListLikeName?developerName='+value).then(res=>{
					callback(res)
				})
			}else if(that.props.comTitle=='devBody'){
				Client.getNullArgument('media/getDeveloperListLikeBody?developerBody='+value).then(res=>{
					callback(res)
				})
			}
		}
		timeout = setTimeout(fake, 300);
	}
	onAppAllChange(e){
		if(e.target.value){
			this.setState({
				value:undefined
			})
			this.props.call(undefined);
		}else{
			this.setState({
				value:'All'
			})
			this.props.call('All');
		}
	}
	render() {
		const options = this.state.data.map(d => {
			if(this.props.comTitle=='appName')return (<Option key={d.id}>{d.appName}</Option>)
			if(this.props.comTitle=='appId')return (<Option key={d.id}>{d.id}</Option>)
			if(this.props.comTitle=='devName')return (<Option key={d.id}>{d.developer_name}</Option>)
			if(this.props.comTitle=='devBody')return (<Option key={d}>{d}</Option>)
		});
		return (
			<div className="form-right-multiple" style={{ width: '50%' }}>
				<Checkbox onChange={this.onAppAllChange.bind(this)}
						  checked={this.state.value=='All'}
						  value={this.state.value=='All'}
				/>
				<Select
					showSearch
					value={this.state.value}
					placeholder={this.props.placeholder}
					style={this.props.style}
					defaultActiveFirstOption={false}
					showArrow={false}
					filterOption={false}
					onSearch={this.handleSearch}
					onChange={this.handleChange}
					notFoundContent={null}
					allowClear={true}
				>
					{options}
				</Select>
			</div>
		);
	}
}


