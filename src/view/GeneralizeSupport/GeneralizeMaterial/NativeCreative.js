import React from "react";
import Client from "../../../common/lead-api";
export default class NativeCreative extends React.Component {
	constructor(props){
		super(props)
		this.state={
			fileArr:[]
		}
	}
	componentWillMount(){
		let file1=this.props.location.fileds.adForm.fields;
		let file2=this.props.location.fileds.fields;
		for(let i=0; i<file2.length; i++){
			for(let j=0; j<file1.length; j++){
				if(file1[j].name==file2[i].name){
					file2[i].displayName=file1[j].displayName
				}
			}
		}
		this.setState({
			fileArr:file2
		})
	}
	render() {
		return (
			<div>
				<div className="content">
					<div className='contentBulk1' style={{paddingTop:10}}>
						{this.state.fileArr.map((i,k)=>(
							<div className="accountListRowNative"  key={k} >
								<div className="nativeLeft">
									{i.displayName}:
								</div>
								<div className="nativeRight">
									{
										i.type=='IMAGE'?(
											<img src={Client.imgFile+i.value} alt=""/>
										):i.value
									}
								</div>
							</div>
						))}
						<div className='submit-content'>
							<button className='confirmBtn'
									onClick={()=>{this.props.history.goBack()}}>返回</button>
						</div>
					</div>
				</div>
			</div>
		)
	}
}
