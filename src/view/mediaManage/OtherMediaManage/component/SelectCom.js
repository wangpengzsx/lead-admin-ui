import React from "react";
import {Select} from "antd";
const Option = Select.Option;
export default class SearchInput extends React.Component {
	constructor(props){
		super(props)
		this.state={
			value:''
		}
	}
	onChange(e){
		this.setState({
			value:e
		})
		this.props.call(e)
	}
	render() {
		return (
			<div className="listROwlet2" style={{ lineHeight: '30px' }}>
				<div className="form-left" style={{ width: '30%' }}>
					{this.props.label}：
				</div>
				<div className="form-right-multiple" style={{ width: '50%' }}>
					<Select defaultValue={'请选择'+this.props.label} style={{ width: 150 ,marginRight:10}}
							onChange={(e)=>this.onChange(e)}>
						<Option value="">全部</Option>
						{this.props.option.map((i,k)=>(
							<Option value={i.value} key={k}>{i.name}</Option>
						))}
					</Select>
				</div>
			</div>

		)
	}
}
