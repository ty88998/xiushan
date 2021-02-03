// pages/topicShow/topicShow.js
import { toProjectDetail, getSceneInfos, getSceneCollect } from "../../api/smallProgram"
import { loginIntercept } from '../../utils/loginUtils'
import { formatRichText } from '../../utils/util'

const appInst = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    indexInfo: {},
    param: {
      page: 1,
      pagesize: 5,
      collectionSum: 1
    },
    scenes: [],
    collectionList: [],
    orderNo: 0,
    currentItem: 0,
    contentTitle: '',
    contentTime: '',
    contentBody: '',
    newRich:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this._getIndexData(options.recno)
    // this._setCurrentData(0)
  },


  // 获取展览信息
  async _getIndexData(recno) {
    let touristNo = appInst.globalData.touristNo
    try {
      const indexInfo = await toProjectDetail({ recNo: recno, touristNo })
      let newRich = formatRichText(indexInfo.knowledge)
      this.setData({
        indexInfo:indexInfo,newRich
      })
      wx.setNavigationBarTitle({ title:indexInfo.region + indexInfo.name })
      const sceneData = await getSceneInfos({ projectNo: indexInfo.recNo },{ toast:false })
      this.setData({ scenes: sceneData.data })
      if (indexInfo.display == '2' && sceneData.data.length > 0) {
        this.setData({ contentBody: sceneData.data[0].synopsis, contentTime: indexInfo.region, contentTitle: sceneData.data[0].name })
        let interval = setInterval(() => {
          if (this.data.orderNo < sceneData.data.length) {
            this.loadMore()
          } else {
            clearInterval(interval)
          }
        }, 1500)
      } else {
        this._setCurrentData(0)
        this.setData({ contentBody: indexInfo.preface, contentTime: indexInfo.region })
      }
    } catch (error) {
      console.log('error: ', error)
    }
  },

  /** 加载场景下的文物 */
  loadMore() {
    const { orderNo, scenes, collectionList } = this.data
    const sceneNo = scenes[orderNo].recNo
    // 添加场景数据
    collectionList.push({ ...scenes[orderNo], isScene: true, thumbnail: scenes[orderNo].imgURL })
    getSceneCollect({ sceneNo }).then(res => {
      // 给文物添加synopsis
      res.data.forEach(eleItem => {
        eleItem.synopsis = scenes[orderNo].synopsis
      })
      collectionList.push(...res.data)
      this.setData({
        collectionList,
        orderNo: orderNo + 1
      }, () => {
        if (orderNo === 1) {
          this._setCurrentData(0)
        }
      })
    }).catch(err => {
      console.log('err: ', err)
      this.setData({
        orderNo: orderNo + 1
      })
    })
  },

  goToVirtual(event) {
    const { recno, index } = event.currentTarget.dataset
    // 判断当前轮播图是否为文物，如果是就进行跳转
    if (!this.data.indexInfo.display === '2' || !this.data.collectionList[index].isScene) {
      loginIntercept({ url: '/pages/virtualShow/virtualShow', recno })
    }
  },

  /**
   * 轮播图滑动响应事件
   * 
   * @param { Event } event 
   */
  swiperChange(event) {
    const { current } = event.detail
    this._setCurrentData(current)
    this.setData({
      currentItem: current
    })
  },

  /**
   * 设置当前选中信息
   * 
   * @param { Number } current 当前轮播图下标
   */
  _setCurrentData(current) {
    const { indexInfo, scenes, collectionList } = this.data
    // 判断层级2为三层，1为两层
    if (indexInfo.display === "2") {
      const collectionItem = collectionList[current]
      // 判断contentBody是否发生变化
      if (collectionItem.synopsis !== this.data.contentBody) {
        this.setData({ contentBody: collectionItem.synopsis })
      }
      // 当前选中为场景则设置名称为项目名＋场景名，否则就是文物名称
      const contentTitle = collectionItem && collectionItem.isScene ? `${indexInfo.name}-${collectionItem.name}` : collectionItem.name
      this.setData({ contentTitle })
    } else {
      const temp = scenes[current]
      this.setData({
        contentTitle: temp.name
      })
    }
  }
})