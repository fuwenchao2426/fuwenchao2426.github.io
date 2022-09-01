// ==UserScript==
// @name        抖音数据大屏_专业版
// @namespace   Violentmonkey Scripts
// @match       https://compass.jinritemai.com/screen/live/shop*
// @grant       GM_addStyle
// @version     1.1.16
// @author      fuwenchao
// @description 2022/7/19 21:02:40
// @icon        https://lf1-fe.ecombdstatic.com/obj/eden-cn/upqphj/homepage/icon.svg
// @run-at      document-start
// @require     https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @downloadURL		http://192.168.30.150/fuwenchao2426.github.io/monkey/抖音数据大屏_专业版.user.js

// ==/UserScript==

var moneyBar = ".container--n-Nt-";//金额栏
var talkBar = ".container--3klot";//评论栏
var moneyTitle = ".name--Z2MF5";//金额标题
var moneyPlant = ".create--JrDTU";//金额计划
var openLive = ".button--MreHt";//打开直播
var onlyOld = "span:contains('只看老客')";//只看老客
var userName = ".name--5jIOm";//用户名
var userText = ".msg--i5SPb";//用户评论
var talk = ".comment--FnhEx";//单条评论
var talkBox = ".comments--4BHpj";//评论容器
var volText = ".name--15gWK";//参数文本提示
var volBox = ".container--wSBB3";//单个参数容器
var volBoxBox = ".indicators--v8b1W";//总参数容器
var moneyBox = ".hugeNumberContainer--7-ip-";//金额容器
var fffbar = ".container";


GM_addStyle(`${moneyBox}{display:flex !important;justify-content:center !important;align-items:center !important;}`);//金额居中
GM_addStyle("#F{width:100vw;height:100vh;display:grid;grid-template-rows:minmax(200px,1fr) 2fr;padding:8px;grid-gap:8px;}");//#F
GM_addStyle(`${moneyBar}{height:100%;padding:8px 32px !important;display:grid !important;grid-template-rows:minmax(80px,1fr) 3fr}`);//
GM_addStyle(`${volBoxBox}{width:100%;display:grid !important;grid-template-columns:1fr 1fr 1fr !important;grid-gap:8px !important}`);//总参数容器排列
GM_addStyle(`${volBox}{font-size:1.2em !important;line-height:1em !important;width:100px !important;height:60px !important;}`);//单个参数容器
GM_addStyle(`${volText} span{font-size:.8em !important;line-height:1em !important}`);//文本提示
GM_addStyle(".zh-cn{font-size:.6em !important;line-height:1em !important}");//中文 分钟
GM_addStyle(`${talk}:last-child span{font-size:2em !important;}`);//最后一条评论 放大
GM_addStyle(`${talkBox}{max-height:50vh}`);//聊天最大高度





//jquery 判断元素是否存在
$.fn.exist = function () {
  return $(this).length > 0;
}

//循环等待元素存在 则删除
function waitForExist(selector, callback) {
  if ($(selector).exist()) {
    callback();
  } else {
    setTimeout(function () {
      waitForExist(selector, callback);
      //console.log(selector + ' is not exist');
    }, 100);
  }
}



(function () {
  waitForExist('#browser-blocker-plugin-mask', function () { //等待浏览器插件提示
    $('#browser-blocker-plugin-mask').remove();
    console.info('移除浏览器插件提示');
  });

  waitForExist(talkBar, function () { //等待页面加载完成
    //#root 前 插入 #F
    $("<div id='F'></div>").insertBefore('#root');
    $('#F').append($(moneyBar));
    $('#F').append($(talkBar));
    $('#root').remove();

    $(moneyTitle).remove();//金额
    $(moneyPlant).remove();//计划
    $(openLive).remove();//打开直播
    $(onlyOld).remove();//只看老用户

    $(volBoxBox).append($(volBox));
  });

  waitForExist(talk, function () { //等待评论

    $(talkBox).on("click", talk, function () {//点击评论
      fname = makeUsername($(userName, this).text());
      ftext = makeUsertext($(userName, this).next().text());
      readText(fname + ftext);
    });

    var num = 0;
    //每100ms 检测一次 talk 个数
    var TimerTlak = setInterval(() => {
      length = $(talk).length;
      if (length > num) {
        username = makeUsername($(userName).eq(num).text());
        usertext = makeUsertext($(userName).next().eq(num).text());

        readText(username + usertext);
        //talkBox 滚动条滚动到底部
        $(talkBox).scrollTop($(talkBox)[0].scrollHeight);
        num++;
      }
    }, 100);
  });

  waitForExist('.odometer-value', function () { //等待金额
    var lastmoney = 0;
    var signmoneychange = false;
    var TimerMoney = setInterval(() => {
      var nowmoney = $('.odometer-value').text();
      if (nowmoney != lastmoney) {
        if (!signmoneychange) {
          signmoneychange = true;
          setTimeout(() => {
            var nowmoney = $('.odometer-value').text();
            console.log(nowmoney, lastmoney);
            readText('哒哒！抖店收款：' + (nowmoney - lastmoney) + "米");
            lastmoney = nowmoney;
            signmoneychange = false;
          }, 5 * 1000);
        }
      }
    }, 1000);
  });

})();


function makeUsername(username) {//处理用户名
  username = username.replace(/\：/g, "说:");//:替换为"说"
  username = username.replace(/用户[0-9]*([0-9]{4})/g, "尾号$1");// "用户1234567" 替换为 "尾号4567"
  //数字替换为中文 0-9 替换为 零幺贰叁肆伍陆柒捌玖拾
  username = username.replace(/[0-9]/g, function (match) {
    //零幺贰叁肆伍陆柒捌玖拾
    var chinese = ["零", "幺", "二", "三", "四", "五", "六", "七", "八", "九", "十"];
    return chinese[match];
  });
  return username;
}

function makeUsertext(text) {//处理评论
  text = text.replace(/微信/g, "微小微");//微信 替换为 微小微
  text = text.replace(/钱/g, "米");//钱 替换为 米
  return text;
}

//朗读文本
function readText(text) {
  console.log(text);
  var msg = new SpeechSynthesisUtterance(text);
  msg.voice = speechSynthesis.getVoices()[0]; //设置发音人
  msg.rate = 1.5; //设置语速
  msg.volume = 1; //设置音量
  msg.pitch = 1;  //设置语调
  window.speechSynthesis.speak(msg);  //播放语音
}

