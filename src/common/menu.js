export default [
	{
		id: "Home",
		name: "首页",
		path:'/',
		show:false,
		ischild:true,
	},
	{
		id: "Media",
		name: "流量管理",
		path:'/mediaManage',
		show:false,
		ischild:true,
		subLinks: [
			{
				id: "info",
				name: "应用管理",
				path:'/appManage',
				subLinks:[
					{
						id:'newApp',
						name:'新建应用',
						path:'/newApp'
					},
					{
						id:'editApp',
						name:'编辑应用信息',
						path:'/editApp'
					}
				]
			},
			{
				id: "adSpace",
				name: "广告位管理",
				path:'/adSpaceManage',
				subLinks:[
					{
						id:'newAdSpace',
						name:'新建广告位',
						path:'/newAdSpace'
					},
					{
						id:'editAdSpace',
						name:'编辑广告位',
						path:'/editAdSpace'
					},
					{
						id: "adSpace",
						name: "广告展现形式",
						path:'/formManage',
					},
					{
						id:'newForm',
						name:'新建广告位展现形式',
						path:'/newForm'
					},
					{
						id:'editForm',
						name:'编辑广告位展现形式',
						path:'/editForm'
					},

				]

			},

			{
				id:"flowGroups",
				name:"流量分组",
				path:'/flowGroups',
				subLinks:[
					{
						id:"newFlowGroups",
						name:"新建流量分组",
						path:"/newFlowGroups",
					},
					{
						id:'newFlowGroups1',
						name:"编辑流量分组",
						path:'/newFlowGroups1',
					}
				]
			},
			/*{
				id:"FlowDictionary",
				name:"流量字典表",
				path:"/FlowDictionary"
			},*/
			{
				id:"mediaTypeManage",
				name:"第三方媒体管理",
				path:"/mediaTypeManage"
			}
		]
	},
	{
		id: "DSP",
		name: "天窗管理",
		path:'/skylightManage',
		show:false
	},
	{
		id: "generalizeSupport",
		name: "投放管理",
		path:'/generalizeSupport',
		show:false,
		ischild:true,
		subLinks:[
			{
				id:'adPutInManage',
				name:'广告投放管理',
				path:'/adPutInManage',
				subLinks:[
					{
						id:'planList',
						name:'广告计划列表',
						path:'/planList',
						subLinks:[
							{
								id:'activityList',
								name:'广告活动列表',
								path:'/activityList',
								subLinks:[
									{
										id:'creativityList',
										name:'创意列表',
										path:'/creativityList',
										subLinks:[
											{
												id:'newCreativity',
												name:'上传创意',
												path:'/newCreativity'
											}
										]
									},

									{
										id:'newActivity',
										name:'创建广告活动',
										path:'/newActivity'
									}
								]
							},
							{
								id:'newPlan',
								name:'新建计划',
								path:'/newPlan'
							}
						]
					},
					{
						id:'newDsp',
						name:'新建广告主',
						path:'/newDsp'
					}
				]
			},
			{
				id:'generalizeManage',
				name:'推广活动管理',
				path:'/generalizeManage',
				subLinks:[
					{
						id:'newGeneralizeActivity',
						name:'新建推广活动',
						path:'/newGeneralizeActivity'
					}
				]
			},
			{
				id:'generalizeMaterial',
				name:'物料库',
				path:'/GeneralizeMaterial',
				subLinks:[
					{
						id:'uploadingOriginality',
						name:'上传创意',
						path:'/uploadingOriginality'
					},
					{
						id:'EditCreative',
						name:'编辑创意',
						path:'/editCreative'
					}
				]
			}
		]
	},
	{
		id: "renderSet",
		name: "打底设置",
		path:'/DSPManage',
		show:false,
		ischild:true,
		subLinks:[
			{
				id:"renderSet",
				name:"打底广告平台管理",
				path:"/renderSet",
			},
			{
				id:"putInStrategyManage",
				name:"投放策略管理",
				path:"/putInStrategyManage",
				subLinks:[
					{
						id:"AddPutInStrategy",
						name:'创建投放策略',
						path:'/AddPutInStrategy',
						subLinks:[
							{
								id:"equipmentSetCom",
								name:"设置投放设备",
								path:'/equipmentSetCom'
							}
						]
					}
				]
			},
			{
				id:"renderAdIncomeManage",
				name:"打底广告收入管理",
				path:"/renderAdIncomeManage",
				subLinks:[
					{
						id:"newTask",
						name:'新建任务',
						path:'/newTask'
					},
					{
						id:"previewTask",
						name:'预览任务内容',
						path:'/previewTask'
					}
				]
			},

		]
	},
	{
		id: "DSP",
		name: "DSP管理",
		path:'/DSPManage',
		show:false,
		ischild:true,
		subLinks:[
			{
				id:"DSPAccountManage",
				name:"DSP账户管理",
				path:"/DSPAccountManage",
				subLinks:[
					{
						id:"newAgent",
						name:"创建代理商",
						path:"/newAgent",

					},
					{
						id:"editAgent",
						name:"编辑",
						path:"/EditAgent"
					},
					{
						id:"flowReserveSet",
						name:"流量预定向设置",
						path:"/flowReserveSet"
					}
				]
			},
			{
				id:'AdvertiserAudit',
				name:'广告主审核',
				path:'/AdvertiserAudit',

			},
			{
				id:'Creativereview',
				name:'创意审核',
				path:'/CreativeReview',
			},
			{
				id:'filterStrategy',
				name:'过滤策略',
				path:'/filterStrategy',
				subLinks:[
					{
						id:'newFilterStrategy',
						name:'新建过滤策略',
						path:'/newFilterStrategy'
					}
				]
			},
			{
				id:'dealManage',
				name:'Deal管理',
				path:'/dealManage',
				subLinks:[
					{
						id:'newDeal',
						name:'新建Deal',
						path:'/newDeal'
					},
					{
						id:'editDeal',
						name:'编辑Deal',
						path:'/editDeal'
					}
				]
			}
		]
	},
	{
		id: "DMP",
		name: "数据平台",
		path:'/dataPlatform',
		show:false,
		ischild:true,
		subLinks:[
			{
				id: 'APID',
				name: '媒体报表',
				show:false,
				ischild:true,
				subLinks:[
					{
						id: 'APID',
						name: '媒体收入分析',
						path: '/mediaIncomeAnalyze',
					},{
						id: 'IndependentUser',
						name: '媒体独立用户表现',
						path: '/independentUser',
					},{
						id:'RevenueEnquiry',
						name: '第三方媒体收入查询',
						path: '/revenueEnquiry',
					}
				]
			},
			{
				id: 'APID',
				name: '渠道报表',
				show:false,
				ischild:true,
				subLinks:[
					{
						id:'ChannelRevenue',
						name: '渠道收入分析',
						path: '/channelRevenue',
					},{
						id:'APIDSP',
						name: '实时竞价收入分析',
						path: '/aPIDSP',
					},{
						id:'BottomingAds',
						name:'打底广告收入分析',
						path:'/bottomingAds'
					},{
						id:'PromotionSupport',
						name:'推广支持数据查询',
						path:'/promotionSupport'
					},{
						id:'SkyAd',
						name:'天窗广告数据查询',
						path:'/skyAd'
					}
				]
			},
			{
				id: 'APID',
				name: '直投报表',
				show:false,
				ischild:true,
				subLinks:[
					{
						id: 'putInEffect',
						name: '投放效果分析报表',
						path: '/putInEffect',
					},{
						id: 'hourDimensionality',
						name: '小时维度分析报表',
						path: '/hourDimensionality',
					},{
						id:'territoryDimensionality',
						name: '地域维度分析报表',
						path: '/territoryDimensionality',
					}
				]
			},
		]
	},
	{
		id: "finance",
		name: "财务中心",
		path: '/Refunds',
		show: false,
		ischild:true,
		subLinks: [
			{
				id: 'APID',
				name: 'APIDSP财务管理',
				path: '/Refunds',

			},

			{
				id: 'oMFMange',
				name: '第三方媒体财务管理',
				path: '/oMFMange',

			},
		]
	},
	{
		id: "Account",
		name: "账户中心",
		path:'/accountCenter',
		show:false,
		ischild:true,
		subLinks: [
			{
				id: "info",
				name: "个人信息",
				path:'/personalDetails',
			},
			{
				id: "manage",
				name: "账户管理",
				path:'/accountManage',
				subLinks:[
					{
						id:"editAccount",
						name:'编辑账户',
						path:'/editAccount'
					},
					{
						id:"newAccount",
						name:'新建账户',
						path:'/newAccount'
					}
				]
			},
			{
				id: "type",
				name: "账户类型管理",
				path:'/accountTypeManage',
				subLinks:[
					{
						id:"editAccountType",
						name:'编辑账户类型',
						path:'/editAccountType'
					},
					{
						id:"newAccountType",
						name:'新建账户类型',
						path:'/newAccountType'
					}

				]
			},
			{
				id:'logout',
				name:'退出登录',
				path:'/logout'
			}
		]
	},
];



