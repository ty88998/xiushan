//app.js
import { baseApi, getItem, setItem } from './utils/store'

App.baseApi = baseApi

App({
  onLaunch() {
    wx.getSetting({
      success: result => {
        // if (result.authSetting['scope.userInfo']) {
        //   wx.getUserInfo({
        //     success: res => {
        //       setItem("userInfo", res.userInfo)
        //       this.globalData.userInfo = res.userInfo
        //     }
        //   })
        // }

        // 2021年4月13日起，authSetting不再稳定返回userInfo 2023.07.17修改
        if (wx.getStorageSync('userInfo')) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          this.globalData.userInfo = result.userInfo;
        }
      }
    })
  },
  globalData: {
    userInfo: getItem("userInfo"),
    touristNo: getItem("touristNo"),
    museumNo: getItem("museumNo"),
    openId: getItem("openid")
  }
})