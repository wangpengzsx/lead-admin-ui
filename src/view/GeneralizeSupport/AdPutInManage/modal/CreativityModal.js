import React from "react";
import Modal from 'react-modal';
import {Icon, Pagination, Checkbox} from "antd";
import Client from '../../../../common/lead-api';
import adCreativityStore from "../../../../mobx/generalizeSupport/AdPutInManage/ad-creativity-store";
import {observer} from "mobx-react";
const customStyles = {
	content: {
		top: '50%',
		left: '50%',
		right: 'auto',
		bottom: 'auto',
		marginRight: '-10%',
		transform: 'translate(-50%, -50%)',
		background: '#fff',
		position: 'fixed',
		width: 750,
		padding: 0,
	},
	overlay: {
		background: 'rgba(0,0,0,.5)'
	}
};
const headArr = [{name: '创意id', w: '16%'},
	{name: '创意', w: '16%'},
	{name: '创意名称', w: '16%'},
	{name: '创意尺寸', w: '16%'},
	{name: '素材规格', w: '16%'},
	{name: '上传时间', w: '16%'},

]
Modal.setAppElement('#app')
@observer
export default class CreativityModal extends React.Component {
	constructor() {
		super()
		this.state = {
			modalIsOpen: false,
			cycleState: 0,
			parentType: '',
			name: '',
			page: 1,
			size: 10,
			ids: []
		};
		this.openModal = this.openModal.bind(this);
		this.closeModal = this.closeModal.bind(this);
	}
	onCycleChange(e) {
		this.setState({cycleState: e.target.value})
	}
	openModal() {
		this.setState({modalIsOpen: true});
	}
	searchUser() {
		let {size, page, name} = this.state;
		let {putInTypeValue} = adCreativityStore;
		adCreativityStore.getChoiceCreativityArr(page, size, name, putInTypeValue)
	}
	onAllChange(e) {
		let {choiceCreativityArr} = adCreativityStore;
		let arr = [];
		if (e.target.checked) {
			choiceCreativityArr.map(i => arr.push(i.id))
		}
		this.setState({ids: arr})
	}
	onOneChange(i) {
		let arr = this.state.ids;
		if (arr.indexOf(i) > -1) {
			let index = arr.indexOf(i);
			if (index > -1) {
				arr.splice(index, 1);
			}
		} else {
			arr.push(i);
		}
		this.setState({
			ids: arr
		});
	}
	closeModal() {
		this.setState({modalIsOpen: false});
	}
	cancal() {
		this.closeModal()
	}
	confirm() {
		let arr = [];
		let creaArr = adCreativityStore.choiceCreativityArr;
		for (let i = 0; i < creaArr.length; i++) {
			for (let j = 0; j < this.state.ids.length; j++) {
				if (creaArr[i].id == this.state.ids[j]) {
					let clickTargetURL = creaArr[i].clickFallbackURL ? creaArr[i].clickFallbackURL : creaArr[i].clickTargetURL
					let clickFallbackURL = creaArr[i].clickTargetURL && creaArr[i].clickTargetURL.startsWith('http') ? '' : creaArr[i].clickTargetURL
					creaArr[i].clickTargetURL = clickTargetURL
					creaArr[i].clickFallbackURL = clickFallbackURL
					arr.push(creaArr[i])
				}
			}
		}
		adCreativityStore.choiceArr = arr
		this.closeModal()
	}
	onPageChange(page) {
		this.setState({page})
		setTimeout(()=>{
			this.searchUser()
		},300)
	}
	onShowSizeChange(page,size) {
		this.setState({page,size})
		setTimeout(()=>{
			this.searchUser()
		},300)
	}
	render() {
		let {choiceCreativityArr, total} = adCreativityStore
		return (
			<div>
				<Modal
					isOpen={this.state.modalIsOpen}
					onRequestClose={this.closeModal}
					style={customStyles}
					contentLabel="Example Modal"
				>
					<div style={{width: '100%', height: '100%'}}>
						<div className='modalHeader'>
							<div>
								<span>关联创意</span>
							</div>
							<div>
								<Icon type="close-circle" onClick={() => this.closeModal()}/>
							</div>
						</div>
						<div className="con-head" style={{paddingRight: 10}}>
							<div>
							</div>
							<div className="searchInput">
								<input type="text"
									   placeholder="请输入查询的名称和关键字"
									   onChange={(e) => this.setState({name: e.target.value})}
									   className='searchInputText'/>
								<div className='searchInputButton' onClick={() => this.searchUser()}></div>
							</div>
						</div>
						<div className='contentBulk1' style={{border: 'none'}}>
							<div className="table-head">
								<div
									style={{width: '4%', fontSize: 12, float: 'left', textAlign: 'center', height: 29}}>
									<Checkbox onChange={this.onAllChange.bind(this)}
											  checked={this.state.ids.length == choiceCreativityArr.length}/>
								</div>
								{headArr.map((i, k) => (
									<div key={k} style={{width: i.w, fontSize: 12, float: 'left', textAlign: 'center'}}>
										{i.name}
									</div>
								))}
							</div>
							<div style={{width: '100%'}}>
								{choiceCreativityArr.map((i, k) => (
									<div className="table-body" key={k}>
										<div className="geziwudian" style={{width: '4%', textOverflow: 'none'}}>
											<Checkbox onChange={this.onOneChange.bind(this, i.id)}
													  checked={this.state.ids.indexOf(i.id) > -1}/>
										</div>
										<div className="gezi" style={{width: headArr[0].w}}>
											{i.id}
										</div>
										<div className="gezi" style={{width: headArr[1].w}}>

										</div>
										<div className="gezi" style={{width: headArr[2].w}}>
											{i.name}
										</div>
										<div className="gezi" style={{width: headArr[3].w}}>
											{i.width}×{i.height}
										</div>
										<div className="gezi" style={{width: headArr[4].w}}>
											{i.creativeFormat}
										</div>
										<div className="gezi" style={{width: headArr[5].w}}>
											{Client.formatDateTime(i.createTime)}
										</div>
									</div>
								))}
							</div>
						</div>
						<div className="con-foot" style={{paddingLeft: 10}}>
							<Pagination pageSizeOptions={['10', '20', '50', '100']}
										showSizeChanger
										defaultPageSize={this.state.size}
										onChange={this.onPageChange.bind(this)}
										onShowSizeChange={this.onShowSizeChange.bind(this)}
										defaultCurrent={this.state.page} total={total}/>
						</div>
						<div className="submit-flex-end">
							<button className="modalCancelBtn" onClick={() => this.cancal()}>取消</button>
							<button className="confirmBtn" onClick={() => this.confirm()}>确定</button>
						</div>
					</div>
				</Modal>
			</div>
		)
	}
}
