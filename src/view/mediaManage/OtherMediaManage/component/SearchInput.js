import React from "react";
export default class SearchInput extends React.Component {
	constructor(props){
		super(props)
		this.state={
			value:''
		}
	}
	onChange(e){
		this.setState({
			value:e.target.value
		})
		this.props.call(e.target.value)
	}
	render() {
		return (
			<div className="listROwlet2" style={{ lineHeight: '30px' }}>
				<div className="form-left" style={{ width: '30%' }}>
					{this.props.label}：
				</div>
				<div className="form-right-multiple" style={{ width: '50%' }}>
					<input type="text" className="border1" value={this.state.value}
						   onChange={(e)=>this.onChange(e)}
					/>
				</div>
			</div>

		)
	}
}
