<template>
  <div class="history">
    <el-form>
      <el-form-item>
        <el-date-picker
          v-model="formData.time"
          type="datetime"
          placeholder="选择提醒时间"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="save">保存</el-button>
      </el-form-item>
    </el-form>
    <h1 class="history-title">浏览记录</h1>
    <ul class="history-list">
      <li
        class="history-list-item"
        v-for="(item, index) in urlList"
        :key="index"
        @click="gotoUrl(item.url)"
      >
        {{ item.title }} | {{ item.time }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "App",
  components: {},
  data() {
    return {
      formData: {
        time: "",
        url: "",
        title: "",
        position: {
          x: 0,
          y: 0,
        },
      },
      urlList: [],
    };
  },
  beforeMount() {
    const _this = this;
    chrome.storage.sync.get(
      "urlList",
      function (items) {
        _this.urlList = items.urlList || [];
        console.log(items);
      }.bind(this)
    );
  },
  methods: {
    save() {
      const _this = this;
      chrome.tabs.getSelected(null, function (tab) {
        console.log(tab);
        _this.formData.title = tab.title;
        _this.formData.url = tab.url;
      });
      console.log(this.urlList);
      this.urlList.push(this.formData);
      chrome.storage.sync.set({ urlList: this.urlList });
    },
    gotoUrl(url) {
      window.open(url);
    },
  },
};
</script>
<style lang="scss" scoped>
.history {
  padding: 16px;
  // background-color: ;
}
</style>
<style>
html {
  width: 400px;
  height: 600px;
  background: transparent;
}
</style>
