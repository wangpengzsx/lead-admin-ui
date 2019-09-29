import React from "react";
export default class LabelInput extends React.Component {
	constructor(props) {
		super(props);
		this.state={
			value:this.props.value
		}
	}
	onTypeChange(e){
		this.setState({
			value: e.target.value
		})
		this.props.call(e.target.value)
	}
	render() {
		return (
			<div className="listROwlet2" style={{minHeight:40,lineHeight: '30px'}}>
				<div className="form-left" style={{ width: '30%' }}>
					{this.props.label}：
				</div>
				<div className="form-right-multiple" style={{ width: '50%' }}>
					<input
						placeholder={this.props.placeholder}
						value={this.state.value}
						className="border1"
						onChange={(e)=>this.onTypeChange(e)}
						style={{ width: '100%' ,marginLeft:10}}
					/>
				</div>
			</div>

		)
	}
}
