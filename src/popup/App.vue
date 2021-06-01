<template>
  <div class="history">
    <!-- <el-button slot="reference" type="text"
      ><i class="el-icon-tickets"></i> 添加到提醒清单</el-button
    > -->
    <div class="picker-wrap">
      <h2 class="site-title">
        <span>当前页面：</span>
        <img class="site-icon" :src="curTabInfo.favIconUrl" alt="" />
        <span>{{ curTabInfo.title }}</span>
      </h2>
      <el-date-picker
        v-model="time"
        type="datetime"
        placeholder="选择提醒时间"
        value-format="timestamp"
        size="mini"
      >
      </el-date-picker>
      &nbsp;&nbsp;
      <el-button type="text" @click="save" :disabled="!time">保存</el-button>
    </div>

    <!-- <h1 class="history-title"></h1> -->
    <el-table :data="urlList" :show-header="false">
      <el-table-column width="200px">
        <template slot-scope="scope">
          <h2 class="site-title">
            <img class="site-icon" :src="scope.row.favIconUrl" alt="" />
            <span>{{ scope.row.title }}</span>
          </h2>
          <p>提醒时间：{{ scope.row.time | formatTime }}</p>
        </template>
      </el-table-column>
      <el-table-column
        prop="url"
        width="230px"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column width="50px">
        <template slot-scope="scope">
          <el-button type="text" @click="deleteUrl(scope.$index)"
            >忽略</el-button
          >
        </template>
      </el-table-column>
      <el-table-column></el-table-column>
    </el-table>
  </div>
</template>

<script>
import dayjs from "dayjs";
export default {
  name: "App",
  components: {},
  data() {
    return {
      curTabInfo: {
        title: "",
        url: "",
        favIconUrl: "",
      },
      time: "",
      urlList: [], //保存的链接列表
    };
  },
  beforeMount() {
    this.getCurTabInfo();
    this.getUrlListFromStorage();
  },
  filters: {
    formatTime(val) {
      return dayjs(val).format("MM-DD HH:mm:ss");
    },
  },
  methods: {
    getCurTabInfo() {
      const _this = this;
      chrome.tabs.getSelected(null, function (tab) {
        console.log("tab============", tab);
        Object.keys(_this.curTabInfo).forEach((k) => {
          _this.curTabInfo[k] = tab[k] || "";
        });
      });
    },
    //从本地存储获取urlList
    getUrlListFromStorage() {
      setInterval(() => {
        const _this = this;
        chrome.storage.sync.get(
          "urlList",
          function (items) {
            _this.urlList = items.urlList || [];
            console.log(items.urlList);
          }.bind(this)
        );
      }, 1000);
    },
    // urlList保存到本地
    setUrlListToStorage() {
      const _this = this;
      chrome.storage.sync.set({ urlList: _this.urlList });
    },
    save() {
      const _this = this;
      chrome.tabs.getSelected(null, function (tab) {
        const { title, url, favIconUrl } = tab;
        const item = {
          url,
          title,
          favIconUrl,
          time: _this.time,
          id: `${Date.now()}`,
        };
        _this.urlList.unshift(item);
        _this.time = "";
        _this.$message.success("保存成功~");
        _this.setUrlListToStorage();
      });
    },
    deleteUrl(index) {
      this.urlList.splice(index, 1);
      this.setUrlListToStorage();
    },
    gotoUrl(url) {
      window.open(url);
    },
    clear() {
      this.urlList = [];
      chrome.storage.clear();
    },
  },
};
</script>
<style lang="scss" scoped>
.history {
  padding: 16px;
  // background-color: ;
  .site-title {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }
  .site-icon {
    display: inline-block;
    position: relative;
    top: -1px;
    width: 15px;
    height: 15px;
    margin-right: 8px;
  }
}
</style>
<style lang="scss">
html {
  width: 600px;
  height: 600px;
  background: transparent;
}
</style>
