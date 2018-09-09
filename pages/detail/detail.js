// pages/detail.js
var app
var that
var testUrl = 'http://localhost:7080/wx/resource/list4item'
var formalUrl = 'https://wx.zooori.cn/wx/resource/list4item'
var commentUrl = 'https://wx.zooori.cn/wx/comment/list'
var commentAddUrl = 'https://wx.zooori.cn/wx/comment/add'
var nickName,email,content;
var GlobalItem;
var GlobalArr = [];
var GlobalId = 0;
var GlobalName;
var m3u8;
var isSeries = false;
var GlobalIndex  =0;//全局当前播放集数
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isDisplay: 'block',
    playImg:"../../dist/images/play.png",
    imgSrc:'',
    director:"",
    actor:"",
    publish:"",
    length:"",
    description:"",
    dType:"",
    isOn:true,
    isSeriesOn:true,
    series:[],
    blue:"#6195FF",
    isHide:true,
    comments:0,
    commensArr:[],
    val:"",
    hideTip:true,
    showVideo:true,
    m3u8Url:"https://v8.yongjiu8.com/20170822/INwk07IP/index.m3u8",
    hideInfo:false,
    showPlayBtn:false,
    toBack:true,
    videoTip:true,
    bdUrlWrap:true,
    password:"",
    bdUrl:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app = getApp()
    that = this
    var id = 0;
    var dType = 0;
    console.log(options);
    if (!options){
      var options_ = wx.getStorageSync('options');
      id = options_.id;
      dType = options_.type;
    }else{
      id = options.id;
      dType = options.type;
      wx.setStorageSync("options", options)
    }
    GlobalId = id;
    nickName = "" ;email = ""; content="";    
  
    this.requestData(dType,id)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.videoContext = wx.createVideoContext('myVideo');
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    if (getCurrentPages().length != 0) {
      //刷新当前页面的数据
      getCurrentPages()[getCurrentPages().length - 1].onLoad()
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  requestData: function (dataType, id) {
    that.setData({
      isDisplay: 'block',
      isHide: true
    })
    wx.request({
      url: formalUrl,
      data: {
        type: dataType,
        id: id
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      //header: { 'content-type': 'application/json' },// 默认值
      success: function (res) {
        var data = res.data.data;
        GlobalArr = data;
        //单剧集处理
        var obj = data[0];
        GlobalItem = obj;
          /*设置title*/
          wx.setNavigationBarTitle({
            title: obj.name
          })
        GlobalName = obj.name;
        var director = obj.director;
        if(director.length>11){
          director = director.substring(0,11)+"..."
        }
          var name = obj.name
          if(name.length>10){
            name = name.substring(0,10)+"..."
          }
          var actor = obj.actor
          if(actor.length>13){
            actor = actor.substring(0,15)+"..."
          }
          var description = obj.description.trim()
          description = description.replace(/[\r\n]/g, "");
          var detailType = obj.detailType;
          if(detailType.length>10){
            detailType.substring(0,10)+"..."
          }
          var isOn = obj.isOn;
          var flag = true;
          if(isOn==1){
            flag = false
          }
          that.setData({
            imgSrc:obj.imgSrc2,
            name:name,
            director:director,
            actor:actor,
            publish:obj.publish,
            length:obj.length,
            description:description,
            dType:detailType,
            isOn:flag
          })
        if (data.length>1){//多剧集处理
          isSeries = true;
          for(var i=0;i<data.length;i++){
            var sequence = data[i].sequence
            if (sequence<10){
              sequence = "0" + sequence;
            }
            data[i].sequence = sequence;
          }
            that.setData({
              isSeriesOn:false,
              series:data,
              showPlayPic:false//隐藏播放图片
            })
        }
      },
      fail: function () {

      },
      complete: function () {
        wx.stopPullDownRefresh();
        that.setData({
          isDisplay: 'none',
          isHide:false
        })
        //获取评论列表
        that.requestComment(id)
      }
    })
  },
  changeImg:function(e){
    console.log(e);
    var dType = e.type;
    if(dType=="touchstart"){
      that.setData({
        playImg:"../../dist/images/play_active.png"
      })
    }else{
      that.setData({
        playImg: "../../dist/images/play.png",
      })
      that.toPlay();
    }
  },
  toPlay:function(e){

    that.setData({
      isDisplay: 'block',
      isHide: false
    })

    that.setData({
      //m3u8Url: GlobalItem.m3u8,
      m3u8Url:"https://v8.yongjiu8.com/20170822/INwk07IP/index.m3u8",
      hideInfo: true,//隐藏资源信息
      showPlayPic: true,//隐藏播放图片，
      showPlayBtn: true,
      toBack: false
    })

    if (!isSeries){//播放单集
      if (!GlobalItem.m3u8 || GlobalItem.m3u8 == "无资源链接") {//无资源链接提示
        that.setData({
          videoTip: false
        })
      } else {//播放
        that.setData({
          showVideo: false,
          m3u8Url: GlobalItem.m3u8
        })
        that.videoContext.play();
      }
    }else{//多剧集

      if (e){
        GlobalIndex = e.currentTarget.dataset.index;
        if(!GlobalIndex){
          GlobalIndex = 0;
        }
      }

      //设置选中样式
      for(var i=0;i<GlobalArr.length;i++){
        that.setData({
            Index: GlobalIndex
        })

      }
      that.setData({
        series:GlobalArr
      })

      var obj = GlobalArr[GlobalIndex];
      if (!obj.m3u8 || obj.m3u8 == "无资源链接") {//无资源链接提示
        that.setData({
          videoTip: false
        })
      } else {//播放
        that.setData({
          showVideo: false,
          m3u8Url: obj.m3u8
        })
        that.videoContext.play();
      }
    }
    // 本地存储观看记录-------------开始
    if (GlobalItem) {
      var historys = wx.getStorageSync('historys') || []
      if (historys.length > 500) {
        historys = []
      }
      if(isSeries){
        var sIndex = GlobalIndex+1;
        GlobalItem.order = GlobalItem.name + "[" + sIndex+"]";
      }
      GlobalItem.viewTime = that.format();
      historys.unshift(GlobalItem)
      wx.setStorageSync('historys', historys)
    }
    // 本地存储观看记录-------------结束

    that.setData({
      isDisplay: 'none',
      isHide: false
    })
    
  },
  toBack:function(){
    that.setData({
      showVideo: true,
      hideInfo: false,//隐藏资源信息
      showPlayPic: false,//隐藏播放图片
      showPlayBtn: false,
      toBack: true,
      videoTip:true,
      Index:-1
    })
    that.videoContext.pause();
  },
  toBdCloud: function (e) {
    if (!GlobalItem.bdUrl || GlobalItem.bdUrl=="无资源链接"){
      wx.showModal({
        title: '资源提示',
        content: '暂无网盘资源分享链接',
        showCancel:false
      })
    }else{
      var bdUrl = GlobalItem.bdUrl;
      bdUrl = bdUrl.substring(3, bdUrl.length);
      bdUrl = bdUrl.replace("：", ":");
      var bdArr = bdUrl.split("密码:");
      var pass = bdArr[1];
      var url = bdArr[0];
      that.setData({
        bdUrlWrap:false,
        password:pass,
        bdUrl:url
      })
    }
  },
  requestComment: function (id) {
    wx.request({
      url: commentUrl,
      data: {
        id: id,
        pageNow:1,
        pageSize:1000
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      //header: { 'content-type': 'application/json' },// 默认值
      success: function (res) {
        var data = res.data.data
        for(var i=0;i<data.length;i++){
          var nickName = data[i].nickName;
          if(nickName.length>10){
            data[i].nickName = nickName.substring(0,10)+"...";
          }
          var time = data[i].created;
          data[i].created = that.getDateDiff(time);
        }
        that.setData({
          comments:data.length,
          commentArr:data
        })
        if(data.length==0){
          that.setData({
            hideTip:false
          })
        }else{
          that.setData({
            hideTip: true
          })
        }
       
      },
      fail: function () {

      },
      complete: function () {
        that.setData({
          isDisplay: 'none',
          isHide: false
        })
      }
    })
  },
  getDateDiff:function(dateStr){
    var publishTime = that.getDateTimeStamp(dateStr) / 1000,
      d_seconds,
      d_minutes,
      d_hours,
      d_days,
      timeNow = parseInt(new Date().getTime() / 1000),
      d,

      date = new Date(publishTime * 1000),
      Y = date.getFullYear(),
      M = date.getMonth() + 1,
      D = date.getDate(),
      H = date.getHours(),
      m = date.getMinutes(),
      s = date.getSeconds();
    //小于10的在前面补0
    if (M < 10) {
      M = '0' + M;
    }
    if (D < 10) {
      D = '0' + D;
    }
    if (H < 10) {
      H = '0' + H;
    }
    if (m < 10) {
      m = '0' + m;
    }
    if (s < 10) {
      s = '0' + s;
    }

    d = timeNow - publishTime;
    d_days = parseInt(d / 86400);
    d_hours = parseInt(d / 3600);
    d_minutes = parseInt(d / 60);
    d_seconds = parseInt(d);

    if (d_days > 0 && d_days < 3) {
      return d_days + '天前';
    } else if (d_days <= 0 && d_hours > 0) {
      return d_hours + '小时前';
    } else if (d_hours <= 0 && d_minutes > 0) {
      return d_minutes + '分钟前';
    } else if (d_seconds < 60) {
      if (d_seconds <= 0) {
        return '刚刚发表';
      } else {
        return d_seconds + '秒前';
      }
    } else if (d_days >= 3 && d_days < 30) {
      return M + '-' + D + '&nbsp;' + H + ':' + m;
    } else if (d_days >= 30) {
      return Y + '-' + M + '-' + D + '&nbsp;' + H + ':' + m;
    }
  },
  getDateTimeStamp: function (dateStr){
    return Date.parse(dateStr.replace(/-/gi, "/"));
  },
  inputVal:function(e){
    var dType = e.currentTarget.dataset.type;
    var val = e.detail.value;
    if(dType=="nickName"){
      nickName = val.trim();
    }else if(dType=="email"){
      email = val.trim();
    }else{
      content = val.trim();
    }
  },
  submit:function(e){
    if(!nickName){
      wx.showModal({
        title: '提示',
        content: '我们好像很想知道您的称谓',
        showCancel:false,
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      })
      return
    }
    if (!email) {
      wx.showModal({
        title: '提示',
        content: '邮箱不能为空喔!',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      })
      return
    }

    var reg = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$");
    if (!reg.test(email)) {
      wx.showModal({
        title: '提示',
        content: '邮箱格式貌似不正确呢!',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      })
      return;
    }
    if(!content){
      wx.showModal({
        title: '提示',
        content: '我猜您肯定忘了写一些感想!',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      })
      return;
    }

    that.setData({
      isDisplay: 'block',
      isHide: true
    })

    wx.request({
      url: commentAddUrl,
      data: {
        rid: GlobalId,
        nickName: nickName,
        email: email,
        content:content,
        count:that.data.comments
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      //header: { 'content-type': 'application/json' },// 默认值
      success: function (res) {
        var data = res.data.data
        if(res.data.code==1){
          that.setData({
            val:""
          })
          that.requestComment(GlobalId,1,1000);
        }
      },
      fail: function () {

      },
      complete: function () {
        that.setData({
          isDisplay: 'none',
          isHide: false
        })
      }
    })
  },
  toResponse:function(){
    wx.showModal({
      title: '提示',
      content: '貌似是资源不可播放了是吗?',
      showCancel: true,
      success: function (res) {
        if (res.confirm) {

          that.setData({
            isDisplay: 'block',
            isHide: true
          })

          wx.request({
            url: "https://wx.zooori.cn/wx/resource/report",
            data: {
              id: GlobalId,
              name: GlobalName
            },
            method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            //header: { 'content-type': 'application/json' },// 默认值
            success: function (res) {
              var data = res.data.data
              if (res.data.code == 1) {
                wx.showModal({
                  title: '提交成功',
                  content: '小哥哥将尽快处理问题呢 /比❤',
                  showCancel: false,
                  success: function (res) {
                    if (res.confirm) {
                      console.log('用户点击确定')
                    }
                  }
                })
              }
            },
            fail: function () {

            },
            complete: function () {
              that.setData({
                isDisplay: 'none',
                isHide: false
              })
            }
          })
        }
      }
    })
  },
  format:function(){
    var date = new Date();
    var year = date.getFullYear(),
      month = date.getMonth() + 1,//月份是从0开始的
      day = date.getDate(),
      hour = date.getHours(),
      min = date.getMinutes(),
      sec = date.getSeconds();
    var newTime = year + '-' +
      (month < 10 ? '0' + month : month) + '-' +
      (day < 10 ? '0' + day : day) + ' ' +
      (hour < 10 ? '0' + hour : hour) + ':' +
      (min < 10 ? '0' + min : min) + ':' +
      (sec < 10 ? '0' + sec : sec);

    return newTime;         
  }
})