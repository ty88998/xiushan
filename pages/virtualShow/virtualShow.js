// pages/virtualShow/virtualShow.js
import { getCollection, toProjectDetail, getSceneInfos } from '../../api/smallProgram'

const appInst = getApp()
const innerAudioContext = wx.createInnerAudioContext()
let status = false

Page({

  /**
   * 页面的初始数据
   */
  data: {
    indexInfo: {},
    scenes: {},
    orderNo: 0,
    playStatus: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    status = options.status
    this._getIndexData(options.recno)
  },

  async _getIndexData(recNo) {
    let touristNo = appInst.globalData.touristNo
    try {
      let collection
      if (status) {
        const indexInfo = await toProjectDetail({ recNo, touristNo })
        collection = await getCollection({ recNo: indexInfo.collectNo })
      } else {
        // 专题展进入
        collection = await getCollection({ recNo })
      }
      wx.setNavigationBarTitle({ title: collection.name })
      this.setData({ scenes: collection })
    } catch (error) {
      console.log('toProjectDetail error: ', error)
    }
  },
  payMp3() {
    this.data.playStatus ? innerAudioContext.pause() : innerAudioContext.play()
    this.setData({ playStatus: !this.data.playStatus })
  },
  onUnload() {
    this._leaveAndStopMp3()
  },
  /** 离开页面停止音乐播放 */
  _leaveAndStopMp3() {
    if (this.data.playStatus) innerAudioContext.stop()
    innerAudioContext.url = null
  },
  preImg() {
    wx.previewImage({
      current: this.data.scenes.sourceImg,
      urls: [this.data.scenes.sourceImg] 
      // current: "https://integrationplatform.oss-cn-chengdu.aliyuncs.com/IMG/秀山土家族苗族自治县文物管理所/99312684-8ae2-4997-9183-49ac0ebef885.jpg",
      // urls: ["https://integrationplatform.oss-cn-chengdu.aliyuncs.com/IMG/秀山土家族苗族自治县文物管理所/99312684-8ae2-4997-9183-49ac0ebef885.jpg"]
    })
  },
  goTo3D() {
    wx.showToast({
      title: '暂无3D展览',
      icon: 'none',
      duration: 1500
    })
    // wx.navigateTo({
    //   url: '',
    //   success: (result)=>{

    //   },
    //   fail: ()=>{},
    //   complete: ()=>{}
    // })
  }
})