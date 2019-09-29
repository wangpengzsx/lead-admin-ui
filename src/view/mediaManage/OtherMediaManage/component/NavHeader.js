import React from "react";
import { Link } from "react-router-dom";
export default class NavHeader extends React.Component {
	jiaoyan(path){
		let aaa=false;
		if(location.pathname==path){
			aaa=true
		}
		return aaa;
	}
	render() {
		return (
			<div className="navheader">
				<div className={this.jiaoyan('/mediaTypeManage')?"nav-span border-bottm-blue":"nav-span"} >
					<Link to={{ pathname: '/mediaTypeManage' }}> 媒体类型管理</Link>
				</div>
				<div className={this.jiaoyan('/adPermissionSet')?"nav-span border-bottm-blue":"nav-span"} >
					<Link to={{ pathname: '/adPermissionSet' }}> 广告位权限设置</Link>
				</div>
				<div className={this.jiaoyan('/adBillingSet')?"nav-span border-bottm-blue":"nav-span"} >
					<Link to={{ pathname: '/adBillingSet' }}> 广告计费设置</Link>
				</div>
			</div>

		)
	}
}
