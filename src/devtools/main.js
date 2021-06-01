import Vue from "vue";
import App from "./App.vue";
chrome.devtools.panels.create(
  "DelayRead",
  "icons/logo.png",
  "devtools.html",
  function (panel) {
    console.log("面板创建成功！");
  }
);
/* eslint-disable no-new */
new Vue({
  el: "#app",
  render: (h) => h(App),
});
