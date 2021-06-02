browser.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log("Hello from the background");

  browser.tabs.executeScript({
    file: "content-script.js",
  });
});
let urlList = [];
/**
 * 轮询当Urllist
 */
(function setNoticeTimer() {
  setTimeout(() => {
    chrome.storage.sync.get(
      "urlList",
      function (items) {
        if (items?.urlList?.length) {
          checkIsNeedNotice(items.urlList);
          urlList = items.urlList;
        }
      }.bind(this)
    );
    setNoticeTimer();
  }, 2000);
})();
//检查是否需要提醒
function checkIsNeedNotice(urlList = []) {
  const now = Date.now();
  urlList.forEach((item, index) => {
    var timeDiff = now - item.time
    console.log(item.title, now, item.time, timeDiff);
    if (timeDiff > 0 && timeDiff < 3000) {
      toastNotice(item, item.id);
    }
  });
}
//弹出提醒
function toastNotice(item, id) {
  chrome.notifications.create(id, {
    type: "basic",
    iconUrl: "../icons/16.png",
    title: "DelayRead提醒您浏览",
    message: item.title,
    requireInteraction: true,
  });
}

chrome.notifications.onClicked.addListener(function (id) {
  if (id == null) {
    return;
  }
  const i = urlList.findIndex((i) => i.id === id);
  if (i > -1) {
    window.open(urlList.find((i) => i.id === id).url);
    urlList.splice(i, 1);
    chrome.storage.sync.set({ urlList: urlList });
    chrome.notifications.clear(id);
  }
});

chrome.commands.onCommand.addListener(function (command) {
  var strTime = command.replace("add_delay_read_", "")
  chrome.tabs.getSelected(null, function (tab) {
    const { title, url, favIconUrl } = tab;
    const item = {
      url,
      title,
      favIconUrl,
      time: 0,
      id: `${new Date().getTime() + Math.round(Math.random()*9999999)}`,
    };
    item.favIconUrl = item.favIconUrl ? item.favIconUrl : "../icons/16.png";
    var timestamp =new Date().getTime();
    item.time = timestamp + parseInt(strTime) * 60 * 1000;
    urlList.unshift(item);
    chrome.storage.sync.set({ urlList: urlList });
  });
  chrome.notifications.create(null, {
    type: "basic",
    iconUrl: "../icons/16.png",
    title: "延迟阅读",
    message: "添加成功, " + strTime + "min 后提醒!",
    requireInteraction: true,
  });
});