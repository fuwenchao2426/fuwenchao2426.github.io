// ==UserScript==
// @name        电商罗盘-直播列表
// @namespace   Violentmonkey Scripts
// @match       https://compass.jinritemai.com/shop
// @grant       none
// @version     1.1.1
// @author      fuwenchao
// @description 2022/7/19 21:02:40
// @icon        https://p1-ecda.byteimg.com/tos-cn-i-n15nrygpm8/b254ef1064cb135381e615c072d4cf00.png~tplv-n15nrygpm8-image.image
// @run-at      document-end
// @require     https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @downloadURL http://192.168.30.150/monkey/电商罗盘-直播列表.user.js
// ==/UserScript==

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
            console.log(selector + ' is not exist');
        }, 100);
    }
}

(function () {
    //等待直播列表加载完成
    waitForExist('#browser-blocker-plugin-mask', function () {
        $('#browser-blocker-plugin-mask').remove();
        console.info('移除浏览器插件提示');
    });
    window.location.href = 'https://compass.jinritemai.com/shop/live-list';
})();
