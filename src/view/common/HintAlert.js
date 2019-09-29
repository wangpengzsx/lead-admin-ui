import React from "react";
export default class HintAlert extends React.Component {
	constructor(){
		super()
	}
	render() {
		return (
			<div style={{minWidth:this.props.width,height:30,position:'absolute',top:0,left:this.props.left}}>
				<div style={{minWidth:this.props.width,height:30,position:'relative'}}>
					<img src={require('../../image/jiantou.png')} alt="" className="directionImg"/>
					<div className="tishikuang" style={{width:this.props.width-20}}>
						{this.props.message}
					</div>
				</div>
			</div>
		)
	}
}
