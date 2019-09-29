import React from "react";
import "../../styles/common.css";
import Layout from "../../layout/Layout";
import { Icon, Input, Pagination, Select, Switch } from "antd";
import Client from "../../common/lead-api"

import GeneralizeManageStore from '../../mobx/generalizeSupport/generalize-manage-store'
// import SkylightManageStore from '../../mobx/skylightManage/skylight-manage-store'
import { Link } from "react-router-dom";
import { observer } from "mobx-react";
const Option = Select.Option;
const headArr = [{ name: '广告位名称', w: '14%' },
{ name: '广告形式名称', w: '12%' },
{ name: '天窗设置状态', w: '9%' },
{ name: '所属应用', w: '9%' },
{ name: '广告位类型', w: '9%' },
{ name: '应用类型', w: '9%' },
{ name: '广告位尺寸', w: '9%' },
{ name: '素材规格', w: '9%' },
{ name: '最后更新时间', w: '9%' },
{ name: '操作', w: '10%' },
];

const headArr2 = [{ name: '广告位名称', w: '8.5%' },
{ name: '广告形式名称', w: '7%' },
{ name: '天窗设置状态', w: '5%' },
{ name: '所属应用', w: '5%' },
{ name: '广告位类型', w: '6%' },
{ name: '应用类型', w: '5%' },
{ name: '广告位尺寸', w: '5.5%' },
{ name: '素材规格', w: '5%' },
{ name: '最后更新时间', w: '5.5%' },
{ name: '操作', w: '5.8%' },
];

const editArr = [
	{
		name: "已设置",
		value: 'true'
	}, {
		name: '未设置',
		value: 'false'
	}
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


@observer
export default class SkylightManage extends React.Component {
	constructor() {
		super()
		this.state = {
			userName: '',
			edit: localStorage.getItem("editd")?localStorage.getItem("editd"):'',
			appId: localStorage.getItem("appd")?localStorage.getItem("appd"):'',
			typeId:localStorage.getItem("typed")?localStorage.getItem("typed"):'',
			formId: '',
			sizeId: localStorage.getItem('sized')?localStorage.getItem("sized"):'',
			size: 1,
			page: 5
		}

	}
	componentDidMount() {
		GeneralizeManageStore.getAppArr();
		//GeneralizeManageStore.getAdFormsArr();
		GeneralizeManageStore.getAdSpaceSizes();
		GeneralizeManageStore.getSpaceFormList({
			appId: '',
			adType: '',
			adFormId: '',
			spaceSizeId: '',
			adSpaceId: '',
			setState: ''
		});

	}
	searchUser() {
		GeneralizeManageStore.getOursSpace()
	}

	reset() {
		// console.log(this.state.edit)
	}
	getSpace() {
		let data = {};
		if (this.state.appId.indexOf('@') > -1) {
			let str = this.state.appId.substr(1);
			data = {
				appId: str,
				adType: this.state.typeId,
				adFormId: this.state.formId,
				spaceSizeId: this.state.sizeId,
				setState: this.state.edit
			}
		} else {

			let str = this.state.appId.substr(1);
			data = {
				appGroupId: str,
				adType: this.state.typeId,
				adFormId: this.state.formId,
				spaceSizeId: this.state.sizeId,
				setState: this.state.edit
			}
			console.log(data)
		}
		//  console.log(data)
		GeneralizeManageStore.getSpaceFormList(data);
	}

	query() {
		setTimeout(() => {
			this.getSpace();
		}, 300)
	}
	onEditChange(e) {// 设置状态
		this.setState({
			edit: e
		})
		localStorage.setItem("editd",e)
	}
	onTypeChange(e) {//广告位类型
		this.setState({ typeId: e })
		localStorage.setItem("typed",e)

	}
	onAppChange(e) {//所属应用
		this.setState({
			appId: e
		})
		localStorage.setItem("appd",e)
	}
	onSizeChange(e) {//广告位大小
		console.log(e);
		this.setState({
			sizeId: e
		})
		localStorage.setItem("sized",e)

	}
	substr(str) {
		return str.substr(0, str.length - 1)
	}
	render() {
		let { appArr, AdForms, adSizes, SpaceFormList, dormantRatio } = GeneralizeManageStore;
		//  console.log(appArr)
		return (
			<div>
				<Layout history={this.props.history} hasNav={true} />
				<div className="content">
					<div className="contentBulk1" style={{ paddingTop: 20 }}>
						<div className="accountListRow" >
							<div className="listRowLet">
								<div className="form-left" style={{ width: '35%' }}>
									天窗设置状态:
								</div>
								<div className="form-right" style={{ width: '50%' }}>
									<Select defaultValue={this.state.edit} style={{ width: 150, marginRight: 10 }}
										onChange={(e) => this.onEditChange(e)}>
										<Option value="" >全部</Option>
										<Option value="on" >已设置</Option>
										<Option value="off" >未设置</Option>
									</Select>
								</div>
							</div>
							<div className="listRowLet">
								<div className="form-left" style={{ width: '35%' }}>
									所属应用:
								</div>
								<div className="form-right" style={{ width: '50%' }}>
									<Select defaultValue={this.state.appId} style={{ width: 120 }} onChange={(e) => this.onAppChange(e)}>
										<Option value="" >全部</Option>
										{appArr.map((i, k) => (
											<Option value={i.APP_ID ? '@' + i.APP_ID : '$' + i.APP_GROUP_ID} key={k}>{i.NAME}</Option>
										))}
									</Select>
								</div>
							</div>
						</div>
						<div className="accountListRow">
							<div className="listRowLet">
								<div className="form-left" style={{ width: '35%' }}>
									广告位类型:
								</div>
								<div className="form-right" style={{ width: '50%' }}>
									<Select defaultValue={this.state.typeId} style={{ width: 150, marginRight: 10 }}
										onChange={(e) => this.onTypeChange(e)}>
										<Option value="" >全部</Option>
										{typeArr.map((i, k) => (
											<Option value={i.value} key={k}>{i.name}</Option>
										))}
									</Select>
								</div>
							</div>
							<div className="listRowLet">
								<div className="form-left" style={{ width: '35%' }}>
									广告位尺寸:
								</div>
								<div className="form-right" style={{ width: '50%' }}>
									<Select defaultValue={this.state.sizeId} style={{ width: 120 }} onChange={(e) => this.onSizeChange(e)}>
										<Option value="" >全部</Option>
										{adSizes.map((i, k) => (
											<Option value={i.width + '*' + i.height} key={k}>{i.width}×{i.height}</Option>
										))}
									</Select>
								</div>
							</div>
						</div>
					</div>

					<div style={{ paddingBottom: 10 }}>
						<button className="filtrateBtn" onClick={() => { this.query() }}>
							查询
						</button>
					</div>


					<div className="contentBulk1" style={{ marginTop: "10px" }}>
						<div className="con-head" style={{ justifyContent: 'flex-start', marginTop: "10px", marginBottom: "10px" }}>
							天窗设置完成度:
                            <div className="Bar" style={{ marginLeft: "20px", marginTop: "3px" }}>
								<div style={{ width: "90%", display: "flex" }}>
									<progress value={this.substr(dormantRatio)} max="100"></progress>
									{dormantRatio}
								</div>
							</div>
						</div>
						<div className="table-head">
							{
								headArr.map((i, k) => (
									<div key={k} style={{ width: i.w, float: 'left', textAlign: 'center', color: '#808080' }}>
										{i.name}
									</div>
								))
							}

						</div>
						{SpaceFormList.map((i, k) => {
							if (i.APP_GROUP_ID) {
								return (
									<div className="table-body1" key={k} style={{ height: i.allfrom.length * 40, background: k % 2 == 0 ? '#fff' : '#fafafa' }}>

										<div className="gezif juzhong" style={{ width: headArr2[0].w, height: i.allfrom.length * 40 }}>
											无
											</div>
										<div className="gezif juzhong" style={{ width: headArr2[1].w, height: i.allfrom.length * 40 }}>
											无
											</div>

										<div className="gezif" style={{ width: headArr2[2].w, height: i.allfrom.length * 40 }}>
											{/* {i.DORMANT_STATE == "true" ? "已设置" : "未设置"} */}
											{
												i.allfrom.map((a, b) =>

													(
														a.DORMANT_STATE == "true" ?
															<div className="xiaogezi" key={b} style={{ width: '100%' }}>
																已设置
															</div>
															: <div className="xiaogezi" key={b} style={{ width: '100%' }}>
																未设置
															</div>
													)

												)
											}

										</div>
										<div className="gezif juzhong" style={{ width: headArr2[3].w, height: i.allfrom.length * 40 }}>
											无
											</div>
										<div className="gezif" style={{ width: headArr2[4].w, height: i.allfrom.length * 40 }}>
											{
												i.allfrom.map((a, b) => (
													<div key={b} className="xiaogezi" style={{ width: '100%' }}>
														{a.AD_TYPE}
													</div>
												))
											}
										</div>
										<div className="gezif juzhong" style={{ width: headArr2[5].w, height: i.allfrom.length * 40 }}>
											{i.APP_GROUP_NAME}
										</div>
										<div className="gezif juzhong" style={{ width: headArr2[6].w, height: i.allfrom.length * 40 }}>
											无
											</div>
										<div className="gezif" style={{ width: headArr2[7].w, height: i.allfrom.length * 40 }}>
											{
												i.allfrom.map((a, b) => (
													<div key={b} className="xiaogezi" style={{ width: '100%' }}>
														{a.CREATIVE_FORMAT}
													</div>
												))
											}
										</div>
										<div className="gezif" style={{ width: headArr2[8].w, height: i.allfrom.length * 40 }}>

											{
												i.allfrom.map((a, b) => (
													<div key={b} className="xiaogezi" style={{ width: '100%' }}>
														{/* {Client.formatDateTime(a.MODIFY_TIME)} */}
														{
															a.MODIFY_TIME ? Client.formatDateTime(a.MODIFY_TIME) : ''
														}
													</div>
												))
											}
										</div>

										<div className="gezif " style={{ width: headArr2[9].w, height: i.allfrom.length * 40 }}>
											{
												i.allfrom.map((a, b) =>

													(
														a.DORMANT_STATE == "true" ?
															<div className="xiaogezi" key={b} style={{ width: '100%' }}>
																<Link to={{
																	pathname: '/editAdSkylight',
																	id: a.DORMANT_ID,
																	formId: a.AD_FORM_ID,
																	adType: a.AD_TYPE,
																	appgroupId: i.APP_GROUP_ID,
																	adTypes:a.AD_FORM_NAME
																}}>
																	编辑
														            </Link>
															</div>
															: <div className="xiaogezi" key={b} style={{ width: '100%' }}>
																<Link to={{
																	pathname: '/newSky',
																	formId: a.AD_FORM_ID,
																	appgroupId: i.APP_GROUP_ID,
																	adType: a.AD_TYPE,
																	adTypes:a.AD_FORM_NAME
																}}>
																	设置
																	</Link>
															</div>
													)

												)
											}

										</div>
									</div>
								)
							} else {
								return (
									<div className="table-body" key={k} style={{ background: k % 2 == 0 ? '#fff' : '#fafafa' }}>
										<div style={{ width: headArr[0].w }} className='gezi'>
											{i.AD_SPACE_NAME}
										</div>
										<div style={{ width: headArr[1].w }} className='gezi'>
											{i.AD_FORM_NAME}
										</div>
										<div style={{ width: headArr[2].w }} className='gezi'>
											{i.DORMANT_STATE == "true" ? "已设置" : "未设置"}
										</div>
										<div style={{ width: headArr[3].w }} className='gezi'>
											{i.APP_NAME}
										</div>
										<div style={{ width: headArr[4].w }} className='gezi'>
											{i.AD_TYPE}
										</div>
										<div style={{ width: headArr[5].w }} className='gezi'>
											{i.APP_TYPE}
										</div>
										<div style={{ width: headArr[6].w }} className='gezi'>
											{i.WIDTH}×{i.HEIGHT}
										</div>
										<div style={{ width: headArr[7].w }} className='gezi'>
											{i.CREATIVE_FORMAT}
										</div>
										<div style={{ width: headArr[8].w }} className='gezi'>
											{
												i.MODIFY_TIME ? Client.formatDateTime(i.MODIFY_TIME) : ''
											}

										</div>
										<div style={{ width: headArr[9].w }} className='gezi'>
											{
												i.DORMANT_STATE == "true" ?
													<Link to={{
														pathname: '/editAdSkylight',
														id: i.DORMANT_ID,
														formId: i.AD_FORM_ID,
														spaceId: i.AD_SPACE_ID,
														sizeId: i.SPACE_SIZE_ID,
														clickAction: i.CLICK_EFFECT,
														adType: i.AD_TYPE,
														setState: i.DORMANT_STATE,
														adTypes: i.AD_FORM_NAME

													}}>
														编辑
													</Link> : <Link to={{
														pathname: '/newSky',
														formId: i.AD_FORM_ID,
														spaceId: i.AD_SPACE_ID,
														sizeId: i.SPACE_SIZE_ID,
														clickAction: i.CLICK_EFFECT,
														adType: i.AD_TYPE,
														setState: i.DORMANT_STATE,
														adTypes: i.AD_FORM_NAME
													}}>
														设置
													</Link>
											}
										</div>
									</div>
								)
							}
						})}
					</div>
				</div>
			</div >

		)
	}
}
