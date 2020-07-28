// pages/home/text.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    numChinese: ['一', '二', '三', '四', '五', '六', '七', '八', '九'],
    numChineseToNum: [1, 2, 3, 4, 5, 6, 7, 8, 9]
  },

  vopToProduct(vop) {
    let _this = this;
    if (_this.AnyCount(vop, '要') == 0 && _this.AnyCount(vop, '买') == 0) {
      /* wx.showToast({
          title: '未找到关键字("买","要")(例子：苹果"买"10个)',
          icon: 'none',
          duration: 2000
      }) */
      console.log('未找到关键字("买","要")(例子：苹果"买"10个)')
      return;
    }
    if (_this.AnyCount(vop, '要') > 1 || _this.AnyCount(vop, '买') > 1 || _this.AnyCount(vop, '要') + _this.AnyCount(vop, '买') > 1) {
      /* wx.showToast({
          title: '无法识别，请参照例子讲话',
          icon: 'none',
          duration: 2000
      }) */
      console.log('无法识别，请参照例子讲话')
      return;
    }

    let key = '';
    if (_this.AnyCount(vop, '要') > 0) {
      key = '要';
    }
    if (_this.AnyCount(vop, '买') > 0) {
      key = '买';
    }

    let splits = vop.split(key);
    let product = splits[0];
    if (product == '' || product == undefined) {
      /* wx.showToast({
          title: '商品无法识别，请参照例子讲话',
          icon: 'none',
          duration: 2000
      }) */
      console.log('商品无法识别，请参照例子讲话')
      return;
    }

    let num = splits[1];
    if (num == '' || num == undefined) {
      /* wx.showToast({
          title: '数量有误，无法识别',
          icon: 'none',
          duration: 2000
      }) */
      console.log('数量有误，无法识别')
      return;
    }
    if (_this.AnyCount(num, '亿') > 0) {
      /* wx.showToast({
                      title: '暂不支持到亿',
                      icon: 'none',
                      duration: 2000
      }) */
      console.log('暂不支持到亿')
      return;
    }
    let num_result = '';
    let numsplits = num.split('');
    if (numsplits[0] == '百' || numsplits[0] == '千' || numsplits[0] == '万') {
      /* wx.showToast({
                      title: '数量有误，无法识别',
                      icon: 'none',
                      duration: 2000
      }) */
      console.log('数量有误，无法识别')
      return;
    }

    //当出现两的时候
    if (_this.AnyCount(num, '两') > 0) {
      if (numsplits[0] != '两') {
        /* wx.showToast({
                    title: '数量有误，无法识别',
                    icon: 'none',
                    duration: 2000
        }) */
        console.log('数量有误，无法识别')
        return;
      }

      if (_this.AnyCount(num, '百') > 0 || _this.AnyCount(num, '千') > 0 || _this.AnyCount(num, '万') > 0) {
        if (_this.AnyCount(num, '百万') > 0 || _this.AnyCount(num, '千万') > 0) {
          if (numsplits[1] == '百' && numsplits[2] == '万') {
            console.log('商品', product);
            console.log('数量', '2000000');
            return;
          } else if (numsplits[1] == '千' && numsplits[2] == '万') {
            console.log('商品', product);
            console.log('数量', '20000000');
            return;
          }
        }

        if (numsplits[1] == '百') {
          console.log('商品', product);
          console.log('数量', '200');
          return;
        } else if (numsplits[1] == '千') {
          console.log('商品', product);
          console.log('数量', '2000');
          return;
        } else if (numsplits[1] == '万') {
          console.log('商品', product);
          console.log('数量', '20000');
          return;
        }
      }
    }

    //检查是否纯数字
    let AllNumResult = _this.AllNum(num.toString());
    if (AllNumResult != '') {
      console.log('商品', product);
      console.log('数量', AllNumResult);
      return;
    }

    //检查是否纯中文
    let AllChineseResult = _this.AllChinese(num.toString());
    if (AllChineseResult != '') {
      console.log('商品', product);
      console.log('数量', AllChineseResult);
      return;
    }

  },
  AllNum(text) {
    console.log('allnum', text);
    let str = '^[0-9]*$';
    let zz = new RegExp(str);
    let splits = text.split('');
    for (let i = 0; i < splits.length; i++) {
      if (!zz.exec(splits[i]) && i == 0) {
        console.log('不是纯数字');
        return '';
      }
      if (!zz.exec(splits[i])) {
        console.log('是纯数字');
        return text.substring(0, i);
      }
    }
    console.log('是纯数字');
    return text;
  },
  AllChinese(text) {
    let _this = this;

    //存在重字直接pass
    if (_this.Repeat(text)) {
      /*wx.showToast({
          title: '数量有误，无法识别',
          icon: 'none',
          duration: 2000
      }) */
      console.log('数量有误，无法识别')
      return;
    }

    let str = '^[0-9]*$';
    let zz = new RegExp(str);
    if (zz.exec(text)) {
      return '';
    }

    let Chinese = _this.data.numChinese;
    let ToNum = _this.data.numChineseToNum;


    //去掉后面单位
    let ClearResult = _this.ClearUnit(text);
    if (ClearResult == '') {
      /*wx.showToast({
          title: '数量有误，无法识别',
          icon: 'none',
          duration: 2000
      }) */
      console.log('数量有误，无法识别')
      return;
    }
    text = ClearResult;

    let splits = text.split('');
    if (splits[0] == '百' || splits[0] == '千' || splits[0] == '万') {
      /*wx.showToast({
          title: '数量有误，无法识别',
          icon: 'none',
          duration: 2000
      }) */
      console.log('数量有误，无法识别')
      return;
    }
    let result = 0;

    if (_this.AnyCount(text, '百') > 0 || _this.AnyCount(text, '千') > 0 || _this.AnyCount(text, '万') > 0) {
      console.log('存在百千万')
      for (var i = 0; i < splits.length; i++) {
        if (splits[i] == '百' || splits[i] == '千' || splits[i] == '万') {
          if (splits[i + 1] == '百' || splits[i + 1] == '千' || splits[i + 1] == '万') {
            if (splits[i + 2] == '百' || splits[i + 2] == '千' || splits[i + 2] == '万') {
              /*wx.showToast({
                  title: '数量有误，无法识别',
                  icon: 'none',
                  duration: 2000
              }) */
              console.log('数量有误，无法识别')
              return;
            }
            let mergeSign = splits[i] + splits[i + 1];
            if (mergeSign != '百万' && mergeSign != '千万') {
              /*wx.showToast({
                  title: '数量有误，无法识别',
                  icon: 'none',
                  duration: 2000
              }) */
              console.log('数量有误，无法识别')
              return;
            }
            let KeyIndex = _this.KeyAny(Chinese, splits[i - 1]);
            if (mergeSign == '百万') {
              result = result + ToNum[KeyIndex] * 1000000;
            } else if (mergeSign == '千万') {
              result = result + ToNum[KeyIndex] * 10000000;
            }

          } else {
            let KeyIndex = _this.KeyAny(Chinese, splits[i - 1]);
            if (KeyIndex != '') {
              if (splits[i] == '百') {
                result = result + ToNum[KeyIndex] * 100;
              } else if (splits[i] == '千') {
                result = result + ToNum[KeyIndex] * 1000;
              } else if (splits[i] == '万') {
                result = result + ToNum[KeyIndex] * 10000;
              }
            }
          }
        } else {
          //剩余的数
          if (splits[i] == '十') {
            let lastKeyIndex = _this.KeyAny(Chinese, splits[i - 1]);
            result = result + ToNum[lastKeyIndex] * 10;
            if(splits.length > i+1){
              let nextKeyIndex = _this.KeyAny(Chinese, splits[i + 1]);
              result = result + ToNum[nextKeyIndex] * 1;
            }
            
            continue;
          }
        }


      }
      return result;
    } else {
      console.log('没有百千万')
      console.log('有十', splits.length)
      for (let i = 0; i < splits.length; i++) {
        if (splits[i] == '十') {
          if (i == 0) {
            result = 10;
          } else {
            result = result * 10;
          }
          continue;
        }

        console.log('splits', splits[i])
        let KeyIndex = _this.KeyAny(Chinese, splits[i]);
        console.log('KeyIndex', KeyIndex)
        if (KeyIndex !== '') {
          result = result + ToNum[KeyIndex] * 1;
        } else {
          /*wx.showToast({
              title: '数量有误，无法识别',
              icon: 'none',
              duration: 2000
          }) */
          console.log('数量有误，无法识别')
          return;
        }
      }
      console.log('result', result);
      return result;
    }
  },
  KeyAny(list, key) {
    for (let i = 0; i < list.length; i++) {
      if (list[i] == key) {
        return i;
      }
    }
    return '';
  },
  ClearUnit(text) {
    let _this = this;
    let list = text.split('');
    let Chinese = _this.data.numChinese;
    for (let i = 0; i < list.length; i++) {
      let KeyIndex = _this.KeyAny(Chinese, list[i]);
      if (KeyIndex == '' && i == 0 && list[i] != '十' && list[i] != '百' && list[i] != '千' && list[i] != '万') {
        return '';
      } else if (KeyIndex == '' && list[i] != '十' && list[i] != '百' && list[i] != '千' && list[i] != '万') {
        return text.substring(0, i + 1);
      }
    }
  },
  Repeat(text) {
    let list = text.split('');
    for (let i = 0; i < list.length - 1; i++) {
      if (list[i] == list[i + 1]) {
        return true;
      }
    }
  },
  AnyCount(text, key) {
    let num = 0;
    let list = text.split('');
    for (let i = 0; i < list.length; i++) {
      if (list[i] == key) {
        num = num + 1;
      }
    }
    return num;
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let query = '苹果买52165个';
    console.log('开始', query);
    this.vopToProduct(query);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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

  }
})