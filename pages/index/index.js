//index.js
import { getWXOpenId, getMuseumsInfo, getNoticeInfos, getMuseumPicture } from '../../api/indexInfo'
import { setItem } from '../../utils/store'

const appInst = getApp()
const sourceImage = []

Page({
  data: {
    notice: [],
    museumInfo: {},
    liveShow: []
  },

  onLoad() {
    this._getOpenId()
    this._initData()
  },



  /** 通过异步操作，保证博物馆编号的存在 */
  async _initData() {
    try {
      const museumInfo = await getMuseumsInfo()
      setItem("museumNo", museumInfo.recNo)
      appInst.globalData.museumNo = museumInfo.recNo
      this.setData({ museumInfo })
      this._getIndexNotice(museumInfo.recNo)
      this._getMuseumPicture(museumInfo.recNo)
    } catch (err) {
      console.log(err)
    }
  },

  /** 获取首页公告 */
  _getIndexNotice(museumsInfoNo) {
    getNoticeInfos({ rows: 1, page: 1, museumsInfoNo })
      .then(res => {
        this.setData({
          notice: res.data[0]
        })
      }).catch(err => console.log(err))
  },

  /** 获取OpenId */
  _getOpenId() {
    wx.login({
      success: res => {
        if (res.code) {
          getWXOpenId({ code: res.code })
            .then(resp => {
              const openId = JSON.parse(resp.json).openid
              setItem('openid', openId)
              appInst.globalData.openId = openId
            }).catch(err => console.log(err))
        }
      }
    })
  },

  /** 页面跳转 */
  goToMore(e) {
    const { url, recno } = e.currentTarget.dataset
    if (recno == null) {
      wx.navigateTo({ url: url })
    } else {
      wx.navigateTo({ url: url + `?recNo=${recno}` })
    }
  },

  /** 获取展览数据 */
  // _getDisplays(museumsInfoNo) {
  //   getEntityDisplays({ rows: 5, page: 1, museumsInfoNo }).then(res => {
  //     this.setData({ liveShow: res.data })
  //   }).catch(err => console.log(err))
  // },

  _getMuseumPicture(museumsInfoNo) {
    getMuseumPicture({ museumsInfoNo }).then(res => {
      res.data.forEach(element => {
        sourceImage.push(element.sourceImg)
      })
      this.setData({ liveShow: res.data })
    }).catch(err => console.log(err))
  },
  preImg(event) {
    const imageUrl = event.currentTarget.dataset.image
    wx.previewImage({
      current: imageUrl,
      urls: sourceImage
    })
  },
})
