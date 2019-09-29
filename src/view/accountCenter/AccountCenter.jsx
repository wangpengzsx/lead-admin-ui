import React from "react";
import "../../styles/common.css";
import Layout from "../../layout/Layout";


export default class AccountCenter extends React.Component {
	render() {
		return (
			<div>
				<Layout history={this.props.history}/>
				<div className="content">
					<div className="navheader">
						&nbsp;&nbsp;账户中心
					</div>

				</div>
			</div>
		)
	}
}
