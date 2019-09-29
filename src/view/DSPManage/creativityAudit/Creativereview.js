import React from "react";
import Layout from "../../../layout/Layout";
import { Checkbox, Input, Pagination, Select, DatePicker, Modal, Button, Radio } from "antd";
import CreativereviewStore from '../../../mobx/dspManage/AdvertiserAudit/Creativereview-store'
import Client from "../../../common/lead-api"
import { observer } from "mobx-react";
const RadioGroup = Radio.Group;
const Option = Select.Option;
const headArr = [{ name: 'DSP名称', w: '10%' },
{ name: '创意id', w: '9%' },
{ name: '所属广告主', w: '11%' },
{ name: '图片预览', w: '11%' },
{ name: '创意名称', w: '11%' },
{ name: '审核状态', w: '11%' },
{ name: '提交时间', w: '13%' },
{ name: '更多信息', w: '11%' },
{ name: '审核', w: '10.5%' },
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
class SelectInput extends React.Component {
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
				placeholder="全部"
			>
				{option1}
				{options}
			</Select>
		);
	}
}
@observer
export default class Creativereview extends React.Component {
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
		CreativereviewStore.searchAccount(this.state.dspId, this.state.adId, this.state.adname, this.state.lState, this.state.Time, this.state.page-1, this.state.size);
		this.repetition();
	}
	repetition() {
		setTimeout(() => {
			CreativereviewStore.searchAccount(this.state.dspId, this.state.adId, this.state.adname, this.state.lState, this.state.Time, this.state.page-1, this.state.size);
		}, 300)
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
	query() {
		setTimeout(() => {
			this.repetition()
		}, 300)
	}
	onChanges(i) {
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
			arr1: arr
		});
	}
	isShow = (showId) => {
		this.setState({
			isshow: true,
			id: showId
		});
	}
	showOK = (e) => {
		this.setState({
			isshow: false,
		});
		CreativereviewStore.creatingAdvertiser({ ids: this.state.arr1, field: "creativeState", value: this.state.value }, this.callback.bind(this))
	}
	showCancel = (e) => {
		this.setState({
			isshow: false,
		});
	}
	showModal = (seeId) => {
		this.setState({
			visible: true,
			id: seeId
		});
	}
	handleOk = (e) => {
		this.setState({
			visible: false,
		});
		CreativereviewStore.creatingAdvertiser({ ids: [this.state.id], field: "creativeState", value: this.state.value }, this.callback.bind(this))
	}
	callback() {
		this.repetition()
	}
	handleCancel = (e) => {
		this.setState({
			visible: false,
		});
	}
	showModals = (seeInId) => {
		this.setState({
			visibles: true,
			ids: seeInId
		});
		CreativereviewStore.SeeInfo(seeInId)
	}
	handleOks = (e) => {
		this.setState({
			visibles: false,
		});
	}
	handleCancels = (e) => {
		this.setState({
			visibles: false,
		});
	}
	 onChange = (e) => {
		this.setState({
			value: e.target.value,
		});
		if (e.target.value === 'AuditFail') {
			document.querySelector(".textarea").style.display = "block"
		} else {
			document.querySelector(".textarea").style.display = "none"
		}
	}
	onChange1 = (e) => {
		this.setState({
			value: e.target.value,
		});
		if (e.target.value === 'AuditFail') {
			document.querySelector(".textarea1").style.display = "block"
		} else {
			document.querySelector(".textarea1").style.display = "none"
		}
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
		if (texts === "ONLINE") {
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
	onTimeChange(date,dateString) {
		this.setState({
			Time:dateString
		})
	}
	chakan(fields){
		for(let i=0;i<fields.length;i++){
			if(fields[i].type=='IMAGE'){
				window.open(fields[i].url);
			}
		}
	}
	callImg(fields){
		let imgArr=[]
		for(let i=0;i<fields.length;i++){
			if(fields[i].type=='IMAGE'){
				imgArr.push(fields[i])
			}
		}
		for(let i=0;i<imgArr.length;i++){
			if(imgArr[i].url){
				return imgArr[i].url
				break;
			}
		}
		return null
	}
	render() {
		let { CreativeArr, seeInfoArr, atotal } = CreativereviewStore
		return (
			<div>
				<Layout history={this.props.history} />
				<div className="content">
					<Modal
						title="基本信息"
						visible={this.state.visibles}
						onOk={this.handleOks}
						onCancel={this.handleCancels}
						okText="确定"
						cancelText="取消"
						footer={null}
						mask="false"
					>
						<div>
							{
								seeInfoArr.map((i, k) => (
									<div key={k}>
										<p>
											<span>素材尺寸:{i.width}×{i.height}</span>
											<span style={{ marginLeft: "20px" }}>尺寸:{i.creativeFormat}</span>
										</p>
										<p>跳转页URL:<a href="i.clickTargetURL">{i.clickTargetURL}</a></p>
										<div style={{ display: "flex" }}>
											<span style={{ marginTop: "8px", display: "block" }}>第三方曝光检测：</span><textArea defaultValue={i.thirdShowMonitor}></textArea>
										</div>
										<div style={{ display: "flex", marginTop: "10px" }}>
											<span style={{ marginTop: "8px", display: "block" }}>第三方点击检测：</span>
											<textArea defaultValue={i.thirdClickMonitor}></textArea>
										</div>
									</div>
								))
							}
							<div className="submit-flex-end" >
								<button className="modalCancelBtn" onClick={this.handleCancels} >取消</button>
								<button className="confirmBtn" onClick={this.handleOks}>确定</button>
							</div>
						</div>
					</Modal>
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
									<SelectInput onChange={this.adDspChange.bind(this)} style={{ width: 150 }} />
								</div>
							</div>
							<div className="listROwlet2">
								<div className="form-left" style={{ width: '35%' }}>
									按创意名称:
										</div>
								<div className="form-right" style={{ width: '40%' }}>
									<Input type="text" onChange={this.adNameChange.bind(this)} />
								</div>
							</div>
							<div className="listROwlet2">
								<div className="form-left" style={{ width: '35%' }}>
									按创意id:
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
										<Option value="ONLINE" >通过</Option>
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
									onChange={(date,dateString)=>{this.onTimeChange(date,dateString)}}
									style={{ width: '35%' }} placeholder="" />
							</div>
						</div>
					</div>
					<div style={{ paddingBottom: 10 }}>
						<button className="filtrateBtn" onClick={() => { this.query() }}>
							查询
						</button>
					</div>
					<div className="contentBulk1" style={{ marginTop: '10px' }}>
						<div style={{ width: '70px', height: '25px', textAlign: 'center', lineHeight: '25px', background: '#ccc', marginLeft: '20px', marginTop: '20px', marginBottom: '20px' }}>
							<Button type="primary" onClick={this.isShow} style={{ background: '#ccc', border: 'none' }}>
								批量操作
                            </Button>
							<Modal
								title="审核"
								visible={this.state.visible}
								onOk={this.handleOk}
								onCancel={this.handleCancel}
								footer={null}
							>
								<div>
									<RadioGroup onChange={this.onChange} value={this.state.value}>
										<Radio value="ONLINE">通过</Radio>
										<Radio value="AuditFail">拒绝</Radio>
									</RadioGroup>
								</div>
								<textArea defaultValue="拒绝原因" style={{ width: '100%', height: '100px', display: 'none', marginTop: "10px" }} className="textarea">
								</textArea>
								<div className="submit-flex-end" style={{ marginTop: "15px" }}>
									<button className="modalCancelBtn" onClick={this.handleCancel} >取消</button>
									<button className="confirmBtn" onClick={this.handleOk}>确定</button>
								</div>
							</Modal>
							<Modal
								title="审核"
								visible={this.state.isshow}
								onOk={this.showOK}
								onCancel={this.showCancel}
								footer={null}
							>
								<div>
									<RadioGroup onChange={this.onChange1} value={this.state.value}>
										<Radio value="ONLINE">通过</Radio>
										<Radio value="AuditFail">拒绝</Radio>
									</RadioGroup>
								</div>
								<textArea defaultValue="拒绝原因" style={{ width: '100%', height: '100px', display: 'none' }} className="textarea1">
								</textArea>
                                <div className="submit-flex-end" style={{ marginTop: "15px" }}>
									<button className="modalCancelBtn" onClick={this.showCancel} >取消</button>
									<button className="confirmBtn" onClick={this.showOK}>确定</button>
								</div>
							</Modal>
						</div>
						<div className="table-head1">
							<div style={{ width: '2%', float: 'left', textAlign: 'center' }}>
								<Checkbox onChange={(e) => {
									if (e.target.checked) {
										let arr = [];
										CreativeArr.map(i => arr.push(i.id));
										this.setState({
											chooseIdArr: arr,
											arr1:arr
										});
									} else {
										this.setState({
											chooseIdArr: []
										});
									}
								}}
									checked={this.state.chooseIdArr.length == CreativeArr.length}
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
						{CreativeArr.map((i, k) => (
							<div className="table-body" key={k} style={{ background: k % 2 == 0 ? '#fff' : '#fafafa' }}>
								<div style={{ width: '2%' }} className='gezi'>
									<Checkbox onChange={this.onChanges.bind(this, i.id)} checked={this.state.chooseIdArr.indexOf(i.id) > -1} />
								</div>
								<div style={{ width: headArr[0].w }} className='gezi'>
									{i.dspName}
								</div>
								<div style={{ width: headArr[1].w }} className='gezi'>
									{i.dspCreativeId}
								</div>
								<div style={{ width: headArr[2].w }} className='gezi'>
                                     {i.advertiserName}
								</div>
								<div style={{ width: headArr[3].w }} className='gezi'>
									{i.fields.length>0?
									<span className="imgModal" onClick={()=>{
										this.chakan(i.fields)
									}}>
										<span className='text-center'>
											点击查看图片
										</span>
										{this.callImg(i.fields)?<img src={this.callImg(i.fields)} alt="" style={{width:100,height:30}} className="dim"/>:null}
									</span>:null}
								</div>
								<div style={{ width: headArr[4].w }} className='gezi'>
									{i.name}
								</div>
								<div style={{ width: headArr[5].w, color: this.colors(i.creativeState) }} className='gezi'>
									{this.txt(i.creativeState)}
								</div>
								<div style={{ width: headArr[6].w }} className='gezi'>
									{Client.formatDateTime(i.modifyTime)}
								</div>
								<div style={{ width: headArr[7].w }} className='gezi'>
									<div>
										<button onClick={() => { this.showModals(i.id) }} className="borderBtn" style={{ minWidth: "66px" }}>
											查看
                                        </button>
									</div>
								</div>
								<div style={{ width: headArr[8].w, color: "#48bfeb" }} className='gezi'>
									<div onClick={() => { this.showModal(i.id) }
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
							onShowSizeChange={this.onShowSizeChange.bind(this)} defaultCurrent={1} total={atotal}
						/>
					</div>
				</div>
			</div>
		)
	}
}

