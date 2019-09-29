import React from "react";
import Layout from "../../../layout/Layout";
import { Checkbox, Input, Pagination, Select, DatePicker} from "antd";
import AdvertiserManageStore from '../../../mobx/dspManage/AdvertiserAudit/AdvertiserAudit-store'
import Client from "../../../common/lead-api"
import { observer } from "mobx-react";
const Option = Select.Option;
import AptitudeModal from "./modal/AptitudeModal"
import AuditModal from "./modal/AuditModal"
const headArr = [{ name: 'DSP名称', w: '8.16%' },
{ name: '广告主id', w: '8.16%' },
{ name: '第三方广告主id', w: '8.16%' },
{ name: '广告主名称', w: '8.16%' },
{ name: '广告主公司', w: '8.16%' },
{ name: '所属代理商', w: '8.16%' },
{ name: '网址', w: '8.16%' },
{ name: '行业类别', w: '8.16%' },
{ name: '资质查看', w: '8.16%' },
{ name: '提交时间', w: '8.16%' },
{ name: '审核状态', w: '8.16%' },
{ name: '审核', w: '8.16%' },
]
let timeout;
let currentValue;
function fetch(value, callback) {
	if (timeout) {
		clearTimeout(timeout);
		timeout = null;
	}
	currentValue = value;
	function fake() {
		Client.getleadArr('leadDsps/search/spec', { query: 'name==*' + value + '*' }).then(res => {
			callback(res._embedded.leadDsps);
		})
	}
	timeout = setTimeout(fake, 300);
}
class SearchInput extends React.Component {
	state = {
		data: [],
		value: undefined,
	}
	handleSearch = (value) => {
		fetch(value, data => this.setState({ data }));
	}
	handleChange = (value) => {
		this.setState({ value });
		this.props.onChange(value);
	}
	render() {
		const option1 = <Option value="">全部</Option>
		const options = this.state.data.map(d => <Option key={d.id} value={d.id}>{d.name}</Option>);
		return (
			<Select
				value={this.state.value}
				placeholder={this.props.placeholder}
				style={this.props.style}
				defaultActiveFirstOption={false}
				showArrow={true}
				onSearch={this.handleSearch}
				onFocus={() => this.handleSearch('')}
				onChange={this.handleChange}
				notFoundContent={null}
			>
				{option1}
				{options}
			</Select>
		);
	}
}
@observer
export default class AdvertiserAudit extends React.Component {
	constructor() {
		super()
		this.state = {
			visible: false,
			visibles: false,
			isshow: false,
			value: '',
			chooseIdArr: [],
			size:10,
			page: 1,
			typeId: '',
			type: '',
			dspId: '',
			adId: "",
			otherAdId: "",
			lState: "",
			Time: "",
			adname: "",
			sizes: 5,
			pages: 1,
			id: '',
			arr1: [],
			ids: ''
		}
	}
	componentWillMount() {
		AdvertiserManageStore.searchAccount(this.state.dspId, this.state.adId, this.state.adname, this.state.lState, this.state.Time,this.state.otherAdId, this.state.page - 1, this.state.size);
		this.repetition();
	}
	repetition() {
		setTimeout(() => {
			AdvertiserManageStore.searchAccount(this.state.dspId, this.state.adId, this.state.adname, this.state.lState, this.state.Time,this.state.otherAdId, this.state.page - 1, this.state.size);
		}, 300)
	}
	otherAdIdChange(e){
		this.setState({ otherAdId: e.target.value })
	}
	adIdChange(e) {
		this.setState({ adId: e.target.value })
	}
	adNameChange(e) {
		this.setState({ adname: e.target.value })
	}
	adDspChange(e) {
		this.setState({ dspId: e });
	}
	onTypeChange(e) {
		this.setState({
			lState: e
		})
	}
	onTimeChange(date, dateString) {
		this.setState({
			Time: dateString
		})
	}
	query() {
		setTimeout(() => {
			this.repetition()
		}, 300)
	}
	query1(){
		this.onPageChange(1)
	}
	auditOne(id,value,des){
		this._auditModal.openModal(id,value,des)
	}
	auditBatch(){
		if(this.state.chooseIdArr.length>0){
			this._auditModal.openModal(this.state.chooseIdArr)
		}else{
			Client.showTank(false,'请选择需要审核的广告主')
		}
	}
	callback() {
		this.repetition()
	}
	showAptitudeModal(id){
		this._aptitudeModal.openModal(id)
	}
	onPageChange(i) {
		this.setState({
			page: i
		})
		this.repetition()
	}
	onShowSizeChange(current, pageSize) {
		this.setState({
			size: pageSize,
			page: 1
		})
		this.repetition();
	}
	txt(texts) {
		let str = '';
		if (texts === "ONLINE" ) {
			str = "通过"
		} else if (texts === "UNKNOWN") {
			str = "未审核"
		} else if (texts === "AuditFail") {
			str = "未通过"
		}
		return str;
	}
	colors(col) {
		let str = '';
		if (col === "AuditFail") {
			str = "#ff8800"
		}
		else if (col === "ONLINE") {
			str = "#00cc66"
		} else {
			str = "#333";
		}
		return str;
	}
	chooseOne(i) {
		let arr = this.state.chooseIdArr;
		if (arr.indexOf(i) > -1) {
			let index = arr.indexOf(i);
			if (index > -1) {
				arr.splice(index, 1);
			}
		} else {
			arr.push(i);
		}
		this.setState({
			chooseIdArr: arr,

		});
	}
	chooseAll(e) {
		let { AdvertiserArr} = AdvertiserManageStore
		if (e.target.checked) {
			let arr = [];
			AdvertiserArr.map(i => arr.push(i.id));
			this.setState({
				chooseIdArr: arr,
			});
		} else {
			this.setState({
				chooseIdArr: []
			});
		}
	}
	render() {
		let { AdvertiserArr, total} = AdvertiserManageStore
		return (
			<div>
				<Layout history={this.props.history} />
				<AptitudeModal ref={e=>this._aptitudeModal=e}/>
				<AuditModal ref={e=>this._auditModal=e} call={()=>this.repetition()}/>
				<div className="content">
					<div className="list-haed">
						<span className="dah1">
							筛选条件
						</span>
					</div>
					<div className="contentBulk" style={{ paddingTop: 20 }}>
						<div className="accountListRow" >
							<div className="listROwlet2">
								<div className="form-left" style={{ width: '35%' }}>
									DSP名称:
										</div>
								<div className="form-right" style={{ width: '50%' }}>
									<SearchInput onChange={this.adDspChange.bind(this)} style={{ width: 150 }} />
								</div>
							</div>
							<div className="listROwlet2">
								<div className="form-left" style={{ width: '35%' }}>
									按广告主名称:
										</div>
								<div className="form-right" style={{ width: '40%' }}>
									<Input type="text" onChange={this.adNameChange.bind(this)} />
								</div>
							</div>
							<div className="listROwlet2">
								<div className="form-left" style={{ width: '35%' }}>
									按广告主id:
										</div>
								<div className="form-right" style={{ width: '40%' }}>
									<Input type="text" onChange={this.adIdChange.bind(this)} />
								</div>
							</div>
							<div className="listROwlet2">
								<div className="form-left" style={{ width: '35%' }}>
									按审核状态:
										</div>
								<div className="form-right" style={{ width: '50%' }}>
									<Select defaultValue="全部" style={{ width: 120 }} onChange={(e) => { this.onTypeChange(e) }}>
										<Option value="" >全部</Option>
										<Option value="ONLINE">通过</Option>
										<Option value="AuditFail" >未通过</Option>
										<Option value="UNKNOWN" >未审核</Option>
									</Select>
								</div>
							</div>
							<div className="listROwlet2">
								<div className="form-left" style={{ width: '35%' }}>
									按提交时间:
								</div>
								<DatePicker
									format="YYYY-MM-DD"
									onChange={(date, dateString) => { this.onTimeChange(date, dateString) }}
									style={{ width: '35%' }} placeholder="" />
							</div>
							<div className="listROwlet2">
								<div className="form-left" style={{ width: '35%' }}>
									第三方广告主id:
								</div>
								<div className="form-right" style={{ width: '40%' }}>
									<Input type="text" onChange={this.otherAdIdChange.bind(this)} />
								</div>
							</div>
						</div>
					</div>
					<div style={{ paddingBottom: 10 }}>
						<button className="filtrateBtn" onClick={() => { this.query1() }}>
							查询
						</button>
					</div>
					<div className="contentBulk1" style={{ marginTop: '10px' }}>
						<div style={{ width: '70px', height: '25px', textAlign: 'center', lineHeight: '25px', background: '#ccc', marginLeft: '20px', marginTop: '20px', marginBottom: '20px' }}>
							<button  onClick={()=>this.auditBatch()} className="borderBtn">
								批量操作
                            </button>
						</div>
						<div className="table-head1">
							<div style={{ width: '2%' }} className="gezi">
								<Checkbox onChange={(e) => { this.chooseAll(e) }}
									checked={this.state.chooseIdArr.length == AdvertiserArr.length}
								/>
							</div>
							{
								headArr.map((i, k) => (
									<div key={k} style={{ width: i.w }} className="gezi">
										{i.name}
									</div>
								))
							}
						</div>
						{AdvertiserArr.map((i, k) => (
							<div className="table-body" key={k} style={{ background: k % 2 == 0 ? '#fff' : '#fafafa' }}>
								<div style={{ width: '2%' }} className='gezi'>
									<Checkbox onChange={this.chooseOne.bind(this, i.id)} checked={this.state.chooseIdArr.indexOf(i.id) > -1} />
								</div>
								<div style={{ width: headArr[0].w }} className='gezi'>
									{i.dspName}
								</div>
								<div style={{ width: headArr[1].w }} className='gezi'>
									{i.id}
								</div>
								<div style={{ width: headArr[1].w }} className='gezi'>
									{i.advertiserId}
								</div>
								<div style={{ width: headArr[2].w }} className='gezi'>
									{i.name}
								</div>
								<div style={{ width: headArr[3].w }} className='gezi'>
									{i.companyName}
								</div>
								<div style={{ width: headArr[4].w }} className='gezi'>

								</div>
								<div style={{ width: headArr[5].w }} className='gezi'>
									{i.website}
								</div>
								<div style={{ width: headArr[6].w }} className='gezi'>
									{i.industryType}
								</div>
								<div style={{ width: headArr[7].w }} className='gezi'>
									<div>
										<button onClick={() => { this.showAptitudeModal(i.id) }} className="borderBtn" style={{ minWidth: "66px" }}>
											查看
                                        </button>
									</div>
								</div>
								<div style={{ width: headArr[8].w }} className='gezi'>
									{Client.formatDateTime(i.modifyTime)}
								</div>
								<div style={{ width: headArr[9].w, color: this.colors(i.lookState) }} className='gezi'>
									<span id="lookState">
										{this.txt(i.lookState)}
									</span>
								</div>
								<div style={{ width: headArr[9].w, color: "#48bfeb" }} className='gezi'>
									<div onClick={() => { this.auditOne(i.id,i.lookState,i.lookDescription) }
									}>审核</div>
								</div>
							</div>
						))}
					</div>
					<div className='con-head'>
						<Pagination
							pageSizeOptions={['10', '20', '50', '100']}
							showSizeChanger
							defaultPageSize={this.state.size}
							current={this.state.page}
							onChange={this.onPageChange.bind(this)}
							onShowSizeChange={this.onShowSizeChange.bind(this)} defaultCurrent={1} total={total}
						/>
					</div>
				</div>
			</div>
		)
	}
}
