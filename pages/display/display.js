import { getItem } from "../../utils/store"
import { toProjectDetail, getSceneInfos, getSceneCollect } from "../../api/smallProgram"

const appInst = getApp();

Page({
	data: {
		isShade: true,
		loaded: false,
		orderNo: 0,
		param: {
			page: 1,
			pagesize: 5,
			collectionSum: 1
		},
		scenes: [],
		collections: [],
		isPlay: 0,
		audio_src: "",
	},
	onLoad: function (options) {
		this.getIndexData(options.recno);
		this.innerAudioContext = wx.createInnerAudioContext();
	},
	loadFont: function () {
		wx.loadFontFace({
			family: 'yuweiJ',
			source: 'url(https://3wcp.cqzrkj.cn/resource/zttext.ttf)',
			success: (res) => {
				console.log(res.status + "字体加载成功")
			},
			fail: (err) => {
				console.log(err);
			}
		});
	},

	// 获取展览信息
	getIndexData: function (recno) {

		let touristNo = appInst.globalData.touristNo;;
		toProjectDetail({ recNo: recno, touristNo }).then(res => {
			this.setData({
				indexInfo: res
			})
		}).then(() => {
			const { indexInfo } = this.data;
			if (indexInfo.display == '0') {
				getSceneInfos({ projectNo: indexInfo.recNo }).then(r => {
					this.setData({
						scenes: r.data[0]
					})
				});
			} else {
				this.loadInitInfo(indexInfo.recNo);
			}
		}).catch(err => console.log(err))
	},

	// 加载所有的场景
	loadInitInfo: function (projectNo) {
		getSceneInfos({ projectNo: projectNo })
			.then(res => {
				this.setData({
					scenes: res.data
				})
			}).then(() => {
				const { indexInfo, scenes, orderNo } = this.data;
				if (indexInfo.display == '2' && scenes.length > 0) {
					let interval = 0;
					interval = setInterval(() => {
						if (orderNo < scenes.length) {
							this.loadMore();
						} else {
							clearInterval(interval);
						}
					}, 1500);
				}
			}).catch(err => console.log(err))
	},
	// 加载场景下的文物
	loadMore() {
		const { orderNo, param, scenes } = this.data;
		let page = 'param.page';
		let collectionSum = 'param.collectionSum';
		if (param.collectionSum >= (param.page - 1) * param.pagesize) {
			param.sceneNo = scenes[orderNo].recNo;
			getSceneCollect(param, { loading: false }).then(res => {
				// console.log(res);
				let collections1 = scenes[orderNo].collections;
				var collections = 'scenes[' + orderNo + '].collections';
				let arr = [];
				if (collections1 == null) {
					arr = res.data;
				} else {
					arr = collections1;
					arr.concat(res.data);
				}
				this.setData({
					[collections]: arr,
					[collectionSum]: res.allNum,
					[page]: param.page + 1,
				});
			})
		} else {
			this.setData({
				orderNo: orderNo + 1,
				[page]: 1,
				[collectionSum]: 1
			});
		}
	},
	//   取消遮罩层
	shade: function (e) {
		this.setData({
			isShade: false
		})
	},
	// swiper 切换时
	swiperChange: function (e) {
		this.innerAudioContext.destroy()
	},

	//播放音频
	parentrun(e) {
		switch (e.detail.isplay) {
			case 0:
				this.innerAudioContext.src = e.detail.mp3
				this.innerAudioContext.play()
				break
			case 1:
				this.innerAudioContext.pause()
				break
			case 2:
				this.innerAudioContext.play()
				break
			default:
				this.innerAudioContext.destroy()
				this.innerAudioContext = wx.createInnerAudioContext()
		}
	},
	onUnload() {
		this.innerAudioContext.destroy();
		this.setData({
			isPlay: 0
		})
	}
})
