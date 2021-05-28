import Vue from "vue";
import App from "./App.vue";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import "@/common/styles/reset.css";
Vue.use(ElementUI);
/* eslint-disable no-new */
new Vue({
  el: "#app",
  render: (h) => h(App),
});
