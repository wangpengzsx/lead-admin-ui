import React from "react";
import "../../styles/common.css";
import Layout from "../../layout/Layout";
import Client from "../../common/lead-api";
import HintAlert from "../common/HintAlert";
import SkylightMangeStore from "../../mobx/skylightManage/skylight-manage-store";
import $ from "jquery";
import { observer } from "mobx-react";

@observer
export default class EditAdSkylight extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			value: '',
			name: '',
			clickTargetURL: '',
			fields: [],
			nameError: false,
			urlError: false,
			isConfirm: false,
			ids: this.props.location.id,
			adTypes: this.props.location.adTypes,
			sizes: this.props.location.sizeId
		}
		console.log(this.props)
	}
	componentWillMount() {
		Client.getNullArgument('dormant/findAllById?id=' + this.props.location.id).then(res => {
			this.setState({
				clickTargetURL: res.creative.clickTargetURL,
				fields: res.creative.fields,
				creativeState: res.creative.creativeState
			})
			SkylightMangeStore.getFiled1(this.props.location.formId, res.creative.fields)
		})
	}


	confirm() {
		this.setState({ isConfirm: true })
		this.isUrl(this.state.clickTargetURL)
		let { fields } = SkylightMangeStore

		if (this.state.fields.length == fields.length && this.state.clickTargetURL != '') {
			let data = {}
			if (this.props.location.spaceId) {
				data = {
					id: this.props.location.id,
					creative: {
						clickTargetURL: this.state.clickTargetURL,
						fields: this.state.fields,
						adForm: { id: this.props.location.formId },
						sizeId: { id: this.props.location.sizeId },
						creativeState: this.state.creativeState
					},
					adSpace: { id: this.props.location.spaceId },
					// appGroup: { id:this.props.location.appgroupId },
					adForm: { id: this.props.location.formId },
					sizeId: { id: this.props.location.sizeId },
					clickAction: this.props.location.clickAction,
					adType: this.props.location.adType
				}
			} else {
				data = {
					id: this.props.location.id,
					creative: {
						clickTargetURL: this.state.clickTargetURL,
						fields: this.state.fields,
						adForm: { id: this.props.location.formId },
						sizeId: { id: this.props.location.sizeId },
						creativeState: this.state.creativeState
					},
					//adSpace: { id: this.props.location.spaceId },
					appGroup: { id: this.props.location.appgroupId },
					adForm: { id: this.props.location.formId },
					sizeId: { id: this.props.location.sizeId },
					clickAction: this.props.location.clickAction,
					adType: this.props.location.adType
				}
			}
			console.log(data);
			SkylightMangeStore.mod(data, this.callback.bind(this))
		} else {
			Client.showTank(false, '请按要求填写信息');
		}
	}
	onChange(e) {
		SkylightMangeStore.getleadAdForms(e.target.value);
		this.setState({
			value: e.target.value
		})
	}

	callback() {
		this.props.history.push({ pathname: '/skylightManage' })
	}
	aaa(i) {
		if (i.type == "IMAGE") {
			return '图片尺寸' + i.constraints[0].value + '×' + i.constraints[1].value + ',' + '大小不超过' + i.constraints[2].value;
		}
		if (i.type = "TEXT") {
			return i.constraints[0].desc
		}
	}
	textChange(e, name, k, disc) {
		let shuzu = SkylightMangeStore.fields;
		if (disc == '不超过13个字符') {
			if (Client.isMax13(e.target.value)) {
				shuzu[k].error = false
			} else {
				shuzu[k].error = true
			}
		} else {
			if (Client.isMax20(e.target.value)) {
				shuzu[k].error = false
			} else {
				shuzu[k].error = true
			}
		}
		SkylightMangeStore.fields = shuzu;
		let arr = this.state.fields;
		let aaa = false,
			index = 0
		for (let i = 0; i < arr.length; i++) {
			if (arr[i].name == name) {
				aaa = true;
				index = i
				break;
			}
		}
		if (aaa) {
			arr[index].name = name;
			arr[index].value = e.target.value;
		} else {
			arr.push({
				name: name,
				value: e.target.value
			})
		}

		this.setState({
			fields: arr
		})
	}
	pipeizhi(name) {
		let aaa = false, ccc = '';
		for (let i = 0; i < this.state.fields.length; i++) {
			if (this.state.fields[i].name == name) {
				aaa = true
				ccc = this.state.fields[i].value
				break;
			}
		}
		if (aaa) {
			return ccc;
		} else {
			return '';
		}
	}
	onFileChange(name) {
		if ($(this.refs[name])[0].files[0]) {
			let that = this;
			let file = $(this.refs[name])[0].files[0];
			let fd = new FormData();
			fd.append('file', file);

			Client.uploder('file/upload', fd).then(res => {
				let shuzu = SkylightMangeStore.fields;
				for (let i = 0; i < shuzu.length; i++) {
					if (shuzu[i].name == name) {
						shuzu[i].filename = $(that.refs[name])[0].files[0].name;
						shuzu[i].value = res.data.signature
					}
				}
				SkylightMangeStore.fields = shuzu;

				console.log(res);

				let arr = that.state.fields;
				let aaa = false,
					index = 0
				for (let i = 0; i < arr.length; i++) {
					if (arr[i].name == name) {
						aaa = true;
						index = i
						break;
					}
				}
				if (aaa) {
					arr[index].name = name;
					arr[index].value = res.data.signature;
					//arr[index].value = Client.imgFile + res.data.signature;
				} else {
					arr.push({
						name: name,
						value: res.data.signature,

						//value: Client.imgFile + res.data.signature

					})
					console.log(arr)
				}

				that.setState({
					fields: arr
				})
			}).catch(() => {
				let shuzu = SkylightMangeStore.fields;
				for (let i = 0; i < shuzu.length; i++) {
					if (shuzu[i].name == name) {
						// Client.showTank(false, '支持JPG、PNG，且不超过199KB的文件');
						shuzu[i].filename = '文件上传失败';
					}
				}
				SkylightMangeStore.fields = shuzu;
			})
		}

	}

	isUrl(value) {
		if (Client.isUrl(value)) {
			this.setState({
				urlError: false
			})
		} else {
			this.setState({
				urlError: true
			})
		}
	}
	urlChange(e) {
		if (this.state.isConfirm) this.isUrl(e.target.value);
		this.setState({ clickTargetURL: e.target.value })
	}
	// pipeizhi(name) {
	// 	let aaa = false, ccc = '';
	// 	for (let i = 0; i < this.state.fields.length; i++) {
	// 		if (this.state.fields[i].name == name) {
	// 			aaa = true
	// 			ccc = this.state.fields[i].value
	// 			break;
	// 		}
	// 	}
	// 	if (aaa) {
	// 		return ccc;
	// 	} else {
	// 		return '';
	// 	}
	// }
	imgs(adtypes, sizes) {
		let strs = '';
		if (adtypes === "插屏静图" && sizes === "POPUP:500x600") {
			strs = require('../../image/chaping500-600.jpg')
		} else if (adtypes === "插屏静图" && sizes === "POPUP:600x500") {
			strs = require('../../image/chaping600-500.jpg')
		} else if (adtypes === "插屏静图" && sizes === "POPUP:600x900") {
			strs = require('../../image/chaping600-900.jpg')
		} else if (adtypes === "插屏静图" && sizes === "POPUP:900x600") {
			strs = require('../../image/chaping900-600.jpg')
		} else if (adtypes === "插屏静图" && sizes === "POPUP:1280x720") {
			strs = require('../../image/chaping1280-720.jpg')
		} else if (adtypes === "插屏静图" && sizes === "POPUP:720x1280") {
			strs = require('../../image/chaping720-1280.jpg')
		} else if (adtypes === "banner静图" && sizes === "BANNER:640x100") {
			strs = require('../../image/banner640-100.jpg')
		} else if (adtypes === "banner静图" && sizes === "BANNER:1280x200") {
			strs = require('../../image/banner1280-200.jpg')
		} else if (adtypes === "banner静图" && sizes === "BANNER:1456x180") {
			strs = require('../../image/banner1456-180.jpg')
		} else if (adtypes === "开屏静图" && sizes === "OPENSCREEN:640x750") {
			strs = require('../../image/kaiping640-750.jpg')
		} else if (adtypes === "开屏静图" && sizes === "OPENSCREEN:640x925") {
			strs = require('../../image/kaiping640-925.jpg')
		} else if (adtypes === "开屏静图" && sizes === "OPENSCREEN:640x960") {
			strs = require('../../image/kaiping640-960.jpg')
		} else if (adtypes === "开屏静图" && sizes === "OPENSCREEN:640x1136") {
			strs = require('../../image/kaiping640-1136.jpg')
		} else if (adtypes === "开屏静图" && sizes === "OPENSCREEN:1024x590") {
			strs = require('../../image/kaiping1024-590.jpg')
		} else if (adtypes === "开屏静图" && sizes === "OPENSCREEN:1024x768") {
			strs = require('../../image/kaiping1024-768.jpg')
		}

		else if (adtypes === "一图一文（大图）" && sizes === "NATIVE:1200x800") {
			strs = require('../../image/yituyiwenda1200-800.jpg')
		} else if (adtypes === "一图一文（大图）" && sizes === "NATIVE:1280x720") {
			strs = require('../../image/yitulaingwen1280-720.jpg')
		} else if (adtypes === "一图一文（大图）" && sizes === "NATIVE:800x1200") {
			strs = require('../../image/yituliangwen800-1200.jpg')
		}

		else if (adtypes === "一图一文（小图）" && sizes === "NATIVE:1200x800") {
			strs = require('../../image/yituyiwenxiao1200-800.jpg')
		} else if (adtypes === "一图一文（小图）" && sizes === "NATIVE:1280x720") {
			strs = require('../../image/yi1280-720.jpg')
		} else if (adtypes === "一图一文（小图）" && sizes === "NATIVE:800x1200") {
			strs = require('../../image/xiaotu800-1200.jpg')
		}

		else if (adtypes === "三图一文" && sizes === "NATIVE:1200x800") {
			strs = require('../../image/santu1200-800.jpg')
		} else if (adtypes === "三图一文" && sizes === "NATIVE:800x1200") {
			strs = require('../../image/xiaosan800-1200.jpg')
		} else if (adtypes === "三图一文" && sizes === "NATIVE:1280x720") {
			strs = require('../../image/santu1280-720.jpg')
		}

		else if (adtypes === "一图两文" && sizes === "NATIVE:1280x720") {
			strs = require('../../image/yitulaingwen1280-720.jpg')
		} else if (adtypes === "一图两文" && sizes === "NATIVE:1200x800") {
			strs = require('../../image/yituyiwenda1200-800.jpg')
		} else if (adtypes === "一图两文" && sizes === "NATIVE:800x1200") {
			strs = require('../../image/yituliangwen800-1200.jpg')
		}

		else if (adtypes.substring(0, 4) === "贴片视频" && sizes === "VIDEO:1334x750") {
			strs = require('../../image/davideo.jpg')
		} else if (adtypes.substring(0, 4) === "贴片视频" && sizes === "VIDEO:750x487") {
			strs = require('../../image/xiaovideo.jpg')
		}


		return strs
	}
	wid(adtypes, sizes) {
		let wid = '';
		if (adtypes === "插屏静图" && sizes === "POPUP:500x600") {
			wid = "173px"
		} else if (adtypes === "插屏静图" && sizes === "POPUP:600x500") {
			wid = "174px"
		} else if (adtypes === "插屏静图" && sizes === "POPUP:600x900") {
			wid = "173px"
		} else if (adtypes === "插屏静图" && sizes === "POPUP:900x600") {
			wid = "173px"
		} else if (adtypes === "插屏静图" && sizes === "POPUP:1280x720") {
			wid = "175px"
		} else if (adtypes === "插屏静图" && sizes === "POPUP:720x1280") {
			wid = "174px"
		} else if (adtypes === "banner静图" && sizes === "BANNER:640x100") {
			wid = "173px"
		} else if (adtypes === "banner静图" && sizes === "BANNER:1280x200") {
			wid = "173px"
		} else if (adtypes === "banner静图" && sizes === "BANNER:1456x180") {
			wid = "173px"
		} else if (adtypes === "开屏静图" && sizes === "OPENSCREEN:640x750") {
			wid = "190px"
		} else if (adtypes === "开屏静图" && sizes === "OPENSCREEN:640x925") {
			wid = "190px"
		} else if (adtypes === "开屏静图" && sizes === "OPENSCREEN:640x960") {
			wid = "190px"
		} else if (adtypes === "开屏静图" && sizes === "OPENSCREEN:640x1136") {
			wid = "190px"
		} else if (adtypes === "开屏静图" && sizes === "OPENSCREEN:1024x590") {
			wid = "190px"
		} else if (adtypes === "开屏静图" && sizes === "OPENSCREEN:1024x768") {
			wid = "190px"
		} else if (adtypes === "一图一文（大图）" && sizes === "NATIVE:1200x800") {
			wid = "173px"
		} else if (adtypes === "一图一文（大图）" && sizes === "NATIVE:1280x720") {
			wid = "173px"
		} else if (adtypes === "一图一文（大图）" && sizes === "NATIVE:800x1200") {
			wid = "173px"
		}

		else if (adtypes === "一图一文（小图）" && sizes === "NATIVE:1200x800") {
			wid = "80px"
		} else if (adtypes === "一图一文（小图）" && sizes === "NATIVE:1280x720") {
			wid = "77px"
		} else if (adtypes === "一图一文（小图）" && sizes === "NATIVE:800x1200") {
			wid = "77px"
		}

		else if (adtypes === "三图一文" && sizes === "NATIVE:1200x800") {
			wid = "56px"
		} else if (adtypes === "三图一文" && sizes === "NATIVE:800x1200") {
			wid = "56px"
		} else if (adtypes === "三图一文" && sizes === "NATIVE:1280x720") {
			wid = "57px"
		}

		else if (adtypes === "一图两文" && sizes === "NATIVE:1280x720") {
			wid = "173px"
		} else if (adtypes === "一图两文" && sizes === "NATIVE:1200x800") {
			wid = "173px"
		} else if (adtypes === "一图两文" && sizes === "NATIVE:800x1200") {
			wid = "173px"
		}

		else if (adtypes.substring(0, 4) === "贴片视频" && sizes === "VIDEO:1334x750") {
			wid = "323px"
		} else if (adtypes.substring(0, 4) === "贴片视频" && sizes === "VIDEO:750x487") {
			wid = "289px"
		}

		return wid
	}
	heig(adtypes, sizes) {
		let heig = '';

		if (adtypes === "插屏静图" && sizes === "POPUP:500x600") {
			heig = "209px"
		} else if (adtypes === "插屏静图" && sizes === "POPUP:600x500") {
			heig = "145px"
		} else if (adtypes === "插屏静图" && sizes === "POPUP:600x900") {
			heig = "260px"
		} else if (adtypes === "插屏静图" && sizes === "POPUP:900x600") {
			heig = "115px"
		} else if (adtypes === "插屏静图" && sizes === "POPUP:1280x720") {
			heig = "99px"
		} else if (adtypes === "插屏静图" && sizes === "POPUP:720x1280") {
			heig = "309px"
		} else if (adtypes === "banner静图" && sizes === "BANNER:640x100") {
			heig = "28px"
		} else if (adtypes === "banner静图" && sizes === "BANNER:1280x200") {
			heig = "28px"
		} else if (adtypes === "banner静图" && sizes === "BANNER:1456x180") {
			heig = "22px"
		} else if (adtypes === "开屏静图" && sizes === "OPENSCREEN:640x750") {
			heig = "224px"
		} else if (adtypes === "开屏静图" && sizes === "OPENSCREEN:640x925") {
			heig = "276px"
		} else if (adtypes === "开屏静图" && sizes === "OPENSCREEN:640x960") {
			heig = "286px"
		} else if (adtypes === "开屏静图" && sizes === "OPENSCREEN:640x1136") {
			heig = "340px"
		} else if (adtypes === "开屏静图" && sizes === "OPENSCREEN:1024x590") {
			heig = "111px"
		} else if (adtypes === "开屏静图" && sizes === "OPENSCREEN:1024x768") {
			heig = "144px"
		}

		else if (adtypes === "一图一文（大图）" && sizes === "NATIVE:1200x800") {
			heig = "115px"
		} else if (adtypes === "一图一文（大图）" && sizes === "NATIVE:1280x720") {
			heig = "97px"
		} else if (adtypes === "一图一文（大图）" && sizes === "NATIVE:800x1200") {
			heig = "259px"
		}

		else if (adtypes === "一图一文（小图）" && sizes === "NATIVE:1200x800") {
			heig = "54px"
		} else if (adtypes === "一图一文（小图）" && sizes === "NATIVE:1280x720") {
			heig = "43px"
		} else if (adtypes === "一图一文（小图）" && sizes === "NATIVE:800x1200") {
			heig = "116px"
		}

		else if (adtypes === "三图一文" && sizes === "NATIVE:1200x800") {
			heig = "40px"
		} else if (adtypes === "三图一文" && sizes === "NATIVE:800x1200") {
			heig = "84px"
		} else if (adtypes === "三图一文" && sizes === "NATIVE:1280x720") {
			heig = "32px"
		}

		else if (adtypes === "一图两文" && sizes === "NATIVE:1280x720") {
			heig = "97px"
		} else if (adtypes === "一图两文" && sizes === "NATIVE:1200x800") {
			heig = "115px"
		} else if (adtypes === "一图两文" && sizes === "NATIVE:800x1200") {
			heig = "259px"
		}

		else if (adtypes.substring(0, 4) === "贴片视频" && sizes === "VIDEO:1334x750") {
			heig = "179px"
		} else if (adtypes.substring(0, 4) === "贴片视频" && sizes === "VIDEO:750x487") {
			heig = "190px"
		}
		return heig
	}
	ptop(adtypes, sizes) {
		let ptop = '';
		if (adtypes === "插屏静图" && sizes === "POPUP:500x600") {
			ptop = "96px"
		} else if (adtypes === "插屏静图" && sizes === "POPUP:600x500") {
			ptop = "105px"
		} else if (adtypes === "插屏静图" && sizes === "POPUP:600x900") {
			ptop = "99px"
		} else if (adtypes === "插屏静图" && sizes === "POPUP:900x600") {
			ptop = "100px"
		} else if (adtypes === "插屏静图" && sizes === "POPUP:1280x720") {
			ptop = "116px"
		} else if (adtypes === "插屏静图" && sizes === "POPUP:720x1280") {
			ptop = "47px"
		} else if (adtypes === "banner静图" && sizes === "BANNER:640x100") {
			ptop = "93px"
		} else if (adtypes === "banner静图" && sizes === "BANNER:1280x200") {
			ptop = "93px"
		} else if (adtypes === "banner静图" && sizes === "BANNER:1456x180") {
			ptop = "98px"
		} else if (adtypes === "开屏静图" && sizes === "OPENSCREEN:640x750") {
			ptop = "99px"
		} else if (adtypes === "开屏静图" && sizes === "OPENSCREEN:640x925") {
			ptop = "62px"
		} else if (adtypes === "开屏静图" && sizes === "OPENSCREEN:640x960") {
			ptop = "57px"
		} else if (adtypes === "开屏静图" && sizes === "OPENSCREEN:640x1136") {
			ptop = "29px"
		} else if (adtypes === "开屏静图" && sizes === "OPENSCREEN:1024x590") {
			ptop = "132px"
		} else if (adtypes === "开屏静图" && sizes === "OPENSCREEN:1024x768") {
			ptop = "117px"
		}

		else if (adtypes === "一图一文（大图）" && sizes === "NATIVE:1200x800") {
			ptop = "101px"
		} else if (adtypes === "一图一文（大图）" && sizes === "NATIVE:1280x720") {
			ptop = "101px"
		} else if (adtypes === "一图一文（大图）" && sizes === "NATIVE:800x1200") {
			ptop = "101px"
		}

		else if (adtypes === "一图一文（小图）" && sizes === "NATIVE:1200x800") {
			ptop = "102px"
		} else if (adtypes === "一图一文（小图）" && sizes === "NATIVE:1280x720") {
			ptop = "102px"
		} else if (adtypes === "一图一文（小图）" && sizes === "NATIVE:800x1200") {
			ptop = "109px"
		}


		else if (adtypes === "三图一文" && sizes === "NATIVE:1200x800") {
			ptop = "112px"
		} else if (adtypes === "三图一文" && sizes === "NATIVE:800x1200") {
			ptop = "111px"
		} else if (adtypes === "三图一文" && sizes === "NATIVE:1280x720") {
			ptop = "111px"
		}


		else if (adtypes === "一图两文" && sizes === "NATIVE:1280x720") {
			ptop = "101px"
		} else if (adtypes === "一图两文" && sizes === "NATIVE:1200x800") {
			ptop = "101px"
		} else if (adtypes === "一图两文" && sizes === "NATIVE:800x1200") {
			ptop = "111px"
		}

		else if (adtypes.substring(0, 4) === "贴片视频" && sizes === "VIDEO:1334x750") {
			ptop = "33px"
		} else if (adtypes.substring(0, 4) === "贴片视频" && sizes === "VIDEO:750x487") {
			ptop = "28px"
		}
		return ptop
	}
	prig(adtypes, sizes) {
		let prig = '';
		if (adtypes === "插屏静图" && sizes === "POPUP:500x600") {
			prig = "107px"
		} else if (adtypes === "插屏静图" && sizes === "POPUP:600x500") {
			prig = "107px"
		} else if (adtypes === "插屏静图" && sizes === "POPUP:600x900") {
			prig = "107px"
		} else if (adtypes === "插屏静图" && sizes === "POPUP:900x600") {
			prig = "107px"
		} else if (adtypes === "插屏静图" && sizes === "POPUP:1280x720") {
			prig = "107px"
		} else if (adtypes === "插屏静图" && sizes === "POPUP:720x1280") {
			prig = "107px"
		} else if (adtypes === "banner静图" && sizes === "BANNER:640x100") {
			prig = "108px"
		} else if (adtypes === "banner静图" && sizes === "BANNER:1280x200") {
			prig = "108px"
		} else if (adtypes === "banner静图" && sizes === "BANNER:1456x180") {
			prig = "108px"
		} else if (adtypes === "开屏静图" && sizes === "OPENSCREEN:640x750") {
			prig = "100px"
		} else if (adtypes === "开屏静图" && sizes === "OPENSCREEN:640x925") {
			prig = "100px"
		} else if (adtypes === "开屏静图" && sizes === "OPENSCREEN:640x960") {
			prig = "100px"
		} else if (adtypes === "开屏静图" && sizes === "OPENSCREEN:640x1136") {
			prig = "100px"
		} else if (adtypes === "开屏静图" && sizes === "OPENSCREEN:1024x590") {
			prig = "100px"
		} else if (adtypes === "开屏静图" && sizes === "OPENSCREEN:1024x768") {
			prig = "100px"
		}

		else if (adtypes === "一图一文（大图）" && sizes === "NATIVE:1200x800") {
			prig = "102px"
		} else if (adtypes === "一图一文（大图）" && sizes === "NATIVE:1280x720") {
			prig = "102px"
		} else if (adtypes === "一图一文（大图）" && sizes === "NATIVE:800x1200") {
			prig = "103px"
		}

		else if (adtypes === "一图一文（小图）" && sizes === "NATIVE:1200x800") {
			prig = "195px"
		} else if (adtypes === "一图一文（小图）" && sizes === "NATIVE:1280x720") {
			prig = "195px"
		} else if (adtypes === "一图一文（小图）" && sizes === "NATIVE:800x1200") {
			prig = "198px"
		}

		else if (adtypes === "三图一文" && sizes === "NATIVE:1200x800") {
			prig = "106px"
		} else if (adtypes === "三图一文" && sizes === "NATIVE:800x1200") {
			prig = "106px"
		} else if (adtypes === "三图一文" && sizes === "NATIVE:1280x720") {
			prig = "106px"
		}

		else if (adtypes === "一图两文" && sizes === "NATIVE:1280x720") {
			prig = "102px"
		} else if (adtypes === "一图两文" && sizes === "NATIVE:1200x800") {
			prig = "102px"
		} else if (adtypes === "一图两文" && sizes === "NATIVE:800x1200") {
			prig = "198px"
		}


		else if (adtypes.substring(0, 4) === "贴片视频" && sizes === "VIDEO:1334x750") {
			prig = "110px"
		} else if (adtypes.substring(0, 4) === "贴片视频" && sizes === "VIDEO:750x487") {
			prig = "125px"
		}
		return prig
	}
	none() {
		let { fields } = SkylightMangeStore
		let arrs = fields
		let m = arrs.slice(1)
		console.log(m)
		return m

	}
	render() {
		let { fields, formId } = SkylightMangeStore
		console.log(fields)
		return (
			<div>
				<Layout history={this.props.history} />
				<div className="content">

					<div className="list-haed">
						<span className="dah1">
							基础信息
						</span>
						<span className="xiaoh1">
							请填写基础信息，带 <i className="red">*</i> 的为必填项
						</span>
					</div>
					<div className='contentBulk' style={{ position: 'relative', height: 400, margin: 0 }}>

						<div style={{}}>


							{
								<img style={{ position: 'absolute', top: "29px", right: "100px" }} src={this.imgs(this.state.adTypes, this.state.sizes)} alt="" />
							}



							<ul style={{ position: "absolute", top: this.ptop(this.state.adTypes, this.state.sizes), right: this.prig(this.state.adTypes, this.state.sizes), display: "flex" }}>
								{

									this.state.adTypes === "三图一文" ? (

										this.none().map((a, b) => (
											<li key={b} style={{ flex: 1, marginLeft: '2px' }}>
												{
													a.type == "IMAGE" ? <img src={Client.imgFile + a.value} alt="" style={{ width: this.wid(this.state.adTypes, this.state.sizes), height: this.heig(this.state.adTypes, this.state.sizes) }} /> : ""
												}
											</li>

										)
										)
									) : (
											fields.map((a, b) => (
												<li key={b} style={{ flex: 1, marginLeft: "5px" }}>
													{
														a.type == "IMAGE" ? <img src={Client.imgFile + a.value} alt="" style={{ width: this.wid(this.state.adTypes, this.state.sizes), height: this.heig(this.state.adTypes, this.state.sizes) }} /> : ""
													}
													{
														a.type == "VIDEO" ? (
															<div className="video">
																<video id="media" controls="controls" style={{ width: this.wid(this.state.adTypes, this.state.sizes), height: this.heig(this.state.adTypes, this.state.sizes) }} autoPlay>
																	<source src={Client.imgFile + a.value} type="video/mp4" />
																</video>
																<a href="" target="_blank" className="skip" style={{ width: this.wid(this.state.adTypes, this.state.sizes), height: this.heig(this.state.adTypes, this.state.sizes), }}></a>

															</div>
														) : ""

														//< video src={Client.imgFile + a.value}  style={{ width: this.wid(this.state.adTypes, this.state.sizes), height: this.heig(this.state.adTypes, this.state.sizes) }}></video> 

													}
												</li>

											)
											)
										)

								}
							</ul>

						</div>


						{fields.map((i, k) => (
							<div className="accountListRow" key={k}>
								<div className="form-left">
									<i className="red">*</i>&nbsp;{i.displayName}:
								</div>
								{
									i.type == "IMAGE" ? (
										<div className="form-right">
											{/* <img src={this.pipeizhi(i.name) == '' ? require('../../image/wenhao.jpg') : this.pipeizhi(i.name)} alt="" style={{ width: 50, height: 30 }} /> */}
											<input className="fileButton" type="file" title="" style={{ width: 250, height: 30 }}
												ref={i.name}
												onChange={() => this.onFileChange(i.name)} />
											<button>
												上传图片
												</button>
											<div style={{ paddingLeft: 10, height: 30, lineHeight: '30px', display: 'inline-block' }}>
												{i.filename}
											</div>

											<i className="color1">
												{/*{'图片尺寸'+i.constraints[0].value+'×'+i.constraints[1].value+','+'大小不超过'+i.constraints[2].value}*/}

											</i>
										</div>
									) : null
								}
								{
									i.type == "VIDEO" ? (
										<div className="form-right">
											<input className="fileButton" type="file" title="" style={{ width: 250, height: 30 }}
												ref={i.name}
												onChange={() => this.onFileChange(i.name)} />
											<button>
												上传视频
												</button>
											<div style={{ paddingLeft: 10, height: 30, lineHeight: '30px', display: 'inline-block' }}>
												{i.filename}
											</div>

											<i className="color1">

											</i>
										</div>
									) : null
								}
								{
									i.type == "TEXT" ? (
										<div className="form-right">
											<input type="text" className={i.error ? 'borderError' : 'border1'}
												style={{ width: 360, height: 30 }}
												onChange={(e) => { this.textChange(e, i.name, k, i.constraints[0].desc) }}
												value={this.pipeizhi(i.name)}
											/>
											{i.error ? (
												<HintAlert left={360} width={170}
													message={i.constraints[0].desc} />
											) : null}

											<i className="color1">
												{i.constraints[0].desc}
											</i>
										</div>
									) : null
								}
							</div>
						))}

						<div className="accountListRow">
							<div className="form-left">
								<i className="red">*</i>&nbsp; 跳转页URL:
							</div>
							<div className="form-right">
								<input type="text" className={this.state.urlError ? "borderError" : "border1"}
									style={{ width: 360, height: 30 }}
									value={this.state.clickTargetURL}
									onChange={e => this.urlChange(e)} />
								{this.state.urlError ? (
									<HintAlert left={360} width={170}
										message={this.state.clickTargetURL == '' ? "跳转url不能为空" : "跳转url格式不正确"} />
								) : null}
							</div>
						</div>
					</div>

					<div className="submit-content">
						<button className="cancelBtn" onClick={() => this.props.history.push({ pathname: '/skylightManage' })}>取消</button>
						<button className="confirmBtn" onClick={() => this.confirm()}>确定</button>
					</div>
				</div>
			</div>
		)
	}
}
AbortController
