import { observable, action } from "mobx";
import Client from '../../common/lead-api'
class SkylightManageStore {
	@observable seylightArr = [];
	@observable fields = [];
	@observable forms = [];
	@observable formId = '';
	@observable sizeArr = [];
	@observable sizeId = '';
	@observable appArr = [];
	@observable spaceId = "";
	@observable appGroupId = "";
	@action
	getAppArr() {
		Client.getNullArgument('someQuery/getNoGroupAppList').then(res => {
			this.appArr = res;
		})
	}
	@action
	creatingSky(data, callback) {
		Client.createObject('dormant/saveOrUpdateDormant', data).then(res => {
			if (res) {
				callback()
			}
		})
	}
	@action
	mod(data, callback) {
		Client.createObject('dormant/saveOrUpdateDormant', data).then(res => {
			if (res) {
				callback()
			}
		})
	}
	@action
	getFiled(id) {
		Client.getNullArgument('media/form?id=' + id).then(res => {
			for (let i = 0; i < res.fields.length; i++) {
				res.fields[i].filename = '未选择文件'
			}
			this.fields = res.fields;
		})
	}
	@action
	getFiled1(id, field) {
		Client.getNullArgument('media/form?id=' + id).then(res => {
			for (let i = 0; i < res.fields.length; i++) {
				for (let j = 0; j < field.length; j++) {
					if (res.fields[i].name == field[j].name) {
						res.fields[i].filename = field[j].fileName
						res.fields[i].value=field[j].value
					}
				}
			}
			this.fields = res.fields;
		})
	}
	@action
	getSizeArr(id) {
		Client.getNullArgument('dormant/findAllById?id=' + id).then(res => {
			for (let i = 0; i < res.creative.adForm.fields.length; i++) {
				res.creative.adForm.fields[i].error = false
			}
			this.fields = res.creative.adForm.fields;
		})
	}
	@action
	getAdSpace(data) {
		Client.getleadArr('dormant/getDormantList', data).then(res => {
			this.SpaceFormListInfo = res.allList;
		})
	}
}
const skylightManageStore = new SkylightManageStore();
export default skylightManageStore;
